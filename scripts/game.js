import { renderBoard, resetCardInteraction } from './cards.js';
import { resetResultFlow } from './results.js';
import { resetPlayerState } from './scoring.js';
import { getGameSettings } from './settings.js';
import { scrollToScreenTop } from './navigation.js';
/**
 * Prepares the game screen for a fresh round.
 * @param settings - The selected game settings.
 * @returns Nothing.
 */
function prepareGameScreen(settings) {
    const gameScreen = document.getElementById('game-screen');
    if (!gameScreen)
        return;
    gameScreen.dataset.theme = settings.theme;
    gameScreen.dataset.size = String(settings.cardCount);
    resetCardInteraction();
    resetPlayerState(settings.player);
    renderBoard(settings);
}



/**
 * Moves keyboard focus to the first card of a new game.
 * @returns Nothing.
 */
function focusFirstCard() {
    var _a;
    (_a = document.querySelector('.memory-card')) === null || _a === void 0 ? void 0 : _a.focus({
        preventScroll: true
    });
}



/**
 * Starts a fresh game with the current settings.
 * @returns Nothing.
 */
export function startGame() {
    var _a, _b;
    resetResultFlow();
    prepareGameScreen(getGameSettings());
    (_a = document.getElementById('settings-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('game-screen')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
    scrollToScreenTop();
    focusFirstCard();
}



/**
 * Shows or hides the exit confirmation dialog.
 * @param isVisible - Whether the dialog should be visible.
 * @returns Nothing.
 */
function setExitDialogVisibility(isVisible) {
    const dialog = document.getElementById('exit-modal');
    const gameScreen = document.getElementById('game-screen');
    if (!dialog)
        return;
    dialog.classList.toggle('hidden', !isVisible);
    dialog.setAttribute('aria-hidden', String(!isVisible));
    dialog.setAttribute('data-theme', getGameSettings().theme);
    if (gameScreen)
        gameScreen.inert = isVisible;
}



/**
 * Opens the exit confirmation dialog.
 * @returns Nothing.
 */
function showExitDialog() {
    var _a;
    setExitDialogVisibility(true);
    (_a = document.getElementById('back-to-game-button')) === null || _a === void 0 ? void 0 : _a.focus();
}



/**
 * Closes the exit dialog and returns focus to the exit button.
 * @returns Nothing.
 */
function hideExitDialog() {
    var _a;
    setExitDialogVisibility(false);
    (_a = document.getElementById('exit-button')) === null || _a === void 0 ? void 0 : _a.focus();
}



/**
 * Leaves the active game and returns to the settings screen.
 * @returns Nothing.
 */
function exitGame() {
    var _a, _b, _c;
    setExitDialogVisibility(false);
    resetCardInteraction();
    resetResultFlow();
    (_a = document.getElementById('game-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('settings-screen')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
    scrollToScreenTop();
    (_c = document.querySelector('input[name="theme"]:checked')) === null || _c === void 0 ? void 0 : _c.focus({
        preventScroll: true
    });
}



/**
 * Closes the exit dialog when its backdrop is clicked.
 * @param event - The click event from the dialog backdrop.
 * @returns Nothing.
 */
function handleExitDialogClick(event) {
    if (event.target === document.getElementById('exit-modal'))
        hideExitDialog();
}



/**
 * Closes the exit dialog when Escape is pressed while it is open.
 * @param event - The keyboard event from the document.
 * @returns Nothing.
 */
function handleEscapeKey(event) {
    const dialog = document.getElementById('exit-modal');
    if (event.key === 'Escape' && !(dialog === null || dialog === void 0 ? void 0 : dialog.classList.contains('hidden')))
        hideExitDialog();
}



/**
 * Initializes all exit-dialog event listeners.
 * @returns Nothing.
 */
export function initExitDialog() {
    var _a, _b, _c, _d;
    (_a = document.getElementById('exit-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showExitDialog);
    (_b = document.getElementById('back-to-game-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', hideExitDialog);
    (_c = document.getElementById('confirm-exit-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', exitGame);
    (_d = document.getElementById('exit-modal')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', handleExitDialogClick);
    document.addEventListener('keydown', handleEscapeKey);
}



