# Linux Command Trainer — Build Plan

## Completed

- ✅ Data foundation — 50 commands across 6 categories with full metadata
- ✅ Basic drill loop — prompt, input, feedback cycle
- ✅ Three core modes — Recognition, Recall, Scenario
- ✅ Two advanced modes — Realism and Mastery (full command with flags and arguments)
- ✅ Session tracking — finite sessions, no repeated questions, results screen
- ✅ Guided journey — category and mode unlock system with 80% threshold
- ✅ All Commands master unlock — 90% on All Commands unlocks next tier across all categories
- ✅ Progress page — best scores grid per mode and category
- ✅ Command library — browsable reference with flags, examples and scenarios
- ✅ Nav rail — progress tracking, active states, quick navigation
- ✅ Mac compatibility indicators — Linux-only commands flagged with Mac equivalents
- ✅ Passkey protection — environment variable based, persists in localStorage
- ✅ Landing screen — explains the concept and unlock system to new users
- ✅ Keyboard navigation throughout the app (e.g. number keys for recognition answers, arrow keys for grids)
- ✅ Full keyboard navigation for nav rail (press `/` to focus, arrow keys to navigate) 

## Upcoming

### User accounts
Upgrade from localStorage to persistent per-user progress across devices.
Currently parked — localStorage is sufficient for single-device use.
Supabase is the likely path when the time comes.

### Deployment
Currently running locally. GitHub Pages possibly blocked by org restrictions.
Seeking advice on best place to host a URL. 
Adding to personal GitHub and deploying to Netlify is a fallback. 

### Potential future features
- Re-architecture to use a global keyboard manager
- Leaderboard (requires user accounts)
- Additional command sets beyond the core 50, this definitely will happen for personal learning. 
- Mobile responsive layout
- Placement test — alternative entry point on landing screen for experienced users ("I already know Linux — Take a placement test"). Based on score, automatically unlocks appropriate tiers across all categories. Skipped tiers show as "Bypassed"
- Add a platinum trophy for 100% mode completion
- Stabilise UI on drill screens, minimise rednering changes between questions
