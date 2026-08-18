import { GAME_TIMING } from './config';
import type { Player } from './config';
import { getScores } from './scoring';
import { showScreen } from './navigation';
import { getGameSettings } from './settings';


type GameResult = Player | 'draw';
type ResultIcon = 'pawn' | 'scale' | 'trophy';


let resultTimeout: number | undefined;


/**
 * Clears any pending result-screen timeout.
 * @returns Nothing.
 */
function clearResultTimeout(): void {
    if (resultTimeout !== undefined) window.clearTimeout(resultTimeout);
    resultTimeout = undefined;
}



/**
 * Clears transition classes from both result screens.
 * @returns Nothing.
 */
function clearResultAnimations(): void {
    document.getElementById('game-over-screen')?.classList.remove('is-entering', 'is-leaving');
    document.getElementById('winner-screen')?.classList.remove('is-entering', 'is-leaving');
}



/**
 * Hides both result screens.
 * @returns Nothing.
 */
function hideResultScreens(): void {
    document.getElementById('game-over-screen')?.classList.add('hidden');
    document.getElementById('winner-screen')?.classList.add('hidden');
}



/**
 * Applies the active theme to both result screens.
 * @param theme - The selected theme identifier.
 * @returns Nothing.
 */
function syncResultTheme(theme: string): void {
    document.getElementById('game-over-screen')?.setAttribute('data-theme', theme);
    document.getElementById('winner-screen')?.setAttribute('data-theme', theme);
}



/**
 * Updates the game-over headline for the selected theme.
 * @param theme - The selected theme identifier.
 * @returns Nothing.
 */
function updateGameOverTitle(theme: string): void {
    const title = document.getElementById('game-over-title');

    if (title) title.textContent = theme === 'coding' ? 'Game over' : 'GAME OVER';
}



/**
 * Writes the final player scores to the game-over screen.
 * @returns Nothing.
 */
function updateFinalScore(): void {
    const scores = getScores();
    const blueScore = document.getElementById('game-over-blue-score');
    const orangeScore = document.getElementById('game-over-orange-score');

    if (blueScore) blueScore.textContent = String(scores.blue);
    if (orangeScore) orangeScore.textContent = String(scores.orange);
}



/**
 * Determines the winner from the current scores.
 * @returns The winning player or draw when both scores are equal.
 */
function getWinner(): GameResult {
    const scores = getScores();

    if (scores.blue === scores.orange) return 'draw';
    return scores.blue > scores.orange ? 'blue' : 'orange';
}



/**
 * Selects the result icon that matches the active theme.
 * @param winner - The current game result.
 * @returns The icon identifier used by the result screen.
 */
function getResultIcon(winner: GameResult): ResultIcon {
    if (winner === 'draw') return 'scale';
    return getGameSettings().theme === 'gaming' ? 'trophy' : 'pawn';
}



/**
 * Updates all winner or draw screen content.
 * @param winner - The current game result.
 * @returns Nothing.
 */
function updateWinnerContent(winner: GameResult): void {
    const screen = document.getElementById('winner-screen');
    const kicker = document.getElementById('winner-kicker');
    const title = document.getElementById('winner-title');
    const icon = document.getElementById('result-icon');

    screen?.classList.toggle('is-draw', winner === 'draw');
    if (kicker) kicker.textContent = winner === 'draw' ? "It's a" : 'The winner is';
    if (title) title.textContent = winner === 'draw' ? 'DRAW' : `${winner === 'blue' ? 'Blue' : 'Orange'} Player`;
    icon?.setAttribute('data-icon', getResultIcon(winner));
    screen?.setAttribute('data-winner', winner);
}



/**
 * Completes the animated change from game over to the final result.
 * @returns Nothing.
 */
function completeWinnerTransition(): void {
    const gameOver = document.getElementById('game-over-screen');
    const winnerScreen = document.getElementById('winner-screen');

    gameOver?.classList.remove('is-leaving');
    updateWinnerContent(getWinner());
    showScreen('winner-screen');
    winnerScreen?.classList.add('is-entering');
    resultTimeout = undefined;
}



/**
 * Starts the visible transition from score view to winner or draw view.
 * @returns Nothing.
 */
function beginWinnerTransition(): void {
    const gameOver = document.getElementById('game-over-screen');

    gameOver?.classList.remove('is-entering');
    gameOver?.classList.add('is-leaving');
    resultTimeout = window.setTimeout(completeWinnerTransition, GAME_TIMING.resultTransition);
}



/**
 * Shows the themed game-over screen and final score.
 * @returns Nothing.
 */
function showGameOver(): void {
    const settings = getGameSettings();
    const gameOver = document.getElementById('game-over-screen');

    syncResultTheme(settings.theme);
    updateGameOverTitle(settings.theme);
    updateFinalScore();
    showScreen('game-over-screen');
    gameOver?.classList.add('is-entering');
    resultTimeout = window.setTimeout(beginWinnerTransition, GAME_TIMING.winnerDelay);
}



/**
 * Schedules the game-over flow after the final match animation.
 * @returns Nothing.
 */
export function scheduleGameOver(): void {
    clearResultTimeout();
    resultTimeout = window.setTimeout(showGameOver, GAME_TIMING.gameOverDelay);
}



/**
 * Resets all result screens, animations and pending result timers.
 * @returns Nothing.
 */
export function resetResultFlow(): void {
    clearResultTimeout();
    clearResultAnimations();
    hideResultScreens();
}
