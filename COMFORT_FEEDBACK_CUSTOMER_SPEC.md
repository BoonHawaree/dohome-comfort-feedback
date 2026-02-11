# DoHome Customer Comfort Feedback - Spec

## Overview
Mobile web app for DoHome megastore customers to report comfort levels (Too Hot / Comfort / Too Cold) per zone. Demo/mockup with localStorage persistence, deployed to Vercel.

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4 (CSS-based config)
- framer-motion (animations)
- lucide-react (icons)
- localStorage (data persistence)

## Architecture
```
URL: /[storeId] (e.g. /dohome-phuket)
Flow: Customer → tap zone or dropdown → feedback sheet → submit → success animation
Data: localStorage (dohome-comfort-feedback key, max 1000 entries, 60s cooldown/zone)
```

## Zone Mapping (DoHome Phuket)
| Zone | AHU | Y-Range (SVG 0-100) |
|------|-----|---------------------|
| Zone 9 | AHU 9 | 9 - 16.75 |
| Zone 8 | AHU 8 | 16.75 - 24.25 |
| Zone 7 | AHU 7 | 24.25 - 31.75 |
| Zone 6 | AHU 6 | 31.75 - 39.25 |
| Zone 5 | AHU 5 | 39.25 - 46.75 |
| Zone 4 | AHU 4 | 46.75 - 54.25 |
| Zone 3 | AHU 3 | 54.25 - 61.75 |
| Zone 2 | AHU 2 | 61.75 - 69.25 |
| Zone 1 | AHU 1 | 69.25 - 77 |

X-range: 22-75 (retail area)

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

## Design System Tokens (from alto-cero-automation-frontend)
| Token | Value |
|-------|-------|
| primary | #0E7EE4 |
| bg | #F9FAFF |
| danger | #EF4337 |
| success | #43A452 |
| dark-blue | #065BA9 |
| dark-grey | #788796 |
| white-blue | #DBE4FF |
| light-grey | #EDEFF9 |
| alto gradient | #0E7EE4 → #14B8B4 |
| shadow-card | 1px 3px 20px 0px #9AAACF1A |

## File Structure
```
src/
├── app/
│   ├── layout.tsx          # Inter font, mobile viewport
│   ├── page.tsx            # Redirect → /dohome-phuket
│   ├── globals.css         # Tailwind v4 + design tokens
│   └── [storeId]/page.tsx  # Main client page
├── components/
│   ├── Header.tsx          # Alto gradient top bar
│   ├── FloorPlanViewer.tsx # Floor plan + SVG zone overlay
│   ├── ZoneSelector.tsx    # Zone dropdown
│   ├── FeedbackSheet.tsx   # Bottom sheet (3 buttons)
│   └── SuccessAnimation.tsx# Animated checkmark
├── config/zones.ts         # Zone polygon definitions
├── lib/feedback-store.ts   # localStorage CRUD
├── hooks/useFeedback.ts    # Feedback hook (submit, cooldown)
└── types/index.ts          # TypeScript interfaces
```

## Implementation Checklist
- [x] Project scaffold (Next.js 16 + deps)
- [x] Design tokens in globals.css
- [x] Types + zone config
- [x] localStorage data layer
- [x] useFeedback hook
- [x] Header component
- [x] FloorPlanViewer with SVG overlay
- [x] ZoneSelector dropdown
- [x] FeedbackSheet bottom sheet
- [x] SuccessAnimation
- [x] Store page ([storeId]/page.tsx)
- [x] Root redirect to /dohome-phuket
- [x] Floor plan image copied
- [x] Build passes
- [ ] Visual calibration on real device
- [ ] Deploy to Vercel
- [ ] Mobile testing

## Deployment
- Platform: Vercel (auto-detect Next.js)
- No env vars needed
- Target URL: dohome-feedback.vercel.app/dohome-phuket

## Future Enhancements
- Supabase integration (replace localStorage)
- QR codes per zone for direct access
- Multi-site support (dohome-rama2, etc.)
- Real-time aggregation dashboard for facility managers
- Push data to Volttron agent for HVAC adjustments
