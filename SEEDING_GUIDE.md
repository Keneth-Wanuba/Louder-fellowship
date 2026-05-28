# Seeding And Testing

## Current Data Flow

- Public pages call `/api/projects` and `/api/programs`.
- Those API routes use the Firebase Client SDK, so Firestore security rules still apply.
- `firestore.rules` must be published before public reads for `projects` and `programs` will work in production.

## Required Before Dynamic Reads Work

Publish the Firestore rules that include:

```js
match /projects/{projectId} {
  allow read: if true;
  allow write: if isAdmin();
}

match /programs/{programId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

Until those rules are live, the API returns:

```json
{"error":"Failed to fetch projects.","details":"Missing or insufficient permissions."}
```

The repo includes `firebase.json` and `.firebaserc` so the Firebase CLI can deploy the local rules file to the `kennyboa-b3902` default Firestore database:

```bash
firebase deploy --only firestore
```

If the Firebase CLI is not installed, publish the same `firestore.rules` content from Firebase Console > Firestore Database > Rules > Publish. Vercel deploys do not publish Firestore rules.

## Seed Scripts

`npm run seed:programs` seeds default weekly programs from `seed-programs.ts`.
`npm run seed:projects` transfers the existing static project data from `src/data/projects.ts`.
`npm run seed:all` runs both scripts.

Run:

```bash
npm run seed:programs -- --dry-run
npm run seed:projects -- --dry-run
npm run seed:programs
npm run seed:projects
```

If data already exists, the scripts stop without deleting anything. To update matching default document IDs:

```bash
npm run seed:programs -- --upsert
npm run seed:projects -- --upsert
```

To replace existing data:

```bash
npm run seed:programs -- --replace
npm run seed:projects -- --replace
```

Because the project intentionally uses no service account key, these scripts use the Firebase Client SDK and Firestore rules still apply. If writes require admin auth, set a Firebase Auth user before running:

```bash
export FIREBASE_ADMIN_EMAIL="kennymeico@gmail.com"
export FIREBASE_ADMIN_PASSWORD="your-password"
npm run seed:all
```

On Windows PowerShell:

```powershell
$env:FIREBASE_ADMIN_EMAIL="kennymeico@gmail.com"
$env:FIREBASE_ADMIN_PASSWORD="your-password"
npm run seed:all
```

From Firebase Cloud Shell, run the script inside the website repo, not from `/home/kennymeico`:

```bash
git clone https://github.com/Keneth-Wanuba/Louder-fellowship.git
cd Louder-fellowship
npm install
npm run seed:projects -- --dry-run
npm run seed:programs -- --dry-run
npm run seed:projects
npm run seed:programs
```

If the repo is already cloned:

```bash
cd Louder-fellowship
git pull
npm install
npm run seed:all
```

If the script returns `permission-denied`, either sign in with a Firebase Auth account allowed by `isAdmin()` or temporarily allow writes in Firestore rules, run the seed, then restore the safer rules.

## Pre-Deploy Checks

```bash
npm run lint
npm run build
npm audit --audit-level=moderate
```

Then verify:

- `/api/projects` returns JSON, not HTML.
- `/api/programs` returns JSON, not HTML.
- `/projects` renders either database projects or the static fallback.
- `/programs` renders either database programs or the static fallback schedule.
