import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

async function extract() {
  try {
    const url = "https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/sign/EzziArt/About%20us/About%20us.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hYWJjMDc0ZS01MWVhLTQ5NzctYmE2MC1jM2I3ZWNmZDVhNDAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFenppQXJ0L0Fib3V0IHVzL0Fib3V0IHVzLnBkZiIsImlhdCI6MTc3NzgxMDAwOCwiZXhwIjoxODA5MzQ2MDA4fQ.5ZsLXXkripxdauOW8vyGEX7LgRO5uRcmOvHfaulcXVs";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch PDF: " + res.statusText);
    const buffer = await res.arrayBuffer();
    console.log("PDF LIB TYPE:", typeof pdf, Object.keys(pdf));
    const pdfFn = typeof pdf === 'function' ? pdf : pdf.default;
    const data = await pdfFn(Buffer.from(buffer));
    console.log("--- PDF CONTENT START ---");
    console.log(data.text);
    console.log("--- PDF CONTENT END ---");
  } catch (err) {
    console.error("Error reading PDF:", err);
  }
}

extract();
