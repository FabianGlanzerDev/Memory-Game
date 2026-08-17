/**
 * Scrolls the viewport to the top of the active screen.
 * @returns Nothing.
 */
export function scrollToScreenTop(): void {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
    });
}



