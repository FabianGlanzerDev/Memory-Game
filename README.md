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

## TypeScript workflow

The source code is written **only in TypeScript** inside `src/ts/`.
Generated JavaScript is written to `build/` by the TypeScript compiler and is intentionally excluded from Git with `.gitignore`.

Do not edit generated JavaScript manually.

## Run locally

1. Open the project in VS Code.
2. Start the TypeScript compiler:

   ```bash
   tsc --watch
   ```

3. Start `index.html` with Live Server.
4. Keep `tsc --watch` running while developing.

The browser loads `build/main.js`, which is generated from the files in `src/ts/`.

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
├── README.md
└── tsconfig.json
```
