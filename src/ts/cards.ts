import { createCardPaths, GAME_TIMING } from './config.js';
import type { GameSettings, MemoryCardData } from './config.js';
import { addPoint, switchPlayer } from './scoring.js';
import { scheduleGameOver } from './results.js';


let openedCards: HTMLButtonElement[] = [];
let boardLocked = false;
let flipTimeout: number | undefined;


/**
 * Adds one matching card pair to a deck.
 * @param deck - The deck that receives the pair.
 * @param image - The shared front image of both cards.
 * @param pairId - The identifier used to compare the pair.
 * @returns Nothing.
 */
function addPair(deck: MemoryCardData[], image: string, pairId: number): void {
    deck.push({ pairId, image });
    deck.push({ pairId, image });
}



/**
 * Randomizes a deck with the Fisher-Yates algorithm.
 * @param deck - The deck that should be shuffled.
 * @returns The shuffled deck.
 */
function shuffleDeck(deck: MemoryCardData[]): MemoryCardData[] {
    for (let index = deck.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [deck[index], deck[randomIndex]] = [deck[randomIndex], deck[index]];
    }

    return deck;
}



/**
 * Creates a shuffled deck for the selected theme and board size.
 * @param settings - The active game settings.
 * @returns The complete memory card deck.
 */
function createDeck(settings: GameSettings): MemoryCardData[] {
    const fronts = createCardPaths(settings.theme);
    const selectedFronts = fronts.slice(0, settings.cardCount / 2);
    const deck: MemoryCardData[] = [];

    selectedFronts.forEach((image, pairId) => addPair(deck, image, pairId));
    return shuffleDeck(deck);
}



/**
 * Creates one visual side of a memory card.
 * @param className - The CSS class of the card face.
 * @returns The new card face element.
 */
function createCardFace(className: string): HTMLSpanElement {
    const face = document.createElement('span');

    face.className = `memory-card-face ${className}`;
    return face;
}



/**
 * Creates the image side of a memory card.
 * @param image - The card front image path.
 * @returns The completed front face element.
 */
function createFrontFace(image: string): HTMLSpanElement {
    const face = createCardFace('memory-card-front');
    const img = document.createElement('img');

    img.src = image;
    img.alt = '';
    face.append(img);
    return face;
}



/**
 * Updates the accessible state of a memory card.
 * @param card - The card whose label should be updated.
 * @param state - The readable state of the card.
 * @returns Nothing.
 */
function updateCardAccessibility(card: HTMLButtonElement, state: string): void {
    const cardNumber = Number(card.dataset.cardIndex) + 1;
    const pairNumber = Number(card.dataset.pairId) + 1;
    const symbol = state === 'hidden' ? '' : `, symbol ${pairNumber}`;

    card.setAttribute('aria-label', `Memory card ${cardNumber}, ${state}${symbol}`);
    card.setAttribute('aria-pressed', String(state !== 'hidden'));
}



/**
 * Applies required attributes and metadata to a memory card button.
 * @param card - The card button that should be configured.
 * @param data - The card pair data.
 * @param index - The zero-based position in the board.
 * @returns Nothing.
 */
function configureCard(card: HTMLButtonElement, data: MemoryCardData, index: number): void {
    card.className = 'memory-card';
    card.type = 'button';
    card.dataset.pairId = String(data.pairId);
    card.dataset.cardIndex = String(index);
    updateCardAccessibility(card, 'hidden');
}



/**
 * Creates one fully interactive memory card button.
 * @param data - The card pair data.
 * @param index - The zero-based position in the board.
 * @returns The completed memory card button.
 */
function createMemoryCard(data: MemoryCardData, index: number): HTMLButtonElement {
    const card = document.createElement('button');
    const inner = document.createElement('span');

    configureCard(card, data, index);
    inner.className = 'memory-card-inner';
    inner.append(createCardFace('memory-card-back'), createFrontFace(data.image));
    card.append(inner);
    card.addEventListener('click', () => handleCardClick(card));
    return card;
}



/**
 * Creates all card elements for one game board.
 * @param deck - The shuffled memory deck.
 * @returns A fragment containing all card buttons.
 */
function createBoardFragment(deck: MemoryCardData[]): DocumentFragment {
    const fragment = document.createDocumentFragment();

    deck.forEach((data, index) => fragment.append(createMemoryCard(data, index)));
    return fragment;
}



/**
 * Renders a new board for the selected game settings.
 * @param settings - The active game settings.
 * @returns Nothing.
 */
export function renderBoard(settings: GameSettings): void {
    const board = document.getElementById('game-board');
    const columns = settings.cardCount === 16 ? 4 : 6;

    if (!board) return;
    board.replaceChildren(createBoardFragment(createDeck(settings)));
    board.style.setProperty('--board-columns', String(columns));
}



/**
 * Checks whether a card may currently be flipped.
 * @param card - The card selected by the player.
 * @returns True when the card can be opened.
 */
function canFlipCard(card: HTMLButtonElement): boolean {
    return !boardLocked
        && !card.classList.contains('is-flipped')
        && card.dataset.matched !== 'true';
}



/**
 * Reveals a memory card and updates its accessible state.
 * @param card - The card that should be revealed.
 * @returns Nothing.
 */
function flipCard(card: HTMLButtonElement): void {
    card.classList.add('is-flipped');
    updateCardAccessibility(card, 'revealed');
}



/**
 * Hides a previously revealed memory card.
 * @param card - The card that should be hidden again.
 * @returns Nothing.
 */
function closeCard(card: HTMLButtonElement): void {
    card.classList.remove('is-flipped');
    updateCardAccessibility(card, 'hidden');
}



/**
 * Handles a player click on one memory card.
 * @param card - The card selected by the player.
 * @returns Nothing.
 */
function handleCardClick(card: HTMLButtonElement): void {
    if (!canFlipCard(card)) return;

    flipCard(card);
    openedCards.push(card);
    if (openedCards.length === 2) checkOpenCards();
}



/**
 * Checks whether the two currently open cards form a pair.
 * @returns True when both cards have the same pair identifier.
 */
function areOpenedCardsMatched(): boolean {
    const [first, second] = openedCards;

    return first.dataset.pairId === second.dataset.pairId;
}



/**
 * Evaluates the two open cards and starts the appropriate result flow.
 * @returns Nothing.
 */
function checkOpenCards(): void {
    if (areOpenedCardsMatched()) {
        keepMatchedCards();
        return;
    }

    boardLocked = true;
    flipTimeout = window.setTimeout(closeOpenCards, GAME_TIMING.mismatchDelay);
}



/**
 * Marks one card as permanently matched.
 * @param card - The card that belongs to a found pair.
 * @returns Nothing.
 */
function markCardMatched(card: HTMLButtonElement): void {
    card.dataset.matched = 'true';
    card.disabled = true;
    updateCardAccessibility(card, 'matched');
}



/**
 * Checks whether every card on the current board is matched.
 * @returns True when the game is complete.
 */
function isGameComplete(): boolean {
    const cards = Array.from(document.querySelectorAll<HTMLButtonElement>('.memory-card'));

    return cards.length > 0 && cards.every((card) => card.dataset.matched === 'true');
}



/**
 * Starts the game-over flow when the final pair was found.
 * @returns Nothing.
 */
function finishGameIfComplete(): void {
    if (!isGameComplete()) return;

    boardLocked = true;
    scheduleGameOver();
}



/**
 * Keeps a correct pair open and awards one point.
 * @returns Nothing.
 */
function keepMatchedCards(): void {
    openedCards.forEach(markCardMatched);
    addPoint();
    openedCards = [];
    finishGameIfComplete();
}



/**
 * Closes a wrong pair and passes the turn to the other player.
 * @returns Nothing.
 */
function closeOpenCards(): void {
    openedCards.forEach(closeCard);
    switchPlayer();
    openedCards = [];
    boardLocked = false;
    flipTimeout = undefined;
}



/**
 * Clears pending card interactions before leaving or restarting a game.
 * @returns Nothing.
 */
export function resetCardInteraction(): void {
    if (flipTimeout !== undefined) window.clearTimeout(flipTimeout);
    openedCards = [];
    boardLocked = false;
    flipTimeout = undefined;
}



