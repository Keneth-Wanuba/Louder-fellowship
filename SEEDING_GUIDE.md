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

## Program Seeding Script

`npm run seed:programs` seeds default weekly programs from `seed-programs.ts`.

Run:

```bash
npm run seed:programs
```

If programs already exist, the script stops without deleting anything. To replace existing programs:

```bash
npm run seed:programs -- --replace
```

Because the project intentionally uses no service account key, this script can only write if your Firebase Client SDK permissions/auth setup allows the write. If it returns `permission-denied`, add the data through the Firebase console or configure Firebase Auth based admin writes.

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
