import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

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

class AudioPlayer extends EventEmitter implements IAudioPlayer {
    private static readonly KEYWORD_PROGRESS = 'A:';
    private static readonly KEYWORD_STARTING = 'Starting playback...';
    private static readonly KEYWORD_EXITING = 'Exiting...';

    private _player = 'mplayer';
    private _audioProcess: ChildProcess | null = null;

    private _isPlaying = false;
    private _isPaused = false;
    private _isMuted = false;
    private _currentVolume = 100;

    constructor() {
        super();
    }

    public get isPlaying(): boolean {
        return this._isPlaying;
    }
    public get isPaused(): boolean {
        return this._isPaused;
    }
    public get isMuted(): boolean {
        return this._isMuted;
    }
    public get currentVolume(): number {
        return this._currentVolume;
    }

    public play(path: string, options?: any): void {
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
            this.emit('stop');
            this._audioProcess.kill();
            this._audioProcess = null;
        }
     }
    public pause(): void {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to pause'));
        } else {
            if (!this._isPaused) {
                console.log('player pausing');
                this.emit('pause');
                this._isPaused = true;
                this._audioProcess.stdin.write('pause\n');
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
                this.emit('mute');
                this._isMuted = true;
                this._audioProcess.stdin.write('mute\n');

            }
        }
    }
    public unMute(): void {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to unmute'));
        } else {
            if (this._isMuted) {
                console.log('player unmuting');
                this.emit('unmute');
                this._isMuted = true;
                this._audioProcess.stdin.write('mute\n');

            }
        }
    }
    public setVolume(volRel: number): void {
        if (!volRel) {
            this.emit('error', new Error('Invalid volume argument, should between 0 and 100'));
        }
        if (volRel < 0) {
            volRel = 0;
        }
        if (volRel > 100) {
            volRel = 100;
        }
        this._currentVolume = volRel;
        if (this._audioProcess) {
            this.emit('volumeupdate');
            this._audioProcess.stdin.write('set_property volume ' + this._currentVolume + '\n');
        }
    }
    private reset(): void {
        this._currentVolume = 100;
        this._isPlaying = false;
        this._isMuted = false;
        this._isPaused = false;
    }

    private handlePlay(path: string, options: any): void {
        const args: string[] = ['-slave', path];
        this._audioProcess = spawn(this._player, args, options);

        const rexStart = new RegExp(AudioPlayer.KEYWORD_STARTING);
        const rexEnd = new RegExp(AudioPlayer.KEYWORD_EXITING);

        this._audioProcess.stdout.on('data', (chunk: any) => {
            const output: string = chunk.toString();
            if (output.substr(0, 2) === AudioPlayer.KEYWORD_PROGRESS) {
                // console.log('player progress', output);
                this.emit('progress', output);
            } else {
                if (output.match(rexStart)) {
                    // console.log('player starting');
                    this.emit('start');
                } else if (output.match(rexEnd)) {
                    // console.log('player ending');
                    this.emit('end');
                }
            }
        });

        this._audioProcess.on('exit', (code: number | null, signal: string | null) => {
            // console.log('child process exited with ' + 'code ${code} and signal ${signal}');
            this.reset();
            this.emit('exit');
        });

        this._audioProcess.on('close', (code: number, signal: string) => {
            // console.log('child process closed with ' + 'code ${code} and signal ${signal}');
            this.reset();
            this.emit('close');
        });

        this._audioProcess.on('message', (msg: any)  => {
            // console.log('child process message event ', msg);
            this.emit('message', msg);
        });

        this._audioProcess.on('error', (err: Error) => {
            // console.log('child process error', err);
            this.emit('error', err);
        });

    }
}

// Export the module
module.exports = AudioPlayer;
