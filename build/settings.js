import { THEME_PREVIEWS } from './config.js';
import { focusWithoutScroll, showScreen } from './navigation.js';
const DEFAULT_THEME = 'coding';
const DEFAULT_PLAYER = 'blue';
const DEFAULT_CARD_COUNT = 16;
const REQUIRED_SETTINGS = ['theme', 'player', 'board-size'];
/**
 * Shows the settings screen and restores focus to the selected theme.
 * @returns Nothing.
 */
export function showSettings() {
    showScreen('settings-screen');
    const selectedTheme = document.querySelector('input[name="theme"]:checked');
    focusWithoutScroll(selectedTheme);
}
/**
 * Reads the visible text that belongs to a radio input.
 * @param input - The radio input whose label should be read.
 * @returns The trimmed label text or the input value as fallback.
 */
function getSettingLabel(input) {
    return input.closest('label')?.textContent?.trim() ?? input.value;
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
 * Preloads every theme preview to avoid a delay on first hover.
 * @returns Nothing.
 */
function preloadThemePreviews() {
    Object.values(THEME_PREVIEWS).forEach((source) => {
        const image = new Image();
        image.src = source;
    });
}
/**
 * Displays the preview image that belongs to one theme option.
 * @param input - The theme option whose preview should be shown.
 * @param preview - The preview image element.
 * @returns Nothing.
 */
function showThemePreview(input, preview) {
    const theme = parseTheme(input.value);
    preview.src = THEME_PREVIEWS[theme];
    preview.alt = `Preview of the ${getSettingLabel(input)}`;
}
/**
 * Restores the preview of the currently selected theme.
 * @param preview - The preview image element.
 * @returns Nothing.
 */
function restoreSelectedPreview(preview) {
    const selected = document.querySelector('input[name="theme"]:checked');
    if (selected)
        showThemePreview(selected, preview);
}
/**
 * Adds hover, focus and selection preview behavior to one theme option.
 * @param input - The theme radio input.
 * @param preview - The preview image element.
 * @returns Nothing.
 */
function bindThemePreview(input, preview) {
    const label = input.closest('label');
    label?.addEventListener('mouseenter', () => showThemePreview(input, preview));
    label?.addEventListener('mouseleave', () => restoreSelectedPreview(preview));
    input.addEventListener('focus', () => showThemePreview(input, preview));
    input.addEventListener('blur', () => restoreSelectedPreview(preview));
    input.addEventListener('change', () => showThemePreview(input, preview));
}
/**
 * Initializes live theme previews for pointer and keyboard interaction.
 * @returns Nothing.
 */
function initThemePreview() {
    const inputs = document.querySelectorAll('input[name="theme"]');
    const preview = document.querySelector('#theme-preview');
    if (!preview)
        return;
    inputs.forEach((input) => bindThemePreview(input, preview));
    restoreSelectedPreview(preview);
}
/**
 * Returns the selected value of a radio group.
 * @param name - The name attribute of the radio group.
 * @returns The selected value or an empty string.
 */
function getCheckedValue(name) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value ?? '';
}
/**
 * Checks whether all required settings have been selected.
 * @returns True when the game may be started.
 */
function areSettingsComplete() {
    return REQUIRED_SETTINGS.every((name) => getCheckedValue(name) !== '');
}
/**
 * Enables the start button only when every required setting is selected.
 * @returns Nothing.
 */
function updateStartButtonState() {
    const startButton = document.querySelector('#start-button');
    if (!startButton)
        return;
    startButton.disabled = !areSettingsComplete();
}
/**
 * Initializes start-button validation for all settings controls.
 * @returns Nothing.
 */
function initStartButtonState() {
    const inputs = document.querySelectorAll('.settings-group input');
    inputs.forEach((input) => input.addEventListener('change', updateStartButtonState));
    updateStartButtonState();
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
    preloadThemePreviews();
    bindSummary('theme', 'selected-theme');
    bindSummary('player', 'selected-player');
    bindSummary('board-size', 'selected-board-size');
    initThemePreview();
    initStartButtonState();
}
