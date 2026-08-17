import { THEME_PREVIEWS } from './config.js';
import { scrollToScreenTop } from './navigation.js';
const DEFAULT_THEME = 'coding';
const DEFAULT_PLAYER = 'blue';
const DEFAULT_CARD_COUNT = 16;
/**
 * Opens the settings screen from the home screen.
 * @returns Nothing.
 */
export function showSettings() {
    var _a, _b;
    (_a = document.getElementById('home-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('settings-screen')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
    scrollToScreenTop();
}



/**
 * Reads the visible text that belongs to a radio input.
 * @param input - The radio input whose label should be read.
 * @returns The trimmed label text or the input value as fallback.
 */
function getSettingLabel(input) {
    var _a, _b, _c;
    return (_c = (_b = (_a = input.closest('label')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : input.value;
}



/**
 * Restarts the short animation of a summary value.
 * @param output - The summary element that should animate.
 * @returns Nothing.
 */
function animateSummary(output) {
    output.classList.remove('is-updating');
    void output.offsetWidth;
    output.classList.add('is-updating');
}



/**
 * Updates one summary value when its radio input is selected.
 * @param input - The changed radio input.
 * @param output - The summary element that displays the selection.
 * @returns Nothing.
 */
function updateSummary(input, output) {
    if (!input.checked)
        return;
    output.textContent = getSettingLabel(input);
    animateSummary(output);
}



/**
 * Connects one radio group with its summary element.
 * @param inputName - The name attribute of the radio group.
 * @param outputId - The id of the corresponding summary element.
 * @returns Nothing.
 */
function bindSummary(inputName, outputId) {
    const inputs = document.querySelectorAll(`input[name="${inputName}"]`);
    const output = document.getElementById(outputId);
    if (!output)
        return;
    inputs.forEach((input) => input.addEventListener('change', () => updateSummary(input, output)));
    inputs.forEach((input) => updateSummary(input, output));
}



/**
 * Updates the preview image for the selected theme.
 * @param input - The changed theme radio input.
 * @param preview - The preview image element.
 * @returns Nothing.
 */
function updateThemePreview(input, preview) {
    if (!input.checked)
        return;
    const theme = parseTheme(input.value);
    preview.src = THEME_PREVIEWS[theme];
    preview.alt = `Preview of the ${getSettingLabel(input)}`;
}



/**
 * Connects the theme radio buttons with the theme preview image.
 * @returns Nothing.
 */
function initThemePreview() {
    const inputs = document.querySelectorAll('input[name="theme"]');
    const preview = document.querySelector('#theme-preview');
    if (!preview)
        return;
    inputs.forEach((input) => input.addEventListener('change', () => updateThemePreview(input, preview)));
    inputs.forEach((input) => updateThemePreview(input, preview));
}



/**
 * Returns the selected value of a radio group.
 * @param name - The name attribute of the radio group.
 * @returns The selected value or an empty string.
 */
function getCheckedValue(name) {
    var _a, _b;
    return (_b = (_a = document.querySelector(`input[name="${name}"]:checked`)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '';
}



/**
 * Converts a raw theme value to a supported theme.
 * @param value - The raw radio input value.
 * @returns A valid theme value.
 */
function parseTheme(value) {
    if (value === 'gaming' || value === 'projects' || value === 'foods')
        return value;
    return DEFAULT_THEME;
}



/**
 * Converts a raw player value to a supported player.
 * @param value - The raw radio input value.
 * @returns A valid player value.
 */
function parsePlayer(value) {
    return value === 'orange' ? 'orange' : DEFAULT_PLAYER;
}



/**
 * Converts a raw card count to a supported board size.
 * @param value - The raw radio input value.
 * @returns A valid number of cards.
 */
function parseCardCount(value) {
    const cardCount = Number(value);
    if (cardCount === 24 || cardCount === 36)
        return cardCount;
    return DEFAULT_CARD_COUNT;
}



/**
 * Reads the complete game configuration from the settings form.
 * @returns The validated game settings.
 */
export function getGameSettings() {
    return {
        theme: parseTheme(getCheckedValue('theme')),
        player: parsePlayer(getCheckedValue('player')),
        cardCount: parseCardCount(getCheckedValue('board-size'))
    };
}



/**
 * Initializes all interactive controls on the settings screen.
 * @returns Nothing.
 */
export function initSettings() {
    bindSummary('theme', 'selected-theme');
    bindSummary('player', 'selected-player');
    bindSummary('board-size', 'selected-board-size');
    initThemePreview();
}



