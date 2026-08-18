# Memory Game

Two-player Memory game created as a Developer Akademie project from the supplied Figma design and project checklist.

## Features

- Four themes: Code Vibes, Gaming, DA Projects and Foods
- Theme preview changes on hover and keyboard focus
- Blue or Orange starting player
- Three board sizes: 4×4, 4×6 and 6×6
- Start button stays disabled until every required setting is selected
- Animated card flips and matching logic
- Score tracking and automatic player switching
- Exit-game confirmation
- Animated Game Over and Winner/Draw transition
- Confetti on the Code Vibes winner screen
- Back to Settings and optional Rematch actions

## Technologies

- HTML5
- CSS3
- TypeScript
- Vite as the local development and build tool

## TypeScript workflow

All application logic is written in TypeScript inside `src/ts/`.
There are no hand-written or generated JavaScript source files in the repository.

`index.html` loads the TypeScript entry file directly:

```html
<script type="module" src="/src/ts/main.ts"></script>
```

Vite handles the TypeScript transformation while the project is running. Generated production files are written to `dist/` and are excluded from Git.

## Run locally

Install the project dependencies once:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite prints the local URL in the terminal. Open that URL in the browser.

Do not use Live Server and do not create or edit JavaScript files manually.

## Checks

Run the TypeScript compiler without generating JavaScript files:

```bash
npm run check
```

Create a production build when needed:

```bash
npm run build
```

## Project structure

```text
Memory Game/
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── img/
├── src/
│   └── ts/
│       ├── cards.ts
│       ├── config.ts
│       ├── game.ts
│       ├── main.ts
│       ├── navigation.ts
│       ├── results.ts
│       ├── scoring.ts
│       └── settings.ts
├── styles/
│   ├── fonts.css
│   ├── game.css
│   ├── home.css
│   ├── results.css
│   ├── settings.css
│   ├── style.css
│   └── variables.css
├── .gitignore
├── index.html
├── package.json
├── README.md
└── tsconfig.json
```
