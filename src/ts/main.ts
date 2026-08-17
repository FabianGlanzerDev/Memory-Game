import { initExitDialog, startGame } from './game.js';
import { initSettings, showSettings } from './settings.js';


/**
 * Initializes all top-level application controls.
 * @returns Nothing.
 */
function init(): void {
    document.getElementById('play-button')?.addEventListener('click', showSettings);
    document.getElementById('start-button')?.addEventListener('click', startGame);
    document.getElementById('new-game-button')?.addEventListener('click', startGame);
    initExitDialog();
    initSettings();
}



init();
