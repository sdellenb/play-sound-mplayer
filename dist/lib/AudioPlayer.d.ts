export interface IAudioPlayer {
    readonly isPlaying: boolean;
    readonly isPaused: boolean;
    readonly isMuted: boolean;
    readonly currentVolume: number;
    play(path: string, options?: any): void;
    pause(): void;
    resume(): void;
    stop(): void;
    mute(): void;
    unMute(): void;
    setVolume(value: number): void;
}
