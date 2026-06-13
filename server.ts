import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_USER || "ethereal.user",
      pass: process.env.SMTP_PASS || "ethereal.pass",
    },
  });

  // API Route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/order-notification", async (req, res) => {
    try {
      const { email, orderDetails } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      console.log(`Sending order notification to ${email}...`);
      
      let testAccount;
      let activeTransporter = transporter;

      // Use Ethereal if no SMTP is configured to simulate sending an email
      if (!process.env.SMTP_HOST) {
        console.log("No SMTP configured. Using Ethereal for testing...");
        testAccount = await nodemailer.createTestAccount();
        activeTransporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      }

      const info = await activeTransporter.sendMail({
        from: '"EzziArt Custom Framing" <no-reply@ezziart.com>',
        to: email,
        subject: "Your Custom Order Summary - EzziArt",
        html: `
          <h1>Thanks for starting your custom frame order!</h1>
          <p>Here is a summary of your requested frame:</p>
          <ul>
            <li><strong>Artwork Size:</strong> ${orderDetails.width} × ${orderDetails.height} inches</li>
            <li><strong>Frame Style:</strong> ${orderDetails.frameName}</li>
            <li><strong>Framing Type:</strong> ${orderDetails.framingTypeName}</li>
            <li><strong>Mat:</strong> ${orderDetails.matName}</li>
            <li><strong>Glass:</strong> ${orderDetails.glassName}</li>
          </ul>
          <h3>Estimated Total: $${orderDetails.estimatedPrice}</h3>
          <p>Please complete your checkout via the WhatsApp link provided.</p>
          <br />
          <p>Best regards,</p>
          <p>EzziArt Team</p>
        `,
      });

      console.log("Message sent: %s", info.messageId);
      if (!process.env.SMTP_HOST) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }

      res.json({ success: true, messageId: info.messageId });
    } catch (error) {
      console.error("Failed to send email", error);
      res.status(500).json({ error: "Failed to send email notification" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      try {
        let template = await fs.promises.readFile(
          path.resolve(process.cwd(), "index.html"),
          "utf-8"
        );
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
