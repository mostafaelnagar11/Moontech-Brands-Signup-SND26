# MoonTech auth — Saudi National Day theme

Reference implementation of the MoonTech authentication screens with the
Saudi National Day seasonal theme, matching the Brands app store assets so the
web and the App Store listing read as one campaign.

Separate project on purpose — the existing `moontech` prototype is untouched.

```bash
npm install
npm run dev
```

## The flow

One continuous sequence on `/`:

```
email address → OTP → brand website → audience located → ready
```

OTP covers every state in the design: empty, filled, verifying, incorrect-code
(red boxes + resend), and verified. Demo code is `911324`; anything else shows
the error.

Typeface is **Figtree**, matching the MoonTech store assets.

## The seasonal switch

The theme turns itself on and off. **No revert PR needed.**

```
NEXT_PUBLIC_SND_THEME=on     force on  (QA, or marketing wants it early)
NEXT_PUBLIC_SND_THEME=off    force off (kill switch)
unset                        automatic — 16–25 September
```

The window lives in `app/theme/snd.ts`. National Day is 23 September; it opens
a week before and closes two days after.

**The check runs on the client, deliberately** — `AuthShell` resolves it in an
effect, not during render. On the server it would be evaluated at *build time*
and frozen into the static HTML, so a deploy cut before the 16th would never
switch on. That is exactly the failure the window exists to prevent.

## How the theme is applied

`AuthShell` sets `data-snd="on"` on the page root only inside the window, and
every seasonal rule in `globals.css` is scoped under that attribute. Outside
the window not one rule applies.

Verified rather than assumed — the primary button computes to brand purple
`rgb(77,47,176)` in both states, and with the kill switch set no lockup renders
and the logo filter is `none`.

| Surface | Inside the window |
|---|---|
| Page ground | SND gradient — the same ramp as the store screenshot panels |
| Backdrop | Authenticity illustration (family tree + DNA) at 7%, grid frame with corner keys |
| Lockup | `عزّنا بطبعنا` top-left — guideline p13 puts the logo in a **corner** for digital, never centred |
| Foot | Sadu weave band |
| MoonTech wordmark | Reversed to white via CSS filter |
| Back link | Lightened — it sits on the dark ground, so this is legibility, not accent |
| **The card interior** | **Unchanged — buttons, links, focus rings and chips stay brand purple** |

The seasonal identity lives entirely in the **field around the card**; the card
itself is untouched. The guideline asks for the identity in the layout, not for
every control to be restyled — and the primary action should stay the colour
people already recognise. A green control inside a purple card reads as a bug,
not a theme.

## Colours

From the official guideline (p16), sampled rather than eyeballed. Full palette
with page references in `app/theme/snd.ts`.

- Saudi green `#008849` · base teal `#003439`
- Panel ramp `#0A7A47 → #00483C 44% → #002A2F 78% → #001417`
- Brands uses the **Authenticity** (أصالتنا) lane — green. The Influencers app
  uses gold, so the two apps stay distinguishable. Keep this project green.

## Two asset rules

Both are mistakes that were made once already:

1. **The lockup is artwork, not type.** `عزّنا بطبعنا` is custom Arabic
   lettering — ship the bitmap, never reset it in a system font. And never
   letter-space Arabic; tracking breaks the joins between letterforms.
2. **The Sadu band tiles, it does not stretch.** `snd-sadu-tile.png` is one
   motif cropped at natural scale and drawn with `repeat-x`. Resizing it
   non-uniformly to fill a width distorts the weave.

The tree watermark is cropped *inside* the trait tile's patterned border —
using the whole tile draws a hard square edge behind the card.

## Notes for integration

- `OtpInput` is self-contained: it owns its digits as a fixed-length array and
  updates them functionally. Holding the code as a string in the parent made
  fast typing read stale values and clobber boxes. It reports upward in an
  effect, never inside the state updater (that is a set-state-during-render and
  React warns). Paste, Backspace and arrow keys all work.
- Region chips use `aria-pressed`; OTP boxes set `aria-invalid` on error.
- `prefers-reduced-motion` is honoured.
- Region flags are emoji placeholders — swap for the real flag assets.
- The website suggestion list is a stand-in for the domain lookup.
