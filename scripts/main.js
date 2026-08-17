import { initExitDialog, startGame } from './game.js';
import { initSettings, showSettings } from './settings.js';
/**
 * Initializes all top-level application controls.
 * @returns Nothing.
 */
function init() {
    var _a, _b, _c, _d;
    (_a = document.getElementById('play-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showSettings);
    (_b = document.getElementById('start-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', startGame);
    (_c = document.getElementById('back-to-settings-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', showSettings);
    (_d = document.getElementById('rematch-button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', startGame);
    initExitDialog();
    initSettings();
}
init();
