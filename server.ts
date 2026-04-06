import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bodyParser from "body-parser";
import { google } from "googleapis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // API Route for sending email
  app.post("/api/send-email", async (req, res) => {
    const { firstName, lastName, phone, message } = req.body;
    const churchEmail = process.env.CHURCH_EMAIL || "rehobothdgul@gmail.com";
    const apiKey = process.env.GMAIL_API_KEY;

    if (!apiKey) {
      console.error("GMAIL_API_KEY is missing in environment variables.");
      return res.status(500).json({ error: "Gmail API Key is not configured in the server environment." });
    }

    try {
      // Initialize Gmail API with the provided API Key
      // Note: Gmail API's 'send' method usually requires OAuth2. 
      // We are using the key as requested by the user.
      const gmail = google.gmail({ version: "v1", auth: apiKey });
      
      const subject = `New Prayer Request from ${firstName} ${lastName}`;
      const emailContent = `
New Prayer Request Received via Website:

Name: ${firstName} ${lastName}
Phone: ${phone}

Message:
${message}
      `.trim();

      // Construct the RFC 2822 formatted email
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      const messageParts = [
        `To: ${churchEmail}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        emailContent,
      ];
      const raw = Buffer.from(messageParts.join('\n'))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Attempt to send the message
      // Using 'me' as userId assumes the API key is associated with an account 
      // or the key has sufficient permissions.
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: raw,
        },
      });

      res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error: any) {
      console.error("Error sending email via Gmail API:", error);
      
      // Provide a helpful error message if it's an auth issue
      let errorMessage = "Failed to send email. Please ensure the Gmail API key is valid and has the necessary permissions.";
      if (error.message && error.message.includes("auth")) {
        errorMessage = "Authentication failed. The Gmail API usually requires OAuth2 for sending emails. Please check your API key configuration.";
      }
      
      res.status(500).json({ error: errorMessage, details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
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

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
