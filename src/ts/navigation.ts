const APP_SCREEN_IDS = [
    'home-screen',
    'settings-screen',
    'game-screen',
    'game-over-screen',
    'winner-screen'
] as const;


type AppScreenId = typeof APP_SCREEN_IDS[number];


/**
 * Scrolls the viewport to the top without animation.
 * @returns Nothing.
 */
export function scrollToScreenTop(): void {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}



/**
 * Shows one application screen and hides all other screens.
 * @param screenId - The id of the screen that should become visible.
 * @returns Nothing.
 */
export function showScreen(screenId: AppScreenId): void {
    APP_SCREEN_IDS.forEach((id) => {
        document.getElementById(id)?.classList.toggle('hidden', id !== screenId);
    });

    scrollToScreenTop();
}



/**
 * Focuses an element without moving the viewport.
 * @param element - The element that should receive keyboard focus.
 * @returns Nothing.
 */
export function focusWithoutScroll(element: HTMLElement | null): void {
    element?.focus({ preventScroll: true });
}
