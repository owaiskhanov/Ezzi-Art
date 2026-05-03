const fs = require('fs');

async function downloadAndExtract() {
  try {
    const url = "https://eonokgjkgvtqamfhvyuv.supabase.co/storage/v1/object/sign/EzziArt/About%20us/About%20us.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hYWJjMDc0ZS01MWVhLTQ5NzctYmE2MC1jM2I3ZWNmZDVhNDAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFenppQXJ0L0Fib3V0IHVzL0Fib3V0IHVzLnBkZiIsImlhdCI6MTc3NzgxMDAwOCwiZXhwIjoxODA5MzQ2MDA4fQ.5ZsLXXkripxdauOW8vyGEX7LgRO5uRcmOvHfaulcXVs";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch PDF");
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Use pdf-parse explicitly requiring the index.js inside lib/ folder
    // The previous error was because we used ESM and CJS mix loosely
    const pdf = require('pdf-parse/lib/pdf-parse.js');
    const data = await pdf(buffer);
    console.log("--- PDF CONTENT START ---");
    console.log(data.text);
    console.log("--- PDF CONTENT END ---");
  } catch (err) {
    console.error("Error reading PDF:", err.message);
  }
}

downloadAndExtract();
