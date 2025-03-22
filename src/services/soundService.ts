class SoundService {
    private clickSound: HTMLAudioElement;
    private placeSound: HTMLAudioElement;
    private errorSound: HTMLAudioElement;
    private victorySound: HTMLAudioElement;
    private backgroundMusic: HTMLAudioElement;
    private isMusicEnabled: boolean = true;
    private isSoundEnabled: boolean = true;
  
    constructor() {
        this.clickSound = new Audio('/sounds/click.mp3');
        this.placeSound = new Audio('/sounds/place.mp3');
        this.errorSound = new Audio('/sounds/error.mp3');
        this.victorySound = new Audio('/sounds/victory.mp3');
        this.backgroundMusic = new Audio('/sounds/background.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        
        // Setup sound volumes
        [this.clickSound, this.placeSound, this.errorSound, this.victorySound]
            .forEach(sound => sound.volume = 1.0);
    }

    startBackgroundMusic() {
        if (this.isMusicEnabled) {
            this.backgroundMusic.play();
        }
    }

    stopBackgroundMusic() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }

    toggleMusic() {
        this.isMusicEnabled = !this.isMusicEnabled;
        if (this.isMusicEnabled) {
            this.startBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
    }

    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        [this.clickSound, this.placeSound, this.errorSound, this.victorySound]
            .forEach(sound => sound.volume = this.isSoundEnabled ? 1.0 : 0);
    }

    playClick() {
        if (this.isSoundEnabled) {
            this.clickSound.currentTime = 0;
            this.clickSound.play();
        }
    }

    playPlace() {
        if (this.isSoundEnabled) {
            this.placeSound.currentTime = 0;
            this.placeSound.play();
        }
    }

    playError() {
        if (this.isSoundEnabled) {
            this.errorSound.currentTime = 0;
            this.errorSound.play();
        }
    }

    playVictory() {
        if (this.isSoundEnabled) {
            this.victorySound.currentTime = 0;
            this.victorySound.play();
        }
    }
}

export const soundService = new SoundService();