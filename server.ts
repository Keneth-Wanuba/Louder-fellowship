import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { google } from "googleapis";
import multer from "multer";
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp,
  Timestamp,
  limit,
  increment,
} from 'firebase/firestore';
import "dotenv/config";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID || 'kennyboa-b3902',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, '(default)');
const analyticsEventsCollection = () => collection(db, 'subscribers', '_analytics', 'events');

const cleanObject = <T extends Record<string, any>>(data: T) => (
  Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as Partial<T>
);

const normalizeProgramEvents = (events: any) => (
  Array.isArray(events)
    ? events
        .map((event) => ({
          time: String(event?.time ?? ''),
          name: String(event?.name ?? ''),
          desc: String(event?.desc ?? ''),
        }))
        .filter((event) => event.time || event.name || event.desc)
    : []
);

const normalizeStringList = (value: any) => (
  Array.isArray(value) ? value.filter(Boolean).map(String) : []
);

const normalizeImpactStats = (value: any) => (
  Array.isArray(value)
    ? value
        .map((item) => ({
          label: String(item?.label ?? ''),
          value: String(item?.value ?? ''),
        }))
        .filter((item) => item.label || item.value)
    : []
);

const normalizeStories = (value: any) => (
  Array.isArray(value)
    ? value
        .map((item) => ({
          quote: String(item?.quote ?? ''),
          name: String(item?.name ?? ''),
        }))
        .filter((item) => item.quote || item.name)
    : []
);

const toSafeString = (value: any, maxLength = 500) => (
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
);

const getClientIp = (req: express.Request) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  const firstForwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0];
  return toSafeString(firstForwardedIp || req.socket.remoteAddress || 'unknown', 80);
};

const padDatePart = (value: number) => String(value).padStart(2, '0');

const getDateKey = (date: Date) => (
  `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`
);

const startOfDay = (date: Date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const addDays = (date: Date, days: number) => {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
};

const startOfWeek = (date: Date) => {
  const value = startOfDay(date);
  const day = value.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return addDays(value, mondayOffset);
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const startOfYear = (date: Date) => new Date(date.getFullYear(), 0, 1);

const getMonthKey = (date: Date) => `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}`;

const formatShortDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const formatMonthLabel = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

type BibleVersionManifestEntry = {
  id: string;
  label: string;
  name: string;
  language: string;
  year?: string;
  assetUrl: string;
  copyright?: string;
};

type BibleVerse = {
  book: string;
  chapter: number;
  verse: number;
  ref: string;
  text: string;
};

const canonicalBibleBooks = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
  'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
  '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
  '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation',
];

const normalizeBibleBook = (value: any) => {
  const rawBook = toSafeString(value, 80);
  if (!/^\d+$/.test(rawBook)) return rawBook;
  const numericBook = Number(rawBook);
  return canonicalBibleBooks[numericBook - 1] || rawBook;
};

const bibleManifestUrl = process.env.VITE_BIBLE_MANIFEST_URL
  || 'https://xtnaajnhydwzhgbkzscv.supabase.co/storage/v1/object/public/bibles/bible-versions-manifest.json';
const supabaseBibleBaseUrl = process.env.VITE_SUPABASE_URL || 'https://xtnaajnhydwzhgbkzscv.supabase.co';
const supabaseBibleBucket = process.env.SUPABASE_BIBLE_BUCKET || 'bibles';
const bibleCacheTtlMs = 60 * 60 * 1000;
const bibleVersionCacheLimit = 3;
let bibleManifestCache: { expiresAt: number; versions: BibleVersionManifestEntry[] } | null = null;
const bibleVersionCache = new Map<string, { expiresAt: number; verses: BibleVerse[] }>();

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Bible asset request failed with status ${response.status}`);
  }
  return response.json();
};

const getBibleManifest = async () => {
  if (bibleManifestCache && bibleManifestCache.expiresAt > Date.now()) {
    return bibleManifestCache.versions;
  }

  const manifest = await fetchJson(bibleManifestUrl);
  if (!Array.isArray(manifest)) {
    throw new Error('Bible manifest is not an array.');
  }

  const trustedOrigin = new URL(supabaseBibleBaseUrl).origin;
  const trustedPathPrefix = `/storage/v1/object/public/${supabaseBibleBucket}/`;
  const versions = manifest
    .map((entry: any) => ({
      id: toSafeString(entry?.id, 120),
      label: toSafeString(entry?.label, 120),
      name: toSafeString(entry?.name, 160),
      language: toSafeString(entry?.language, 120),
      year: toSafeString(entry?.year, 20),
      assetUrl: toSafeString(entry?.assetUrl, 500),
      copyright: toSafeString(entry?.copyright, 1000),
    }))
    .filter((entry) => {
      if (!entry.id || !entry.assetUrl) return false;
      try {
        const assetUrl = new URL(entry.assetUrl);
        return assetUrl.origin === trustedOrigin && assetUrl.pathname.startsWith(trustedPathPrefix);
      } catch {
        return false;
      }
    });

  bibleManifestCache = {
    expiresAt: Date.now() + bibleCacheTtlMs,
    versions,
  };
  return versions;
};

const getBibleVersion = async (versionId: string) => {
  const cached = bibleVersionCache.get(versionId);
  if (cached && cached.expiresAt > Date.now()) {
    bibleVersionCache.delete(versionId);
    bibleVersionCache.set(versionId, cached);
    return cached.verses;
  }

  const versions = await getBibleManifest();
  const version = versions.find((entry) => entry.id === versionId);
  if (!version) {
    throw new Error('Bible version was not found.');
  }

  const source = await fetchJson(version.assetUrl);
  const sourceVerses = Array.isArray(source)
    ? source
    : Array.isArray(source?.verses)
      ? source.verses
      : Array.isArray(source?.data)
        ? source.data
        : Array.isArray(source?.data?.verses)
          ? source.data.verses
          : null;
  if (!sourceVerses) {
    throw new Error('Bible version is not a verse array.');
  }

  const verses = sourceVerses
    .map((entry: any) => {
      const book = normalizeBibleBook(entry?.book);
      const chapter = Number(entry?.chapter);
      const verse = Number(entry?.verse);
      return {
        book,
        chapter,
        verse,
        ref: book && Number.isInteger(chapter) && Number.isInteger(verse)
          ? `${book} ${chapter}:${verse}`
          : toSafeString(entry?.ref, 120),
        text: String(entry?.text ?? '').trim(),
      };
    })
    .filter((entry) => (
      entry.book
      && Number.isInteger(entry.chapter)
      && entry.chapter > 0
      && Number.isInteger(entry.verse)
      && entry.verse > 0
      && entry.text
    ));

  bibleVersionCache.set(versionId, {
    expiresAt: Date.now() + bibleCacheTtlMs,
    verses,
  });
  while (bibleVersionCache.size > bibleVersionCacheLimit) {
    const oldestVersionId = bibleVersionCache.keys().next().value;
    if (!oldestVersionId) break;
    bibleVersionCache.delete(oldestVersionId);
  }

  return verses;
};

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

export function createApiApp(options: { includeUnprefixedRoutes?: boolean } = {}) {
  const app = express();
  const { includeUnprefixedRoutes = process.env.VERCEL === '1' } = options;

  app.use((req, _res, next) => {
    if (process.env.VERCEL === '1' && req.url && !req.url.startsWith('/api')) {
      req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
    }
    next();
  });

  app.use(cors());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  const apiRoute = (routePath: string): string | [string, string] => (
    includeUnprefixedRoutes ? [`/api${routePath}`, routePath] : `/api${routePath}`
  );

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
  app.post(apiRoute("/admin/verify"), (req, res) => {
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

  app.get(apiRoute("/admin/bible/versions"), verifyAdmin, async (_req, res) => {
    try {
      const versions = await getBibleManifest();
      res.json(versions.map(({ assetUrl: _assetUrl, ...version }) => version));
    } catch (error: any) {
      console.error('Failed to load Bible versions:', error);
      res.status(502).json({ error: error.message || 'Failed to load Bible versions.' });
    }
  });

  app.get(apiRoute("/admin/bible/books"), verifyAdmin, async (req, res) => {
    try {
      const versionId = toSafeString(req.query.version, 120);
      if (!versionId) {
        return res.status(400).json({ error: 'Bible version is required.' });
      }

      const verses = await getBibleVersion(versionId);
      const books = new Map<string, Set<number>>();
      verses.forEach((verse) => {
        if (!books.has(verse.book)) books.set(verse.book, new Set());
        books.get(verse.book)?.add(verse.chapter);
      });

      res.json(Array.from(books.entries()).map(([name, chapters]) => ({
        name,
        chapters: Array.from(chapters).sort((a, b) => a - b),
      })));
    } catch (error: any) {
      console.error('Failed to load Bible books:', error);
      const status = error.message === 'Bible version was not found.' ? 404 : 502;
      res.status(status).json({ error: error.message || 'Failed to load Bible books.' });
    }
  });

  app.get(apiRoute("/admin/bible/verses"), verifyAdmin, async (req, res) => {
    try {
      const versionId = toSafeString(req.query.version, 120);
      const book = toSafeString(req.query.book, 80);
      const chapter = Number(req.query.chapter);
      if (!versionId || !book || !Number.isInteger(chapter) || chapter < 1) {
        return res.status(400).json({ error: 'Version, book, and chapter are required.' });
      }

      const verses = await getBibleVersion(versionId);
      const chapterVerses = verses
        .filter((verse) => verse.book === book && verse.chapter === chapter)
        .sort((a, b) => a.verse - b.verse);

      if (chapterVerses.length === 0) {
        return res.status(404).json({ error: 'That Bible chapter was not found.' });
      }
      res.json(chapterVerses);
    } catch (error: any) {
      console.error('Failed to load Bible verses:', error);
      const status = error.message === 'Bible version was not found.' ? 404 : 502;
      res.status(status).json({ error: error.message || 'Failed to load Bible verses.' });
    }
  });

  // Test Route for Firebase Connectivity
  app.get(apiRoute("/test-firebase"), async (req, res) => {
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

  app.post(apiRoute("/analytics/pageview"), async (req, res) => {
    try {
      const pathValue = toSafeString(req.body?.path || '/', 240);
      if (!pathValue || pathValue.startsWith('/admin-portal-secret')) {
        return res.status(204).send();
      }

      const now = new Date();
      const event = {
        type: 'pageview',
        path: pathValue,
        title: toSafeString(req.body?.title, 180),
        referrer: toSafeString(req.body?.referrer, 300),
        sessionId: toSafeString(req.body?.sessionId || 'anonymous', 120),
        userAgent: toSafeString(req.headers['user-agent'], 300),
        ip: getClientIp(req),
        day: getDateKey(now),
        createdAt: Timestamp.fromDate(now),
        createdAtServer: serverTimestamp(),
      };

      await addDoc(analyticsEventsCollection(), event);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error recording analytics event:", error);
      res.status(204).send();
    }
  });

  app.get(apiRoute("/admin/analytics"), verifyAdmin, async (req, res) => {
    try {
      const snapshot = await getDocs(query(
        analyticsEventsCollection(),
        orderBy('createdAt', 'desc'),
        limit(1000)
      ));

      const now = new Date();
      const todayStart = startOfDay(now);
      const todayKey = getDateKey(now);
      const sevenDaysAgo = addDays(todayStart, -6);
      const thirtyDaysAgo = addDays(todayStart, -29);
      const annualStart = startOfYear(now);
      const analyticsStart = addDays(todayStart, -364);

      const events = snapshot.docs
        .map((d) => {
          const data = d.data();
          const createdAtDate = data.createdAt?.toDate?.() || new Date(0);
          return {
            id: d.id,
            path: String(data.path || '/'),
            title: String(data.title || ''),
            referrer: String(data.referrer || ''),
            sessionId: String(data.sessionId || 'anonymous'),
            userAgent: String(data.userAgent || ''),
            day: String(data.day || getDateKey(createdAtDate)),
            createdAt: createdAtDate,
          };
        })
        .filter((event) => event.createdAt >= analyticsStart);

      const uniqueSessions = new Set(events.map((event) => event.sessionId).filter(Boolean));
      const todayEvents = events.filter((event) => event.day === todayKey);
      const last7Events = events.filter((event) => event.createdAt >= sevenDaysAgo);
      const last30Events = events.filter((event) => event.createdAt >= thirtyDaysAgo);
      const annualEvents = events.filter((event) => event.createdAt >= annualStart);
      const pageCounts = new Map<string, number>();
      const referrerCounts = new Map<string, number>();
      const dailyCounts = new Map<string, number>();
      const dailyVisitors = new Map<string, Set<string>>();
      const weeklyBuckets = new Map<string, { label: string; pageViews: number; visitors: Set<string> }>();
      const monthlyBuckets = new Map<string, { label: string; pageViews: number; visitors: Set<string> }>();

      for (let i = 29; i >= 0; i -= 1) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const key = getDateKey(day);
        dailyCounts.set(key, 0);
        dailyVisitors.set(key, new Set());
      }

      for (let i = 7; i >= 0; i -= 1) {
        const weekStart = addDays(startOfWeek(now), i * -7);
        const weekEnd = addDays(weekStart, 6);
        const key = getDateKey(weekStart);
        weeklyBuckets.set(key, {
          label: `${formatShortDate(weekStart)}-${formatShortDate(weekEnd)}`,
          pageViews: 0,
          visitors: new Set(),
        });
      }

      for (let i = 11; i >= 0; i -= 1) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthlyBuckets.set(getMonthKey(month), {
          label: formatMonthLabel(month),
          pageViews: 0,
          visitors: new Set(),
        });
      }

      events.forEach((event) => {
        pageCounts.set(event.path, (pageCounts.get(event.path) || 0) + 1);
        if (event.referrer) {
          let referrerLabel = event.referrer;
          try {
            const url = new URL(event.referrer);
            referrerLabel = url.hostname;
          } catch {
            referrerLabel = event.referrer;
          }
          referrerCounts.set(referrerLabel, (referrerCounts.get(referrerLabel) || 0) + 1);
        }
        if (dailyCounts.has(event.day)) {
          dailyCounts.set(event.day, (dailyCounts.get(event.day) || 0) + 1);
          if (event.sessionId) {
            dailyVisitors.get(event.day)?.add(event.sessionId);
          }
        }

        const weekKey = getDateKey(startOfWeek(event.createdAt));
        const weekBucket = weeklyBuckets.get(weekKey);
        if (weekBucket) {
          weekBucket.pageViews += 1;
          if (event.sessionId) {
            weekBucket.visitors.add(event.sessionId);
          }
        }

        const monthBucket = monthlyBuckets.get(getMonthKey(event.createdAt));
        if (monthBucket) {
          monthBucket.pageViews += 1;
          if (event.sessionId) {
            monthBucket.visitors.add(event.sessionId);
          }
        }
      });

      const topPages = [...pageCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([path, views]) => ({ path, views }));

      const topReferrers = [...referrerCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([source, views]) => ({ source, views }));

      const daily = [...dailyCounts.entries()].map(([day, views]) => ({
        day,
        label: formatShortDate(new Date(`${day}T00:00:00`)),
        views,
        pageViews: views,
        visitors: dailyVisitors.get(day)?.size || 0,
      }));

      const weekly = [...weeklyBuckets.entries()].map(([weekStart, bucket]) => ({
        weekStart,
        label: bucket.label,
        pageViews: bucket.pageViews,
        visitors: bucket.visitors.size,
      }));

      const monthly = [...monthlyBuckets.entries()].map(([month, bucket]) => ({
        month,
        label: bucket.label,
        pageViews: bucket.pageViews,
        visitors: bucket.visitors.size,
      }));

      const annualVisitors = new Set(annualEvents.map((event) => event.sessionId).filter(Boolean));

      const recent = events.slice(0, 12).map((event) => ({
        id: event.id,
        path: event.path,
        referrer: event.referrer,
        createdAt: event.createdAt.toISOString(),
        userAgent: event.userAgent,
      }));

      res.status(200).json({
        totals: {
          pageViews: events.length,
          visitors: uniqueSessions.size,
          today: todayEvents.length,
          last7Days: last7Events.length,
          last30Days: last30Events.length,
          currentYear: annualEvents.length,
          currentYearVisitors: annualVisitors.size,
        },
        rollups: {
          daily,
          weekly,
          monthly,
          annual: {
            year: now.getFullYear(),
            label: String(now.getFullYear()),
            pageViews: annualEvents.length,
            visitors: annualVisitors.size,
          },
        },
        topPages,
        topReferrers,
        daily,
        recent,
      });
    } catch (error: any) {
      console.error("Error fetching analytics summary:", error);
      res.status(500).json({ error: "Failed to fetch analytics summary.", details: error.message });
    }
  });

  // API Route for Public to get Approved Testimonies
  app.get(apiRoute("/testimonies/approved"), async (req, res) => {
    console.log("GET /api/testimonies/approved called");
    try {
      console.log("Starting getDocs for approved testimonies...");
      const snapshot = await getDocs(query(collection(db, 'testimonies'), where('status', '==', 'APPROVED')));
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
  app.get(apiRoute("/devotions"), async (req, res) => {
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
  app.post(apiRoute("/admin/devotions"), verifyAdmin, async (req, res) => {
    const { id, title, scripture, themeScripture, content, nuggets, date, author } = req.body;
    const devotionPayload = cleanObject({
      title,
      scripture,
      themeScripture,
      content,
      nuggets,
      date,
      author,
    });

    try {
      if (id) {
        // Update
        await updateDoc(doc(db, 'devotions', id), devotionPayload);
        res.status(200).json({ success: true, id });
      } else {
        // Create
        const docRef = await addDoc(collection(db, 'devotions'), devotionPayload);
        res.status(200).json({ success: true, id: docRef.id });
      }
    } catch (error: any) {
      console.error("Error managing devotion:", error);
      res.status(500).json({ error: "Failed to manage devotion." });
    }
  });

  // API Route for Admin to delete Devotion
  app.delete(apiRoute("/admin/devotions/:id"), verifyAdmin, async (req, res) => {
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
  app.post(apiRoute("/devotions/:id/react"), async (req, res) => {
    const { id } = req.params;
    const { reactionType } = req.body;

    const allowedReactions = [
      "Amen", "I receive", "Hallelujah", "Glory", "ThankYou", "Point taken", "Like"
    ];

    if (!allowedReactions.includes(reactionType)) {
      return res.status(400).json({ error: "Invalid reaction type." });
    }

    try {
      await updateDoc(doc(db, 'devotions', id), {
        [`reactions.${reactionType}`]: increment(1)
      });
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error adding reaction:", error);
      res.status(500).json({ error: "Failed to add reaction." });
    }
  });
  
  // API Route for Admin to upload image
  app.post(apiRoute("/admin/upload-image"), verifyAdmin, (req, res) => {
    if (process.env.VERCEL === '1') {
      return res.status(501).json({
        error: "Image uploads need persistent storage and are disabled on Vercel. Use an external image URL or storage provider."
      });
    }

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
  app.post(apiRoute("/testimony/upload-image"), verifyAdmin, (req, res) => {
    if (process.env.VERCEL === '1') {
      return res.status(501).json({
        error: "Image uploads need persistent storage and are disabled on Vercel. Use an external image URL or storage provider."
      });
    }

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
  app.get(apiRoute("/auth/google"), (req, res) => {
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
  app.get(apiRoute("/auth/google/callback"), async (req, res) => {
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
  app.post(apiRoute("/send-email"), async (req, res) => {
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
  app.post(apiRoute("/testimony/submit"), async (req, res) => {
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
  app.get(apiRoute("/admin/pending-testimonies"), verifyAdmin, async (req, res) => {
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
  app.post(apiRoute("/admin/testimonies"), verifyAdmin, async (req, res) => {
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
  app.delete(apiRoute("/admin/testimonies/:id"), verifyAdmin, async (req, res) => {
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
  app.post(apiRoute("/admin/update-pending"), verifyAdmin, async (req, res) => {
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
  app.post(apiRoute("/admin/bulk-update-pending"), verifyAdmin, async (req, res) => {
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

  // API Route for Public to get visible Projects
  app.get(apiRoute("/projects"), async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, 'projects'));
      const projects = snapshot.docs
        .map(d => {
          const data = d.data();
          return {
            ...data,
            id: data.id ?? d.id,
            documentId: d.id
          };
        })
        .filter((project: any) => project.visible !== false)
        .sort((a: any, b: any) => {
          const orderA = Number(a.order ?? a.id) || 0;
          const orderB = Number(b.order ?? b.id) || 0;
          return orderA - orderB;
        });

      res.status(200).json(projects);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects.", details: error.message });
    }
  });

  // Admin: fetch all projects
  app.get(apiRoute("/admin/projects"), verifyAdmin, async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, 'projects'));
      const projects = snapshot.docs
        .map(d => {
          const data = d.data();
          return {
            ...data,
            id: data.id ?? d.id,
            documentId: d.id
          };
        })
        .sort((a: any, b: any) => {
          const orderA = Number(a.order ?? a.id) || 0;
          const orderB = Number(b.order ?? b.id) || 0;
          return orderA - orderB;
        });

      res.status(200).json(projects);
    } catch (error: any) {
      console.error("Error fetching admin projects:", error);
      res.status(500).json({ error: "Failed to fetch projects." });
    }
  });

  // Admin: create or update a project
  app.post(apiRoute("/admin/projects"), verifyAdmin, async (req, res) => {
    const {
      documentId,
      id,
      title,
      type,
      location,
      timeframe,
      description,
      funded,
      image,
      fullDescription,
      gallery,
      impactStats,
      stories,
      visible,
      order,
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: "Project title and type are required." });
    }

    try {
      const projectId = String(documentId || id || Date.now());
      const payload = cleanObject({
        id: id ?? projectId,
        title,
        type,
        location: location || '',
        timeframe: timeframe || '',
        description: description || '',
        funded: Number(funded ?? 0),
        image: image || '',
        fullDescription: fullDescription || description || '',
        gallery: normalizeStringList(gallery),
        impactStats: normalizeImpactStats(impactStats),
        stories: normalizeStories(stories),
        visible: typeof visible === 'boolean' ? visible : true,
        order: Number(order ?? id ?? 0),
        updatedAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, 'projects', projectId),
        documentId ? payload : { ...payload, createdAt: serverTimestamp() },
        { merge: true }
      );

      res.status(200).json({ success: true, id: projectId });
    } catch (error: any) {
      console.error("Error managing project:", error);
      res.status(500).json({ error: "Failed to manage project." });
    }
  });

  // Admin: delete a project
  app.delete(apiRoute("/admin/projects/:id"), verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await deleteDoc(doc(db, 'projects', id));
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project." });
    }
  });

  // API Routes for Programs (Public + Admin)
  app.get(apiRoute("/programs"), async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, 'programs'));
      const programs = snapshot.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .filter((program: any) => program.visible !== false)
        .sort((a: any, b: any) => {
          const orderA = Number(a.order ?? 0);
          const orderB = Number(b.order ?? 0);
          return orderA - orderB;
        });
      res.status(200).json(programs);
    } catch (error: any) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ error: "Failed to fetch programs.", details: error.message });
    }
  });

  // Admin: fetch all programs
  app.get(apiRoute("/admin/programs"), verifyAdmin, async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, 'programs'));
      const programs = snapshot.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .sort((a: any, b: any) => {
          const orderA = Number(a.order ?? 0);
          const orderB = Number(b.order ?? 0);
          return orderA - orderB;
        });
      res.status(200).json(programs);
    } catch (error: any) {
      console.error("Error fetching admin programs:", error);
      res.status(500).json({ error: "Failed to fetch programs." });
    }
  });

  // Admin: create or update a program
  app.post(apiRoute("/admin/programs"), verifyAdmin, async (req, res) => {
    const { id, day, title, subtitle, events, time, description, stats, color, highlight, visible, icon, order } = req.body;

    if (!title || !day) {
      return res.status(400).json({ error: "Program day and title are required." });
    }

    const payload = cleanObject({
      day,
      title,
      subtitle: subtitle || '',
      events: normalizeProgramEvents(events),
      time: time || '',
      description: description || '',
      stats: stats || '',
      color: color || '',
      highlight: !!highlight,
      visible: typeof visible === 'boolean' ? visible : true,
      icon: icon || null,
      order: Number(order ?? 0),
      updatedAt: serverTimestamp()
    });

    try {
      if (id) {
        await updateDoc(doc(db, 'programs', id), payload);
        res.status(200).json({ success: true, id });
      } else {
        const docRef = await addDoc(collection(db, 'programs'), {
          ...payload,
          createdAt: serverTimestamp()
        });
        res.status(200).json({ success: true, id: docRef.id });
      }
    } catch (error: any) {
      console.error("Error managing program:", error);
      res.status(500).json({ error: "Failed to manage program." });
    }
  });

  // Admin: delete a program
  app.delete(apiRoute("/admin/programs/:id"), verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await deleteDoc(doc(db, 'programs', id));
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error("Error deleting program:", error);
      res.status(500).json({ error: "Failed to delete program." });
    }
  });

  // API Route for Fetching Comments
  app.get(apiRoute("/comments/:testimonyId"), async (req, res) => {
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
  app.post(apiRoute("/comments/:testimonyId"), async (req, res) => {
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
  app.post(apiRoute("/subscribe"), async (req, res) => {
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

  return app;
}

export async function createApp(options: { includeFrontend?: boolean } = {}) {
  const { includeFrontend = process.env.VERCEL !== '1' } = options;
  const app = createApiApp({ includeUnprefixedRoutes: !includeFrontend });

  if (!includeFrontend) {
    return app;
  }

  // Vite middleware for local development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
const isNpmDevRun = process.env.npm_lifecycle_event === 'dev';

if (process.env.VERCEL !== '1' && (isDirectServerRun || isNpmDevRun)) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
}
