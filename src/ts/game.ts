import type { GameSettings } from './config.js';
import { renderBoard, resetCardInteraction } from './cards.js';
import { resetResultFlow } from './results.js';
import { resetPlayerState } from './scoring.js';
import { getGameSettings, showSettings } from './settings.js';
import { scrollToScreenTop } from './navigation.js';


/**
 * Prepares the game screen for a fresh round.
 * @param settings - The selected game settings.
 * @returns Nothing.
 */
function prepareGameScreen(settings: GameSettings): void {
    const gameScreen = document.getElementById('game-screen');

    if (!gameScreen) return;
    gameScreen.dataset.theme = settings.theme;
    gameScreen.dataset.size = String(settings.cardCount);
    resetCardInteraction();
    resetPlayerState(settings.player);
    renderBoard(settings);
}



/**
 * Moves keyboard focus to the first card without changing scroll position.
 * @returns Nothing.
 */
function focusFirstCard(): void {
    document.querySelector<HTMLButtonElement>('.memory-card')?.focus({ preventScroll: true });
}



/**
 * Starts a fresh game with the currently selected settings.
 * @returns Nothing.
 */
export function startGame(): void {
    resetResultFlow();
    prepareGameScreen(getGameSettings());
    document.getElementById('settings-screen')?.classList.add('hidden');
    document.getElementById('game-screen')?.classList.remove('hidden');
    scrollToScreenTop();
    focusFirstCard();
}



/**
 * Shows or hides the exit confirmation dialog.
 * @param isVisible - Whether the dialog should be visible.
 * @returns Nothing.
 */
function setExitDialogVisibility(isVisible: boolean): void {
    const dialog = document.getElementById('exit-modal');
    const gameScreen = document.getElementById('game-screen');

    if (!dialog) return;
    dialog.classList.toggle('hidden', !isVisible);
    dialog.setAttribute('aria-hidden', String(!isVisible));
    dialog.setAttribute('data-theme', getGameSettings().theme);
    if (gameScreen) gameScreen.inert = isVisible;
}



/**
 * Opens the exit confirmation dialog.
 * @returns Nothing.
 */
function showExitDialog(): void {
    setExitDialogVisibility(true);
    document.getElementById('back-to-game-button')?.focus();
}



/**
 * Closes the exit dialog and returns focus to the exit button.
 * @returns Nothing.
 */
function hideExitDialog(): void {
    setExitDialogVisibility(false);
    document.getElementById('exit-button')?.focus();
}



/**
 * Leaves the active game and returns to the current settings.
 * @returns Nothing.
 */
function exitGame(): void {
    setExitDialogVisibility(false);
    resetCardInteraction();
    resetResultFlow();
    showSettings();
    document.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.focus({ preventScroll: true });
}



/**
 * Closes the exit dialog when its backdrop is clicked.
 * @param event - The click event from the dialog backdrop.
 * @returns Nothing.
 */
function handleExitDialogClick(event: MouseEvent): void {
    if (event.target === document.getElementById('exit-modal')) hideExitDialog();
}



/**
 * Closes the exit dialog when Escape is pressed while it is open.
 * @param event - The keyboard event from the document.
 * @returns Nothing.
 */
function handleEscapeKey(event: KeyboardEvent): void {
    const dialog = document.getElementById('exit-modal');

    if (event.key === 'Escape' && !dialog?.classList.contains('hidden')) hideExitDialog();
}



/**
 * Initializes all exit-dialog event listeners.
 * @returns Nothing.
 */
export function initExitDialog(): void {
    document.getElementById('exit-button')?.addEventListener('click', showExitDialog);
    document.getElementById('back-to-game-button')?.addEventListener('click', hideExitDialog);
    document.getElementById('confirm-exit-button')?.addEventListener('click', exitGame);
    document.getElementById('exit-modal')?.addEventListener('click', handleExitDialogClick);
    document.addEventListener('keydown', handleEscapeKey);
}
