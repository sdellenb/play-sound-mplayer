/// <reference types="node" />
import { IAudioPlayer } from './IAudioPlayer';
import { EventEmitter } from 'events';
export declare class AudioPlayer extends EventEmitter implements IAudioPlayer {
    private static readonly KEYWORD_PROGRESS;
    private static readonly KEYWORD_STARTING;
    private static readonly KEYWORD_EXITING;
    private _player;
    private _audioProcess;
    private _isPlaying;
    private _isPaused;
    private _isMuted;
    constructor();
    play(path: string, options: any): void;
    stop(): void;
    pause(): void;
    resume(): void;
    mute(): void;
    unmute(): void;
    private handlePlay;
}
