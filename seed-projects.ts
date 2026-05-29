import { initializeApp } from 'firebase/app';
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import 'dotenv/config';
import { explainSeedPermissionError, getSeedFirebaseConfig } from './seed-firebase-config';
import { projects } from './src/data/projects';

const firebaseApp = initializeApp(getSeedFirebaseConfig());
const db = getFirestore(firebaseApp, '(default)');

function toProjectPayload(project: (typeof projects)[number], index: number) {
  const now = new Date().toISOString();

  return {
    id: project.id,
    title: project.title,
    type: project.type,
    location: project.location,
    timeframe: project.timeframe,
    description: project.description,
    funded: project.funded,
    image: project.image,
    fullDescription: project.fullDescription,
    gallery: project.gallery ?? [],
    impactStats: project.impactStats ?? [],
    stories: project.stories ?? [],
    visible: true,
    order: Number(project.id) || index + 1,
    createdAt: now,
    updatedAt: now,
  };
}

async function seedProjects() {
  console.log('Starting projects seeding...');

  try {
    const shouldReplace = process.argv.includes('--replace');
    const shouldUpsert = process.argv.includes('--upsert');
    const isDryRun = process.argv.includes('--dry-run');
    const projectsRef = collection(db, 'projects');

    if (isDryRun) {
      projects.forEach((project, index) => {
        console.log(`Would seed ${index + 1}: ${project.title}`);
      });
      console.log(`Dry run complete. ${projects.length} projects are ready to seed.`);
      return;
    }

    const snapshot = await getDocs(projectsRef);

    if (snapshot.size > 0 && !shouldReplace && !shouldUpsert) {
      console.log(`Found ${snapshot.size} existing projects. Run "npm run seed:projects -- --upsert" to update matching project IDs or "npm run seed:projects -- --replace" to replace them.`);
      return;
    }

    if (snapshot.size > 0 && shouldReplace) {
      console.log(`Found ${snapshot.size} existing projects. Clearing them first...`);
      await Promise.all(snapshot.docs.map((projectDoc) => deleteDoc(projectDoc.ref)));
      console.log('Existing projects cleared.');
    }

    let count = 0;
    for (const project of projects) {
      const projectRef = doc(projectsRef, String(project.id));
      const payload = toProjectPayload(project, count);

      if (shouldUpsert) {
        await setDoc(projectRef, payload, { merge: true });
      } else {
        await setDoc(projectRef, payload);
      }

      count++;
      console.log(`Added: ${project.title}`);
    }

    console.log(`Successfully seeded ${count} projects to Firestore.`);
  } catch (error) {
    console.error('Error seeding projects:', error);
    explainSeedPermissionError(error);
    process.exit(1);
  }
}

seedProjects().then(() => process.exit(0));
