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

  // Helper route to get Auth URL (for developer use)
  app.get("/api/auth/google", (req, res) => {
    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return res.status(500).send("GMAIL_CLIENT_ID or GMAIL_CLIENT_SECRET missing.");
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      `https://${req.get('host')}/api/auth/google/callback`
    );

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/gmail.send"],
      prompt: "consent"
    });

    res.redirect(url);
  });

  // Callback route to get the Refresh Token
  app.get("/api/auth/google/callback", async (req, res) => {
    const code = req.query.code as string;
    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      `https://${req.get('host')}/api/auth/google/callback`
    );

    try {
      const { tokens } = await oauth2Client.getToken(code);
      res.json({
        message: "Authorization successful! Please copy the refresh_token below and add it to your environment variables.",
        refresh_token: tokens.refresh_token
      });
    } catch (error: any) {
      res.status(500).send("Error retrieving access token: " + error.message);
    }
  });

  // API Route for sending email
  app.post("/api/send-email", async (req, res) => {
    const { firstName, lastName, phone, message } = req.body;
    const churchEmail = process.env.CHURCH_EMAIL || "rehobothdgul@gmail.com";
    
    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      console.error("Gmail OAuth2 credentials (ID, Secret, or Refresh Token) are missing.");
      return res.status(500).json({ 
        error: "Gmail OAuth2 is not fully configured. Please provide the Client ID, Client Secret, and Refresh Token in the environment variables." 
      });
    }

    try {
      // Initialize OAuth2 Client
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
      oauth2Client.setCredentials({ refresh_token: refreshToken });

      const gmail = google.gmail({ version: "v1", auth: oauth2Client });
      
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

      // Send the message
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: raw,
        },
      });

      res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error: any) {
      console.error("Error sending email via Gmail OAuth2:", error);
      res.status(500).json({ 
        error: "Failed to send email. Please ensure your Refresh Token is valid and the Gmail API is enabled for your project.",
        details: error.message 
      });
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
