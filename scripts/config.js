export const THEME_PREVIEWS = {
    coding: './assets/img/settings/coding-vibes.svg',
    gaming: './assets/img/settings/gaming.svg',
    projects: './assets/img/settings/da-projects.svg',
    foods: './assets/img/settings/foods.svg'
};
export const GAME_TIMING = {
    mismatchDelay: 850,
    gameOverDelay: 550,
    winnerDelay: 1450,
    resultTransition: 380
};
const MAX_CARD_PAIRS = 18;
/**
 * Formats a card number for the image file naming scheme.
 * @param index - The one-based card image index.
 * @returns The index padded to two digits.
 */
function formatCardIndex(index) {
    return index < 10 ? `0${index}` : String(index);
}
/**
 * Creates all available front image paths for a theme.
 * @param theme - The selected memory theme.
 * @returns The ordered list of card front image paths.
 */
export function createCardPaths(theme) {
    return Array.from({ length: MAX_CARD_PAIRS }, (_, index) => `./assets/img/cards/${theme}/front-${formatCardIndex(index + 1)}.png`);
}
