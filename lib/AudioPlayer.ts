import { IAudioPlayer } from './IAudioPlayer';
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

export class AudioPlayer extends EventEmitter implements IAudioPlayer {
    private static readonly KEYWORD_PROGRESS = 'A:';
    private static readonly KEYWORD_STARTING = 'Starting playback...';
    private static readonly KEYWORD_EXITING = 'Exiting...';

    private _player = 'mplayer';
    private _audioProcess: ChildProcess | null = null;

    private _isPlaying = false;
    private _isPaused = false;
    private _isMuted = false;

    constructor() {
        super();
    }

    public play(path: string, options: any): void {
        options = typeof options === 'object' ? options : {};
        options.stdio = ['pipe', 'pipe', 'pipe'];
        options.shell = false;  // required for stopping
        if (!path) {
            this.emit('error', new Error('No audio source specified'));
        } else {
            this._isPlaying = true;
            this.handlePlay(path, options);
        }
    }

    public stop(): void {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to stop'));
        } else {
            console.log('player stopping');
            this._audioProcess.kill();
            this._audioProcess = null;
            this.emit('stop');
        }
     }

    public pause(): void {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to pause'));
        } else {
            if (!this._isPaused) {
                console.log('player pausing');
                this._isPaused = true;
                this._audioProcess.stdin.write('pause\n');
                this.emit('pause');
            }
        }
    }
    public resume(): void {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to resume'));
        } else {
            if (this._isPaused) {
                console.log('player resuming');
                this._isPaused = false;
                this._audioProcess.stdin.write('pause\n');
                this.emit('resume');
            }
        }
    }

    public mute(): void {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to mute'));
        } else {
            if (!this._isMuted) {
                console.log('player muting');
                this._isMuted = true;
                this._audioProcess.stdin.write('mute\n');
                this.emit('mute');
            }
        }
    }
    public unmute(): void {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to unmute'));
        } else {
            if (this._isMuted) {
                console.log('player unmuting');
                this._isMuted = true;
                this._audioProcess.stdin.write('mute\n');
                this.emit('unmute');
            }
        }
    }

    private handlePlay(path: string, options: any): void {
        const args: string[] = ['-slave', path];
        this._audioProcess = spawn(this._player, args, options);

        const rexStart = new RegExp(AudioPlayer.KEYWORD_STARTING);
        const rexEnd = new RegExp(AudioPlayer.KEYWORD_EXITING);

        this._audioProcess.stdout.on('data', (chunk: any) => {
            const output: string = chunk.toString();
            if (output.substr(0, 2) === AudioPlayer.KEYWORD_PROGRESS) {
                console.log('player progress', output);
                this.emit('progress', output);
            } else {
                if (output.match(rexStart)) {
                    console.log('player starting');
                    this.emit('start');
                } else if (output.match(rexEnd)) {
                    console.log('player ending');
                    this.emit('end');
                }
            }
        });

        this._audioProcess.on('exit', (code: number | null, signal: string | null) => {
            console.log('child process exited with ' + 'code ${code} and signal ${signal}');
            this._isPlaying = false;
            this._isPaused = false;
            this.emit('exit');
        });

        this._audioProcess.on('close', (code: number, signal: string) => {
            console.log('child process closed with ' + 'code ${code} and signal ${signal}');
            this._isPlaying = false;
            this._isPaused = false;
            this.emit('close');
        });

        this._audioProcess.on('message', (msg: any)  => {
            console.log('child process message event ', msg);
            this.emit('message', msg);
        });

        this._audioProcess.on('error', (err: Error) => {
            console.log('child process error', err);
            this.emit('error', err);
        });
    }
}
