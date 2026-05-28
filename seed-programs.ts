import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, getDocs, getFirestore } from 'firebase/firestore';
import 'dotenv/config';

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

const DEFAULT_PROGRAMS = [
  {
    title: "The Lord's Day",
    time: 'Sunday',
    description: 'Main physical service in-person. Sunday school (7am-9am), Prophetic Service (9am-12pm). Zoom link and YouTube livestream provided for those away.',
    stats: 'Weekly',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    highlight: false,
    visible: true,
    icon: 'Church',
  },
  {
    title: 'Monday Zoom Fellowship',
    time: 'Monday 8pm - 10pm',
    description: 'Connecting our global family through prayer and the word. Deeper teachings and spiritual discussions.',
    stats: 'Weekly',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    highlight: false,
    visible: true,
    icon: 'Zap',
  },
  {
    title: 'One-on-One Prophetic Prayers',
    time: 'Tuesday 8pm - 10pm',
    description: 'Personal prophetic prayers on Zoom. Bring your prayer request, hear from God, receive prophecies and direction about your situation.',
    stats: 'Weekly',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    highlight: false,
    visible: true,
    icon: 'BookOpen',
  },
  {
    title: 'Mid-week Gathering',
    time: 'Wednesday 6pm - 9pm',
    description: 'Intercession gatherings or major physical meeting in Kampala. Announced weekly.',
    stats: 'Weekly',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    highlight: false,
    visible: true,
    icon: 'Award',
  },
  {
    title: 'Cell Gatherings & Dream Interpretation',
    time: 'Thursday Evening & 8pm',
    description: 'Meeting in homes across the globe for nourishment. Zoom fellowship for dream and vision interpretation.',
    stats: 'Weekly',
    color: 'bg-rose-50 text-rose-600 border-rose-100',
    highlight: false,
    visible: true,
    icon: 'Church',
  },
  {
    title: 'Prayer Nights & Upper Room',
    time: 'Friday (Last Fri & 1st-3rd)',
    description: 'Last Friday: overnight physical prayer. 1st, 2nd, and 3rd Fridays at Matvic Primary School.',
    stats: 'Monthly',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    highlight: false,
    visible: true,
    icon: 'Zap',
  },
  {
    title: "Children's Mega Cell",
    time: 'Saturday 1:00 PM',
    description: 'Last Saturday of every month during school time, every Saturday during holidays. Deep discipleship for kids.',
    stats: 'Monthly',
    color: 'bg-teal-50 text-teal-600 border-teal-100',
    highlight: true,
    visible: true,
    icon: 'Sparkles',
  },
  {
    title: 'Choir Practice & Church Setup',
    time: 'Saturday 4:00 PM & 5:00 PM',
    description: 'Practical rehearsals, prayer meetings, and Sunday service preparations. Ushering team setup and departmental meetings.',
    stats: 'Weekly',
    color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    highlight: false,
    visible: true,
    icon: 'Music',
  },
];

async function seedPrograms() {
  console.log('Starting programs seeding...');

  try {
    const shouldReplace = process.argv.includes('--replace');
    const programsRef = collection(db, 'programs');
    const snapshot = await getDocs(programsRef);

    if (snapshot.size > 0) {
      if (!shouldReplace) {
        console.log(`Found ${snapshot.size} existing programs. Run "npm run seed:programs -- --replace" to replace them.`);
        return;
      }

      console.log(`Found ${snapshot.size} existing programs. Clearing them first...`);
      await Promise.all(snapshot.docs.map((programDoc) => deleteDoc(programDoc.ref)));
      console.log('Existing programs cleared.');
    }

    let count = 0;
    for (const program of DEFAULT_PROGRAMS) {
      await addDoc(programsRef, {
        ...program,
        createdAt: new Date().toISOString(),
      });
      count++;
      console.log(`Added: ${program.title}`);
    }

    console.log(`Successfully seeded ${count} programs to Firestore.`);
  } catch (error) {
    console.error('Error seeding programs:', error);
    process.exit(1);
  }
}

seedPrograms().then(() => process.exit(0));
