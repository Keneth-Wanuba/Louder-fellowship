import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CANONICAL_BOOKS = [
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

const args = new Set(process.argv.slice(2));
const applyChanges = args.has('--apply');
const manifestUrl = process.env.VITE_BIBLE_MANIFEST_URL;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const bucket = process.env.SUPABASE_BIBLE_BUCKET || 'bibles';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const auditDir = path.resolve('.bible-audits');
const runId = new Date().toISOString().replace(/[:.]/g, '-');

if (!manifestUrl || !supabaseUrl) {
  throw new Error('VITE_BIBLE_MANIFEST_URL and VITE_SUPABASE_URL are required.');
}
if (applyChanges && !serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required when using --apply.');
}

const fetchOrThrow = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return response;
};

const extractVerseArray = (source) => {
  if (Array.isArray(source)) return source;
  if (Array.isArray(source?.verses)) return source.verses;
  if (Array.isArray(source?.data)) return source.data;
  if (Array.isArray(source?.data?.verses)) return source.data.verses;
  return null;
};

const getNumericBookValue = (value) => {
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) return Number(value.trim());
  return null;
};

const getBookOffset = (numericValues) => {
  if (numericValues.includes(0)) return 0;
  return 1;
};

const getCanonicalBook = (numericValue, offset) => CANONICAL_BOOKS[numericValue - offset];

const normalizeReference = (verse, bookName) => {
  const chapter = Number(verse.chapter);
  const verseNumber = Number(verse.verse);
  if (Number.isInteger(chapter) && Number.isInteger(verseNumber)) {
    return `${bookName} ${chapter}:${verseNumber}`;
  }
  return verse.ref;
};

const uploadObject = async (storagePath, body, contentType) => {
  const objectUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${storagePath}`;
  await fetchOrThrow(objectUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body,
  });
};

const manifest = await (await fetchOrThrow(manifestUrl)).json();
if (!Array.isArray(manifest)) {
  throw new Error('Bible manifest must be an array.');
}

await mkdir(auditDir, { recursive: true });
const report = {
  runId,
  mode: applyChanges ? 'apply' : 'audit',
  manifestUrl,
  checked: manifest.length,
  affected: [],
  unchanged: [],
  errors: [],
};

for (const version of manifest) {
  const versionLabel = `${version.label || version.id} (${version.language || 'Unknown'})`;
  try {
    const sourceText = await (await fetchOrThrow(version.assetUrl)).text();
    const source = JSON.parse(sourceText);
    const verses = extractVerseArray(source);
    if (!verses) {
      throw new Error('Unsupported Bible JSON shape.');
    }

    const numericValues = verses
      .map((verse) => getNumericBookValue(verse?.book))
      .filter((value) => value !== null);

    if (numericValues.length === 0) {
      report.unchanged.push({ id: version.id, label: versionLabel, verses: verses.length });
      console.log(`OK       ${versionLabel}`);
      continue;
    }

    const offset = getBookOffset(numericValues);
    const uniqueNumericBooks = [...new Set(numericValues)].sort((a, b) => a - b);
    const unsupportedBooks = uniqueNumericBooks.filter((value) => !getCanonicalBook(value, offset));
    if (unsupportedBooks.length > 0) {
      throw new Error(`Unsupported numeric book identifiers: ${unsupportedBooks.join(', ')}`);
    }

    let changedVerses = 0;
    for (const verse of verses) {
      const numericBook = getNumericBookValue(verse?.book);
      if (numericBook === null) continue;
      const bookName = getCanonicalBook(numericBook, offset);
      verse.book = bookName;
      verse.ref = normalizeReference(verse, bookName);
      changedVerses += 1;
    }

    const normalizedText = `${JSON.stringify(source, null, 2)}\n`;
    const affectedEntry = {
      id: version.id,
      label: versionLabel,
      storagePath: version.storagePath,
      changedVerses,
      numericBooks: uniqueNumericBooks,
      numbering: offset === 0 ? 'zero-based' : 'one-based',
    };
    report.affected.push(affectedEntry);

    if (applyChanges) {
      const backupPath = `backups/book-name-normalization-${runId}/${version.storagePath}`;
      await uploadObject(backupPath, sourceText, 'application/json');
      await uploadObject(version.storagePath, normalizedText, 'application/json');
      affectedEntry.backupPath = backupPath;
      console.log(`UPDATED  ${versionLabel}: ${changedVerses} verses`);
    } else {
      console.log(`AFFECTED ${versionLabel}: ${changedVerses} verses`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    report.errors.push({ id: version.id, label: versionLabel, error: message });
    console.error(`ERROR    ${versionLabel}: ${message}`);
  }
}

const reportPath = path.join(auditDir, `book-name-normalization-${runId}.json`);
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log('');
console.log(`Checked: ${report.checked}`);
console.log(`Affected: ${report.affected.length}`);
console.log(`Unchanged: ${report.unchanged.length}`);
console.log(`Errors: ${report.errors.length}`);
console.log(`Report: ${reportPath}`);

if (report.errors.length > 0) {
  process.exitCode = 1;
}
