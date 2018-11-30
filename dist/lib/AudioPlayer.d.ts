/// <reference types="node" />
import { IAudioPlayer } from "./IAudioPlayer";
import { EventEmitter } from 'events';
export declare class AudioPlayer extends EventEmitter implements IAudioPlayer {
    private _player;
    private _audioProcess;
    private isPaused;
    constructor();
    play(path: string, options: any): void;
    pause(): void;
    resume(): void;
    stop(): void;
    private handlePlay;
}
