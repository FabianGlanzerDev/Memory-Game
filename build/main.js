import { initExitDialog, startGame } from './game.js';
import { initSettings, showSettings } from './settings.js';
/**
 * Initializes all top-level application controls.
 * @returns Nothing.
 */
function init() {
    document.getElementById('play-button')?.addEventListener('click', showSettings);
    document.getElementById('start-button')?.addEventListener('click', startGame);
    document.getElementById('back-to-settings-button')?.addEventListener('click', showSettings);
    document.getElementById('rematch-button')?.addEventListener('click', startGame);
    initExitDialog();
    initSettings();
}
init();
