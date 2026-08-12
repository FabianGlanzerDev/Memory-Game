function showSettings(): void {
    const homeScreen = document.getElementById('home-screen');
    const settingsScreen = document.getElementById('settings-screen');

    homeScreen?.classList.add('hidden');
    settingsScreen?.classList.remove('hidden');
}


function init(): void {
    const playButton = document.getElementById('play-button');

    playButton?.addEventListener('click', showSettings);
}


init();