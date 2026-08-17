# Memory Game

A two-player memory game created as a Developer Akademie project.

## Features

- Four visual themes: Code Vibes, Gaming, DA Projects and Foods
- Blue and Orange player selection
- Three board sizes: 4×4, 4×6 and 6×6
- Live theme preview on hover and keyboard focus
- Disabled Start button until all required settings are selected
- Animated card flipping and matching logic
- Score tracking and automatic player switching
- Exit-game confirmation
- Animated Game Over, Winner and Draw screens
- Confetti for the Code Vibes winner screen
- Rematch and Back to Settings actions

## Technologies

- HTML5
- CSS3
- TypeScript

The project source is written in TypeScript. Generated JavaScript is created locally in the
`build/` directory and is intentionally excluded from Git.

## Run locally

1. Open the project in VS Code.
2. Start the TypeScript compiler:

   ```bash
   tsc --watch
   ```

3. Start `index.html` with Live Server.
4. Keep the TypeScript compiler running while developing.

The browser loads `build/main.js`, which is generated automatically from the files in
`src/ts/`.

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
├── index.html
├── README.md
└── tsconfig.json
```

## Development notes

Only edit the TypeScript files in `src/ts/`. Do not edit generated JavaScript in `build/`.
The `build/` directory is ignored by Git so the repository contains only the TypeScript
source code.
