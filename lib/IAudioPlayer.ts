export interface IAudioPlayer {
    play(path: string, options?: any, next?: any): void;
    pause(): void;
    resume(): void;
    stop(): void;
    mute(): void;
    unMute(): void;
    setVolume(value: number): void;
}
