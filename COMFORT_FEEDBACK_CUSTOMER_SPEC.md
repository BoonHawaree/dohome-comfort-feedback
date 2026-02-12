# DoHome Customer Comfort Feedback - Spec

## Overview
Mobile web app for DoHome megastore customers to report comfort levels (Too Hot / Comfort / Too Cold) per zone. One person is assigned per zone, submitting 3x/day. Demo with localStorage persistence, deployed to Vercel as a PWA.

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4 (CSS-based config)
- framer-motion (animations)
- lucide-react (icons)
- localStorage (data persistence)
- PWA (manifest.json + service worker)

## Architecture
```
URL: /[storeId] (e.g. /dohome-phuket)
Flow: Customer → select zone (map tap or dropdown) → pick feedback → submit
Data: localStorage (dohome-comfort-feedback key, max 1000 entries)
```

## Page Layout (mobile, no-scroll goal)
```
┌──────────────────────────────┐
│ Submit Feedback  DoHome Phuket│  ← compact header row
├──────────────────────────────┤
│ [Morning ✓] [Afternoon] [Eve]│  ← small time-slot tracker
├──────────────────────────────┤
│                              │
│    Floor Plan (18 zones)     │  ← takes most vertical space
│    with circle badges        │
│                              │
├──────────────────────────────┤
│ Select Zone: [Zone 5A    v]  │  ← dropdown
├──────────────────────────────┤
│ [Too Hot] [Comfort] [Too Cold]│ ← always visible, no scroll
│     [ ═══ Submit ═══ ]       │
├──────────────────────────────┤
│    Powered by AltoTech       │
└──────────────────────────────┘
```

## Zone Mapping (DoHome Phuket - 18 zones)
Each of the 9 AHU rows is split into left (A) and right (B):

| Zone | AHU | Y-Range | X-Range |
|------|-----|---------|---------|
| 9A / 9B | AHU 9 | 9 - 16.75 | 22-53.5 / 53.5-85 |
| 8A / 8B | AHU 8 | 16.75 - 24.25 | 22-53.5 / 53.5-85 |
| 7A / 7B | AHU 7 | 24.25 - 31.75 | 22-53.5 / 53.5-85 |
| 6A / 6B | AHU 6 | 31.75 - 39.25 | 22-53.5 / 53.5-85 |
| 5A / 5B | AHU 5 | 39.25 - 46.75 | 22-53.5 / 53.5-85 |
| 4A / 4B | AHU 4 | 46.75 - 54.25 | 22-53.5 / 53.5-85 |
| 3A / 3B | AHU 3 | 54.25 - 61.75 | 22-53.5 / 53.5-85 |
| 2A / 2B | AHU 2 | 61.75 - 69.25 | 22-53.5 / 53.5-85 |
| 1A / 1B | AHU 1 | 69.25 - 77 | 22-53.5 / 53.5-85 |

## Zone Visual Behavior
- **No zone selected:** All zones show light blue tint + blue borders
- **Zone selected:** Selected zone = teal fill, all others = muted grey
- Zone colors do NOT change based on feedback submissions (keep it simple)
- Dropdown shows plain zone names only (no feedback suffix)

## Time-Slot System (3x/day feedback)
| Slot | Label | Hours (Bangkok) |
|------|-------|-----------------|
| morning | Morning | 09:00 - 11:59 |
| afternoon | Afternoon | 13:00 - 15:59 |
| evening | Evening | 16:00 - 18:59 |

### Rules
- Each zone can submit once per time slot per day
- **Past slots today are still available** (user can catch up on missed morning slot in the afternoon)
- When all 3 slots are done → "All done for today!"
- Progress tracked in localStorage (`dohome-comfort-slots` key)
- Tracker shows compact pill-style indicators above the map

### Slot Selection
- If current time is within an active slot, that slot is auto-selected
- User can tap a past undone slot to select it and submit feedback for it
- Future slots cannot be selected

## Data Model
```typescript
type FeedbackType = 'too_hot' | 'comfort' | 'too_cold';
interface FeedbackEntry {
  id: string;        // crypto.randomUUID()
  storeId: string;
  zoneId: string;
  feedback: FeedbackType;
  timestamp: string; // ISO 8601
}
```

## PWA Support
- `manifest.json` with app name, icon, standalone display
- Service worker (`sw.js`) for offline caching
- Notification permission requested on first zone interaction
- In-app notification fires when tab becomes visible and a slot is pending
- True background push notifications require Supabase backend (future)

## Design System Tokens (from alto-cero-automation-frontend)
| Token | Value |
|-------|-------|
| primary | #0E7EE4 |
| bg | #FFFFFF |
| danger | #EF4337 |
| success | #43A452 |
| dark-blue | #065BA9 |
| alto gradient | #0E7EE4 → #14B8B4 |

## File Structure
```
src/
├── app/
│   ├── layout.tsx              # Inter font, mobile viewport, PWA manifest
│   ├── page.tsx                # Redirect → /dohome-phuket
│   ├── globals.css             # Tailwind v4 + design tokens
│   └── [storeId]/page.tsx      # Main client page
├── components/
│   ├── Header.tsx              # Compact title row
│   ├── FloorPlanViewer.tsx     # Floor plan + SVG zone overlay (18 zones)
│   ├── ZoneSelector.tsx        # Zone dropdown (plain names)
│   ├── TimeSlotTracker.tsx     # 3-slot progress indicator
│   └── FeedbackPanel.tsx       # Static feedback buttons + submit
├── config/zones.ts             # 18 zone polygon definitions
├── lib/
│   ├── feedback-store.ts       # localStorage CRUD for feedback entries
│   └── time-slots.ts           # Time slot logic + localStorage tracking
├── hooks/useFeedback.ts        # Feedback submission hook
└── types/index.ts              # TypeScript interfaces
public/
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker
├── icon.svg                    # App icon
└── assets/floor-plans/...      # Floor plan images
```

## Implementation Checklist
- [x] Project scaffold (Next.js 16 + deps)
- [x] 18 zones (9 rows × left/right split)
- [x] Simplified zone visuals (selected only, no feedback colors)
- [x] Static feedback buttons (no popup bottom sheet)
- [x] Time-slot tracker (Morning/Afternoon/Evening)
- [x] Past slot catch-up (submit for missed earlier slots)
- [x] Compact layout (no-scroll on mobile)
- [x] PWA manifest + service worker
- [x] In-app notification check
- [x] Deployed to Vercel with GitHub auto-deploy
- [ ] Visual calibration of zone polygons on real device
- [ ] Real-device mobile testing

## Deployment
- Platform: Vercel (auto-detect Next.js)
- GitHub: https://github.com/BoonHawaree/dohome-comfort-feedback
- Live: https://dohome-comfort-feedback.vercel.app/dohome-phuket
- Auto-deploys on push to master

## Future Enhancements
- Supabase integration (replace localStorage, enable push notifications)
- True background push notifications via Vercel Cron + web-push
- QR codes per zone for direct access
- Multi-site support (dohome-rama2, etc.)
- Real-time aggregation dashboard for facility managers
- Push data to Volttron agent for HVAC adjustments
