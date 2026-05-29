import { initializeApp } from 'firebase/app';
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import 'dotenv/config';
import { explainSeedPermissionError, getSeedFirebaseConfig } from './seed-firebase-config';

const firebaseApp = initializeApp(getSeedFirebaseConfig());
const db = getFirestore(firebaseApp, '(default)');

const DEFAULT_PROGRAMS = [
  {
    day: 'Sunday',
    title: "The Lord's Day",
    subtitle: 'Sunday',
    events: [
      { time: '7am - 9am', name: 'Nourish', desc: 'School of Ministry - Deepening your walk with God.' },
      { time: '9am - 12pm', name: 'Prophetic Service', desc: 'Main in-person physical sunday service. Zoom link and youtube livestream provided for those away.' },
    ],
  },
  {
    day: 'Monday',
    title: 'Monday',
    subtitle: 'Online Connection',
    events: [
      { time: '8pm - 10pm', name: 'Zoom Fellowship', desc: 'Connecting our global family through prayer and the word. Given Sunday is not enough to dissect the entire topics, we use this online fellowship for deeper teachings.' },
    ],
  },
  {
    day: 'Tuesday',
    title: 'Tuesday',
    subtitle: 'Personal Prophetic Ministry',
    events: [
      { time: '8pm - 10pm', name: 'One-on-One Prayers', desc: 'Personal prophetic prayers on Zoom. Bring your prayer request, hear from God, receive prophecies and direction/guidance about your situation.' },
    ],
  },
  {
    day: 'Wednesday',
    title: 'Wednesday',
    subtitle: 'Mid-week Gathering',
    events: [
      { time: '6pm - 9pm', name: 'Physical Gathering', desc: 'Intercession gatherings or Louder Fellowship major physical meeting in Kampala, as always announced' },
    ],
  },
  {
    day: 'Thursday',
    title: 'Thursday',
    subtitle: 'Community & Development',
    events: [
      { time: 'Evening', name: 'Cell Gatherings', desc: 'Meeting in homes across the globe for nourishment.' },
      { time: '8:00pm', name: 'Zoom Fellowship', desc: 'Dream and vision interpretation. Learn to see in the Spirit, hear from God, or interpret messages from God.' },
    ],
  },
  {
    day: 'Friday',
    title: 'Friday',
    subtitle: 'Prayer Nights',
    events: [
      { time: 'Last Fri', name: 'Overnight Prayer', desc: 'General physical overnight.' },
      { time: 'Fridays', name: 'Upper Room Experience', desc: '1st, 2nd and 3rd fridays at Matvic Primary school.' },
    ],
  },
  {
    day: 'Saturday',
    title: 'Saturday',
    subtitle: 'Preparations and Children ministry',
    events: [
      { time: '1:00pm', name: "Children's mega cell", desc: 'Last Saturday of every month during school time, and every Saturday during holidays.' },
      { time: '4:00pm', name: 'Choir practice', desc: 'Practical rehearsals, prayer meetings and preparations for Sunday service for the choir department' },
      { time: '5:00pm', name: 'Church set-up', desc: 'Ushering department meets to clean, organize and prepare for service. Departmental prayer meeting happens here.' },
    ],
    highlight: true,
  },
];

function toDocId(title: string, fallback: number) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `program-${fallback}`;
}

async function seedPrograms() {
  console.log('Starting programs seeding...');

  try {
    const shouldReplace = process.argv.includes('--replace');
    const shouldUpsert = process.argv.includes('--upsert');
    const isDryRun = process.argv.includes('--dry-run');
    const programsRef = collection(db, 'programs');

    if (isDryRun) {
      DEFAULT_PROGRAMS.forEach((program, index) => {
        console.log(`Would seed ${index + 1}: ${program.title}`);
      });
      console.log(`Dry run complete. ${DEFAULT_PROGRAMS.length} programs are ready to seed.`);
      return;
    }

    const snapshot = await getDocs(programsRef);

    if (snapshot.size > 0 && !shouldReplace && !shouldUpsert) {
      console.log(`Found ${snapshot.size} existing programs. Run "npm run seed:programs -- --upsert" to update matching defaults or "npm run seed:programs -- --replace" to replace them.`);
      return;
    }

    if (snapshot.size > 0 && shouldReplace) {
      console.log(`Found ${snapshot.size} existing programs. Clearing them first...`);
      await Promise.all(snapshot.docs.map((programDoc) => deleteDoc(programDoc.ref)));
      console.log('Existing programs cleared.');
    }

    let count = 0;
    for (const program of DEFAULT_PROGRAMS) {
      const now = new Date().toISOString();
      const payload = {
        ...program,
        order: count + 1,
        visible: true,
        createdAt: now,
        updatedAt: now,
      };
      const programRef = doc(programsRef, toDocId(program.title, count + 1));
      if (shouldUpsert) {
        await setDoc(programRef, payload, { merge: true });
      } else {
        await setDoc(programRef, payload);
      }
      count++;
      console.log(`Added: ${program.title}`);
    }

    console.log(`Successfully seeded ${count} programs to Firestore.`);
  } catch (error) {
    console.error('Error seeding programs:', error);
    explainSeedPermissionError(error);
    process.exit(1);
  }
}

seedPrograms().then(() => process.exit(0));
