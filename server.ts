import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { google } from "googleapis";
import multer from "multer";

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  doc, 
  writeBatch, 
  serverTimestamp, 
  Timestamp, 
  deleteDoc, 
  limit,
  increment
} from 'firebase/firestore';
import "dotenv/config";

import firebaseConfigJson from "./firebase-applet-config.json";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: process.env.FIREBASE_APP_ID || firebaseConfigJson.appId,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || firebaseConfigJson.measurementId,
};

// Initialize Firebase Client SDK
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfigJson.firestoreDatabaseId || '(default)');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public", "journey"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'testimony-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

export async function createApp(options: { includeFrontend?: boolean } = {}) {
  const { includeFrontend = process.env.VERCEL !== '1' } = options;
  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  const getAdminPassword = () => process.env.ADMIN_PASSWORD;

  const verifyAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const configuredAdminPassword = getAdminPassword();
    if (!configuredAdminPassword) {
      return res.status(500).json({ error: "Admin password is not configured." });
    }

    const adminPassword = req.headers['x-admin-password'];
    if (adminPassword !== configuredAdminPassword) {
      return res.status(401).json({ error: "Unauthorized access." });
    }
    next();
  };

  // API Route for Admin Login/Verify
  app.post("/api/admin/verify", (req, res) => {
    const { password } = req.body;
    const configuredAdminPassword = getAdminPassword();
    if (!configuredAdminPassword) {
      return res.status(500).json({ error: "Admin password is not configured." });
    }

    if (password === configuredAdminPassword) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ error: "Incorrect admin password" });
    }
  });

  // Test Route for Firebase Connectivity
  app.get("/api/test-firebase", async (req, res) => {
    try {
      console.log("Attempting to test Firebase connection...");
      const snapshot = await getDocs(query(collection(db, 'testimonies'), limit(1)));
      console.log("Firebase snapshot received:", snapshot.empty ? "Empty" : "Contains Docs");
      if (snapshot.empty) {
        return res.status(200).json({ status: "success", message: "Connected! Collection 'testimonies' is empty." });
      }
      const firstDoc = snapshot.docs[0].data();
      res.status(200).json({ status: "success", message: "Connected!", data: firstDoc });
    } catch (error: any) {
      console.error("Firebase Test Error:", error);
      res.status(500).json({ 
        status: "error", 
        message: error.message,
        code: error.code
      });
    }
  });

  // API Route for Public to get Approved Testimonies
  app.get("/api/testimonies/approved", async (req, res) => {
    console.log("GET /api/testimonies/approved called");
    try {
      console.log("Starting getDocs for approved testimonies...");
      const testimoniesCollection = collection(db, 'testimonies');
      const approvedQuery = query(testimoniesCollection, where('status', '==', 'APPROVED'));
      
      const snapshot = await getDocs(approvedQuery);
      console.log(`Snapshot received. Docs count: ${snapshot.docs.length}`);
      
      const testimonies = snapshot.docs.map(d => {
        const data = d.data();
        return {
          ...data,
          id: d.id, // Prefer the actual document ID
          likes: data.likes || 0
        };
      });
      
      console.log("Successfully prepared testimonies list.");
      res.status(200).json(testimonies);
    } catch (error: any) {
      console.error("Error fetching approved testimonies:", error);
      res.status(500).json({ error: "Failed to fetch approved testimonies.", details: error.message });
    }
  });

  // API Route for Fetching Devotions
  app.get("/api/devotions", async (req, res) => {
    try {
      console.log("Fetching devotions from Firestore...");
      const snapshot = await getDocs(collection(db, 'devotions'));
      
      const devotions = snapshot.docs.map(d => ({
        ...d.data(),
        id: d.id
      }));

      // Sort by date descending in JavaScript
      devotions.sort((a: any, b: any) => {
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        return dateB - dateA;
      });
      
      console.log(`Successfully fetched ${devotions.length} devotions.`);
      res.status(200).json(devotions);
    } catch (error: any) {
      console.error("Critical error fetching devotions:", error);
      res.status(500).json({ 
        error: "Failed to fetch devotions.", 
        details: error.message 
      });
    }
  });

  // API Route for Admin to manage Devotions (Create/Update)
  app.post("/api/admin/devotions", verifyAdmin, async (req, res) => {
    const { id, title, scripture, content, nuggets, date, author } = req.body;

    try {
      if (id) {
        // Update
        await updateDoc(doc(db, 'devotions', id), { title, scripture, content, nuggets, date, author });
        res.status(200).json({ success: true, id });
      } else {
        // Create
        const docRef = await addDoc(collection(db, 'devotions'), {
          title, scripture, content, nuggets, date, author
        });
        res.status(200).json({ success: true, id: docRef.id });
      }
    } catch (error: any) {
      console.error("Error managing devotion:", error);
      res.status(500).json({ error: "Failed to manage devotion." });
    }
  });

  // API Route for Admin to delete Devotion
  app.delete("/api/admin/devotions/:id", verifyAdmin, async (req, res) => {
    const { id } = req.params;

    try {
      await deleteDoc(doc(db, 'devotions', id));
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error deleting devotion:", error);
      res.status(500).json({ error: "Failed to delete devotion." });
    }
  });

  // API Route for Devotion Reactions
  app.post("/api/devotions/:id/react", async (req, res) => {
    const { id } = req.params;
    const { reactionType } = req.body;

    const allowedReactions = [
      "Amen", "I receive", "Hallelujah", "Glory", "ThankYou", "Point taken", "Like"
    ];

    if (!allowedReactions.includes(reactionType)) {
      return res.status(400).json({ error: "Invalid reaction type." });
    }

    try {
      const devotionRef = doc(db, 'devotions', id);
      await updateDoc(devotionRef, {
        [`reactions.${reactionType}`]: increment(1)
      });
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error adding reaction:", error);
      res.status(500).json({ error: "Failed to add reaction." });
    }
  });
  
  // API Route for Admin to upload image
  app.post("/api/admin/upload-image", verifyAdmin, (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Upload error: " + err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      // Return the public URL path
      res.status(200).json({ 
        url: `/journey/${req.file.filename}`,
        success: true 
      });
    });
  });

  // API Route for Public to upload testimony pictures
  app.post("/api/testimony/upload-image", verifyAdmin, (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Upload error: " + err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      // Return the public URL path
      res.status(200).json({ 
        url: `/journey/${req.file.filename}`,
        success: true 
      });
    });
  });

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

  // API Route for Public Testimony Submission
  app.post("/api/testimony/submit", async (req, res) => {
    try {
      const { author, content, contact, location } = req.body;
      
      if (!author || !content || !contact || !location) {
        return res.status(400).json({ error: "Name, location, contact, and testimony content are required." });
      }

      await addDoc(collection(db, 'testimonies'), {
        id: Date.now().toString(),
        author,
        location,
        content,
        contact,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: 'PENDING'
      });
      
      return res.status(200).json({ 
        success: true, 
        message: "Your testimony has been submitted for review. Thank you!" 
      });
    } catch (error: any) {
      console.error("Critical submission error details:", error);
      return res.status(500).json({ 
        error: "Server Error", 
        message: "We encountered an internal error. Please try again later.",
        details: error.message 
      });
    }
  });

  // API Route for Admin to get Pending Testimonies
  app.get("/api/admin/pending-testimonies", verifyAdmin, async (req, res) => {
    try {
      const snapshot = await getDocs(query(collection(db, 'testimonies'), where('status', '==', 'PENDING')));
      
      const pendingTestimonies = snapshot.docs.map(d => {
        const data = d.data();
        return {
          ...data,
          id: d.id, // Prefer actual Firestore doc ID
        };
      });
      
      res.status(200).json(pendingTestimonies);
    } catch (error: any) {
      console.error("Error fetching pending testimonies:", error);
      res.status(500).json({ error: "Failed to fetch pending testimonies." });
    }
  });

  // API Route for Admin to manage Testimonies (Create/Update)
  app.post("/api/admin/testimonies", verifyAdmin, async (req, res) => {
    const { id, author, location, content, contact, date, status, likes, projectId } = req.body;

    try {
      if (id) {
        // Update
        await updateDoc(doc(db, 'testimonies', id), { 
          author, 
          location, 
          content, 
          contact, 
          date, 
          status,
          likes: likes || 0,
          projectId: projectId || null
        });
        res.status(200).json({ success: true, id });
      } else {
        // Create
        const docRef = await addDoc(collection(db, 'testimonies'), {
          author, 
          location, 
          content, 
          contact, 
          date, 
          status: status || 'APPROVED',
          likes: likes || 0,
          projectId: projectId || null,
          id: Date.now().toString() // Keep the legacy ID for compatibility if needed
        });
        res.status(200).json({ success: true, id: docRef.id });
      }
    } catch (error: any) {
      console.error("Error managing testimony:", error);
      res.status(500).json({ error: "Failed to manage testimony." });
    }
  });

  // API Route for Admin to delete Testimony
  app.delete("/api/admin/testimonies/:id", verifyAdmin, async (req, res) => {
    const { id } = req.params;

    try {
      await deleteDoc(doc(db, 'testimonies', id));
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error deleting testimony:", error);
      res.status(500).json({ error: "Failed to delete testimony." });
    }
  });

  // API Route for Admin to update a pending testimony (Status only)
  app.post("/api/admin/update-pending", verifyAdmin, async (req, res) => {
    const { id, status } = req.body; // 'APPROVED' or 'REJECTED'

    try {
      // Use the provided Firestore document ID directly
      await updateDoc(doc(db, 'testimonies', id), { status });
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Failed to update pending testimony:", error);
      res.status(500).json({ error: "Failed to update pending testimony." });
    }
  });

  // API Route for Admin to bulk update pending testimonies
  app.post("/api/admin/bulk-update-pending", verifyAdmin, async (req, res) => {
    const { ids, status } = req.body; // 'APPROVED' or 'REJECTED'

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No IDs provided." });
    }

    try {
      const batch = writeBatch(db);
      for (const id of ids) {
        const docRef = doc(db, 'testimonies', id);
        batch.update(docRef, { status });
      }
      
      await batch.commit();
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Failed to perform bulk update:", error);
      res.status(500).json({ error: "Failed to perform bulk update." });
    }
  });

  // API Route for Fetching Comments
  app.get("/api/comments/:testimonyId", async (req, res) => {
    const { testimonyId } = req.params;
    try {
      const snapshot = await getDocs(query(
        collection(db, 'comments'), 
        where('testimonyId', '==', testimonyId),
        orderBy('createdAt', 'desc')
      ));
      
      const comments = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          author: data.author,
          content: data.content,
          createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : data.createdAt
        };
      });
      
      res.status(200).json(comments);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments." });
    }
  });

  // API Route for Adding a Comment
  app.post("/api/comments/:testimonyId", async (req, res) => {
    const { testimonyId } = req.params;
    const { author, content } = req.body;
    
    if (!author || !content) {
      return res.status(400).json({ error: "Author and content are required." });
    }

    try {
      const commentRef = await addDoc(collection(db, 'comments'), {
        testimonyId,
        author,
        content,
        createdAt: serverTimestamp()
      });
      
      res.status(200).json({
        id: commentRef.id,
        author,
        content,
        createdAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Failed to add comment." });
    }
  });

  /*
  // API Route for Flutterwave Payment Initiation
  app.post("/api/pay/initiate", async (req, res) => {
    const { amount, email, name, phone } = req.body;
    
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey) {
      console.warn("FLUTTERWAVE_SECRET_KEY is missing. Payment functionality will not work until configured.");
      return res.status(500).json({ 
        error: "Online payment is not fully configured. Please provide the Flutterwave Secret Key in the environment variables." 
      });
    }

    try {
      // Use standard fetch (available in Node 18+)
      const response = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify({
          tx_ref: `LF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          amount: amount || 1000,
          currency: "UGX",
          redirect_url: `https://${req.get('host')}/give`,
          customer: {
            email: email || "donor@example.com",
            phonenumber: phone || "0700000000",
            name: name || "Anonymous Donor",
          },
          customizations: {
            title: "Louder Fellowship Ministry",
            description: "Winning souls and equipping saints",
            logo: "https://i.ibb.co/Z1mL88kL/image.png",
          },
        }),
      });

      const data: any = await response.json();
      
      if (data.status === "success" && data.data && data.data.link) {
        res.status(200).json({ link: data.data.link });
      } else {
        console.error("Flutterwave API Error:", data);
        res.status(400).json({ error: data.message || "Failed to initiate payment." });
      }
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      res.status(500).json({ error: "Internal server error during payment initiation." });
    }
  });
  */

  // API Route for Mailing List Subscription
  app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        createdAt: serverTimestamp()
      });
      
      res.status(200).json({ success: true, message: "Subscribed successfully!" });
    } catch (error: any) {
      console.error("Error saving subscriber:", error);
      res.status(500).json({ error: "Internal server error while subscribing." });
    }
  });

  if (!includeFrontend) {
    return app;
  }

  // Vite middleware for local development
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

  return app;
}

async function startServer() {
  const app = await createApp({ includeFrontend: true });
  const PORT = Number(process.env.PORT) || 3000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

const entrypoint = process.argv[1]?.replace(/\\/g, '/');
const isDirectServerRun = entrypoint?.endsWith('/server.ts') || entrypoint?.endsWith('/server.cjs');

if (process.env.VERCEL !== '1' && isDirectServerRun) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
}
