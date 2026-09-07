# PROJECT KERBEROS — Round 3 · Future Card

Static site for the Hour-12 Future Card round. No build step, no dependencies —
open `index.html`, or serve the folder with any static server.

## What it does

- 3 domains, 9 problem statements, full brief for each (Scenario / Build the MVP / Secure It / the question).
- Each problem statement carries **3 Future Cards**, shown face-down.
- Pick a team, hit **Shuffle & Deal** — the deck shuffles and flips one card at random
  (`crypto.getRandomValues`, with the biased tail rejected, so the draw is uniform).
- Assignments persist in `localStorage`, survive refresh, and are listed in the
  **Assignment Ledger** (top right) with a CSV export.
- "Reveal All" flips every card in the deck for briefing/projection.
- Dealt teams are hidden from the team dropdown by default; re-dealing a team asks first.

## Files

| File | Purpose |
|---|---|
| `index.html` | Markup and views |
| `styles.css` | Theme |
| `data.js` | Teams, domains, the 9 problem statements, the 27 Future Cards |
| `app.js` | Rendering, shuffle/deal, ledger, persistence |

To edit a card or add a team, change `data.js` only.

## Note on state

Assignments live in the browser's `localStorage`, so they are per-browser and per-device.
Run the draw from one machine, and export the CSV before closing it.
