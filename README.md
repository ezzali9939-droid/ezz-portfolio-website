# Ezz Eldin Futuristic Portfolio

A complete Vite-powered single-page portfolio built from the supplied visual references and asset library.

## Included

- Home, About, Service, and Contact sections.
- Responsive futuristic HUD interface.
- Purple glow system, glass cards, scan effects, and animated reveals.
- Robot parallax micro-motion.
- Smooth navigation and active-section tracking.
- Horizontal project slider with controls and pagination.
- Mobile navigation.
- Contact information and active social links.
- Contact-form validation with an email-app fallback.
- Google Fonts setup using Orbitron and Outfit.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The production files will be generated inside `dist/`.

## Contact form status

The form is functional through `mailto:` and opens the visitor's configured email application with all entered fields prefilled. For silent in-page submission, connect the form to Formspree, Web3Forms, EmailJS, Supabase Edge Functions, or a custom backend endpoint.

## Main editable files

- `index.html` — page structure and content.
- `src/styles.css` — complete visual system and responsive layout.
- `src/main.js` — navigation, reveals, parallax, slider, and form behavior.
- `PROJECT_CONFIG.json` — owner data, social links, architecture, and form configuration.
- `public/assets/` — optimized runtime assets.
