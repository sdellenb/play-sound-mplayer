import { IAudioPlayer } from "./IAudioPlayer";
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
// const findExec = require('find-exec');

export class AudioPlayer extends EventEmitter implements IAudioPlayer {
    private _player = 'mplayer';
    private _audioProcess: ChildProcess | null = null;;

    private isPaused = false;

    constructor() {
        super();
    }

    public play(path: string, options: any): void {
        options = typeof options === 'object' ? options: {};
        options.stdio = ['pipe', 'pipe', 'pipe'];
        options.shell = true;
        if (!path) {
            this.emit('error', new Error('No audio source specified'));
        }
        this.handlePlay(path, options);
    }

    pause(): void {}
    resume(): void {}
    stop(): void {}
    
    private handlePlay(path: string, options: any): void {
        const args: string[] = ['-slave', path]
        this._audioProcess = spawn(this._player, args, options)
        this._audioProcess.stdout.on('data', (chunk: any) => {
            const state = chunk.toString();
            const regex = new RegExp("A:");
            //if (state.substring(0,2) !== 'A:') {
            if (!state.match(regex)) {
                // console.log('data event:', state);
            }
            console.log('data::', state);
        });
        this._audioProcess.on('exit', function (code: number | null, signal: string | null) {
            console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
        });
        this._audioProcess.on('close', function (code: number, signal: string) {
            console.log('child process closed with ' +
                `code ${code} and signal ${signal}`);
        });
        this._audioProcess.on('message', function (msg: any) {
            console.log('child process message event ', msg);
        });
        this._audioProcess.on('error', function (err: Error) {
            console.log('child process error event ', err);
        });
    }
}