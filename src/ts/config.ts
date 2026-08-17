export type Theme = 'coding' | 'gaming' | 'projects' | 'foods';
export type Player = 'blue' | 'orange';
export type CardCount = 16 | 24 | 36;


export interface GameSettings {
    theme: Theme;
    player: Player;
    cardCount: CardCount;
}


export interface MemoryCardData {
    pairId: number;
    image: string;
}


export const THEME_PREVIEWS: Record<Theme, string> = {
    coding: './assets/img/settings/coding-vibes.svg',
    gaming: './assets/img/settings/gaming.svg',
    projects: './assets/img/settings/da-projects.svg',
    foods: './assets/img/settings/foods.svg'
};


export const THEME_BACKS: Record<Theme, string> = {
    coding: './assets/img/cards/coding-back.png',
    gaming: './assets/img/cards/gaming-back.png',
    projects: './assets/img/cards/projects-back.png',
    foods: './assets/img/cards/foods-back.png'
};


export const GAME_TIMING = {
    mismatchDelay: 850,
    gameOverDelay: 550,
    winnerDelay: 1450,
    resultTransition: 380
} as const;


const MAX_CARD_PAIRS = 18;


/**
 * Formats a card number for the image file naming scheme.
 * @param index - The one-based card image index.
 * @returns The index padded to two digits.
 */
function formatCardIndex(index: number): string {
    return index < 10 ? `0${index}` : String(index);
}



/**
 * Creates all available front image paths for a theme.
 * @param theme - The selected memory theme.
 * @returns The ordered list of card front image paths.
 */
export function createCardPaths(theme: Theme): string[] {
    return Array.from(
        { length: MAX_CARD_PAIRS },
        (_, index) => `./assets/img/cards/${theme}/front-${formatCardIndex(index + 1)}.png`
    );
}
