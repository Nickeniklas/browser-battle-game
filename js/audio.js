/*  FUNCTIONS FOR MUSIC AND SOUND EFFECTS */
//background music
function backgroundMusic(audioContent) {
    // random background song
    const audioFiles = [
        "media/audio/background/city-uplifting-vibes.mp3",
        "media/audio/background/funky-beat.mp3",
        "media/audio/background/happy-rock-corporate-loop.wav",
        "media/audio/background/nice_violin-beat.wav",
        "media/audio/background/rock-hellye.wav"
    ];
    const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
    audioContent.src = randomFile;
    audioContent.play();
}
function initializeBGAudio() {
    // audio elements
    const audiobtn = document.querySelector('#top-nav-btn-audio');
    const audioContent = document.querySelector('#top-nav-audio-controls');
    const nextSongBtn = document.querySelector('#next-song-btn');

    // toggle controls visibility
    audiobtn.addEventListener('click', () => {
        console.log('click');
        audioContent.classList.toggle('hidden');
        nextSongBtn.classList.toggle('hidden');
    });

    // initial random song
    backgroundMusic(audioContent);

    // next song button eventlistener
    nextSongBtn.addEventListener('click', ()=> {
        backgroundMusic(audioContent);
    });
}

//sound effect
function playSoundEffect(soundFile) {
    //EX: soundFile = "../media/audio/effects/click-sound.mp3"
    soundFile = new Audio(soundFile);
    soundFile.play();
}