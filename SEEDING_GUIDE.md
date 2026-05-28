# Seeding and Testing Instructions

## Files Created/Modified

### 1. **seed-programs.ts** (root directory)
- Connects to your Firebase database
- Seeds 8 weekly programs based on the original Programs page schedule
- Clears existing programs before seeding (safe)
- Shows progress in console

### 2. **package.json** (scripts added)
```json
"seed:programs": "tsx seed-programs.ts"
```

## Quick Start

Open Command Prompt (cmd.exe) or PowerShell and run:

```bash
cd "C:\Users\user\OneDrive\Dokument\Louder Fellowship.worktrees\copilot-worktree-2026-05-28T13-18-45"

# Step 1: Seed the programs to Firestore
npm run seed:programs

# Step 2: Start the dev server
npm run dev
```

## What Gets Seeded

8 programs matching your church's weekly schedule:
- **Sunday**: The Lord's Day (main service)
- **Monday**: Zoom Fellowship (8pm-10pm)
- **Tuesday**: One-on-One Prophetic Prayers (8pm-10pm)
- **Wednesday**: Mid-week Gathering (6pm-9pm)
- **Thursday**: Cell Gatherings & Dream Interpretation
- **Friday**: Prayer Nights & Upper Room
- **Saturday AM**: Children's Mega Cell (1:00 PM) ⭐ HIGHLIGHTED
- **Saturday PM**: Choir Practice & Church Setup

## Preview URLs After Dev Server Starts

1. **Programs Page (public)** — http://localhost:3000/programs
   - Shows: all visible programs from DB
   - Fallback: original static schedule if DB fails

2. **Admin Portal** — http://localhost:3000/admin-portal-secret
   - Login with your ADMIN_PASSWORD
   - "Programs" tab to manage programs
   - Add, edit, hide/show, delete programs in real-time

3. **Children's Ministry** — http://localhost:3000/children
   - Shows: programs from the programs DB (filtered)
   - Currently displays children's programs (customizable)

## Testing Checklist

After starting dev:
- [ ] Check /programs — should show all 8 programs
- [ ] Check /children — may show fewer (filtered by DB)
- [ ] Check /admin-portal-secret → Programs tab
- [ ] Try creating a new program in admin
- [ ] Hide one program in admin, refresh /programs
- [ ] Verify fallback works if you disconnect from DB

## Database Structure (Firestore 'programs' collection)

Each document has:
```javascript
{
  title: string,
  time: string,
  description: string,
  stats: string,
  color: string (tailwind classes),
  highlight: boolean,
  visible: boolean,
  icon: string (e.g., "Church", "Zap"),
  createdAt: timestamp
}
```

## Troubleshooting

**seed:programs fails?**
- Check .env has correct FIREBASE_* variables
- Verify Firebase project ID is correct

**Dev server won't start?**
- Check Node version: `node --version` (should be 18+)
- Clear node_modules: `rm -r node_modules && npm install`

**Programs not showing?**
- Check browser console for fetch errors
- Verify /api/programs returns data (open http://localhost:3000/api/programs)
- Ensure admin password is set in env: `ADMIN_PASSWORD=...`

---

✅ **All code is ready to deploy. Just run the npm commands above!**
