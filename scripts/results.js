import { GAME_TIMING } from './config.js';
import { getScores } from './scoring.js';
import { scrollToScreenTop } from './navigation.js';
import { getGameSettings } from './settings.js';
let resultTimeout;
/**
 * Clears any pending result-screen timeout.
 * @returns Nothing.
 */
function clearResultTimeout() {
    if (resultTimeout !== undefined)
        window.clearTimeout(resultTimeout);
    resultTimeout = undefined;
}
/**
 * Clears transition classes from both result screens.
 * @returns Nothing.
 */
function clearResultAnimations() {
    var _a, _b;
    (_a = document.getElementById('game-over-screen')) === null || _a === void 0 ? void 0 : _a.classList.remove('is-entering', 'is-leaving');
    (_b = document.getElementById('winner-screen')) === null || _b === void 0 ? void 0 : _b.classList.remove('is-entering', 'is-leaving');
}
/**
 * Hides both result screens.
 * @returns Nothing.
 */
function hideResultScreens() {
    var _a, _b;
    (_a = document.getElementById('game-over-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('winner-screen')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
}
/**
 * Applies the active theme to both result screens.
 * @param theme - The selected theme identifier.
 * @returns Nothing.
 */
function syncResultTheme(theme) {
    var _a, _b;
    (_a = document.getElementById('game-over-screen')) === null || _a === void 0 ? void 0 : _a.setAttribute('data-theme', theme);
    (_b = document.getElementById('winner-screen')) === null || _b === void 0 ? void 0 : _b.setAttribute('data-theme', theme);
}
/**
 * Updates the game-over headline for the selected theme.
 * @param theme - The selected theme identifier.
 * @returns Nothing.
 */
function updateGameOverTitle(theme) {
    const title = document.getElementById('game-over-title');
    if (title)
        title.textContent = theme === 'coding' ? 'Game over' : 'GAME OVER';
}
/**
 * Writes the final player scores to the game-over screen.
 * @returns Nothing.
 */
function updateFinalScore() {
    const scores = getScores();
    const blueScore = document.getElementById('game-over-blue-score');
    const orangeScore = document.getElementById('game-over-orange-score');
    if (blueScore)
        blueScore.textContent = String(scores.blue);
    if (orangeScore)
        orangeScore.textContent = String(scores.orange);
}
/**
 * Determines the winner from the current scores.
 * @returns The winning player or draw when both scores are equal.
 */
function getWinner() {
    const scores = getScores();
    if (scores.blue === scores.orange)
        return 'draw';
    return scores.blue > scores.orange ? 'blue' : 'orange';
}
/**
 * Selects the result icon that matches the active theme.
 * @param winner - The current game result.
 * @returns The icon identifier used by the result screen.
 */
function getResultIcon(winner) {
    if (winner === 'draw')
        return 'scale';
    return getGameSettings().theme === 'gaming' ? 'trophy' : 'pawn';
}
/**
 * Updates all winner or draw screen content.
 * @param winner - The current game result.
 * @returns Nothing.
 */
function updateWinnerContent(winner) {
    const screen = document.getElementById('winner-screen');
    const kicker = document.getElementById('winner-kicker');
    const title = document.getElementById('winner-title');
    const icon = document.getElementById('result-icon');
    screen === null || screen === void 0 ? void 0 : screen.classList.toggle('is-draw', winner === 'draw');
    if (kicker)
        kicker.textContent = winner === 'draw' ? "It's a" : 'The winner is';
    if (title)
        title.textContent = winner === 'draw' ? 'DRAW' : `${winner === 'blue' ? 'Blue' : 'Orange'} Player`;
    icon === null || icon === void 0 ? void 0 : icon.setAttribute('data-icon', getResultIcon(winner));
    screen === null || screen === void 0 ? void 0 : screen.setAttribute('data-winner', winner);
}
/**
 * Completes the animated change from game over to the final result.
 * @returns Nothing.
 */
function completeWinnerTransition() {
    const gameOver = document.getElementById('game-over-screen');
    const winnerScreen = document.getElementById('winner-screen');
    gameOver === null || gameOver === void 0 ? void 0 : gameOver.classList.add('hidden');
    gameOver === null || gameOver === void 0 ? void 0 : gameOver.classList.remove('is-leaving');
    updateWinnerContent(getWinner());
    winnerScreen === null || winnerScreen === void 0 ? void 0 : winnerScreen.classList.remove('hidden');
    winnerScreen === null || winnerScreen === void 0 ? void 0 : winnerScreen.classList.add('is-entering');
    scrollToScreenTop();
    resultTimeout = undefined;
}
/**
 * Starts the visible transition from score view to winner or draw view.
 * @returns Nothing.
 */
function beginWinnerTransition() {
    const gameOver = document.getElementById('game-over-screen');
    gameOver === null || gameOver === void 0 ? void 0 : gameOver.classList.remove('is-entering');
    gameOver === null || gameOver === void 0 ? void 0 : gameOver.classList.add('is-leaving');
    resultTimeout = window.setTimeout(completeWinnerTransition, GAME_TIMING.resultTransition);
}
/**
 * Shows the themed game-over screen and final score.
 * @returns Nothing.
 */
function showGameOver() {
    var _a;
    const settings = getGameSettings();
    const gameOver = document.getElementById('game-over-screen');
    syncResultTheme(settings.theme);
    updateGameOverTitle(settings.theme);
    updateFinalScore();
    (_a = document.getElementById('game-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    gameOver === null || gameOver === void 0 ? void 0 : gameOver.classList.remove('hidden');
    gameOver === null || gameOver === void 0 ? void 0 : gameOver.classList.add('is-entering');
    scrollToScreenTop();
    resultTimeout = window.setTimeout(beginWinnerTransition, GAME_TIMING.winnerDelay);
}
/**
 * Schedules the game-over flow after the final match animation.
 * @returns Nothing.
 */
export function scheduleGameOver() {
    clearResultTimeout();
    resultTimeout = window.setTimeout(showGameOver, GAME_TIMING.gameOverDelay);
}
/**
 * Resets all result screens, animations and pending result timers.
 * @returns Nothing.
 */
export function resetResultFlow() {
    clearResultTimeout();
    clearResultAnimations();
    hideResultScreens();
}
