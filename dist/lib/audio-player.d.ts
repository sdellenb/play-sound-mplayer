/// <reference types="node" />
import { EventEmitter } from 'events';
interface IAudioPlayer {
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
export declare class AudioPlayer extends EventEmitter implements IAudioPlayer {
    private static readonly KEYWORD_PROGRESS;
    private static readonly KEYWORD_STARTING;
    private static readonly KEYWORD_EXITING;
    private _player;
    private _audioProcess;
    private _isPlaying;
    private _isPaused;
    private _isMuted;
    private _currentVolume;
    private _isDebug;
    constructor();
    readonly isPlaying: boolean;
    readonly isPaused: boolean;
    readonly isMuted: boolean;
    readonly currentVolume: number;
    play(path: string, options?: any, debug?: boolean): void;
    stop(): void;
    pause(): void;
    resume(): void;
    mute(): void;
    unMute(): void;
    setVolume(volRel: number): void;
    private reset;
    private handlePlay;
    private logger;
}
export {};
