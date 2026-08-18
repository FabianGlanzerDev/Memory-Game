let currentPlayer = 'blue';
let scores = { blue: 0, orange: 0 };
/**
 * Returns the player display name used in the interface.
 * @param player - The player identifier.
 * @returns The readable player name.
 */
function getPlayerLabel(player) {
    return player === 'orange' ? 'Orange' : 'Blue';
}
/**
 * Updates the current-player label and color indicator.
 * @param player - The player whose turn is active.
 * @returns Nothing.
 */
function updateCurrentPlayer(player) {
    const label = document.getElementById('current-player');
    const indicator = document.getElementById('current-player-indicator');
    if (label)
        label.textContent = getPlayerLabel(player);
    indicator?.setAttribute('data-player', player);
}
/**
 * Updates one player's visible score.
 * @param player - The player whose score should be rendered.
 * @returns Nothing.
 */
function updateScore(player) {
    const output = document.getElementById(`${player}-score`);
    if (output)
        output.textContent = String(scores[player]);
}
/**
 * Adds one point to the active player's score.
 * @returns Nothing.
 */
export function addPoint() {
    scores[currentPlayer] += 1;
    updateScore(currentPlayer);
}
/**
 * Switches the active player after a failed match.
 * @returns Nothing.
 */
export function switchPlayer() {
    currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
    updateCurrentPlayer(currentPlayer);
}
/**
 * Resets both player scores and refreshes the score display.
 * @returns Nothing.
 */
function resetScores() {
    scores = { blue: 0, orange: 0 };
    updateScore('blue');
    updateScore('orange');
}
/**
 * Resets the score and applies the selected starting player.
 * @param player - The player selected in the settings.
 * @returns Nothing.
 */
export function resetPlayerState(player) {
    currentPlayer = player;
    resetScores();
    updateCurrentPlayer(currentPlayer);
}
/**
 * Returns a safe snapshot of the current scores.
 * @returns The blue and orange player scores.
 */
export function getScores() {
    return { ...scores };
}
