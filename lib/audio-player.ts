import { spawn, ChildProcess } from 'child_process';
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

export class AudioPlayer extends EventEmitter implements IAudioPlayer {
    private static readonly KEYWORD_PROGRESS = 'A:';
    private static readonly KEYWORD_STARTING = 'Starting playback...';
    private static readonly KEYWORD_EXITING = 'Exiting...';

    private _player = 'mplayer';
    private _audioProcess: ChildProcess | null = null;

    private _isPlaying = false;
    private _isPaused = false;
    private _isMuted = false;
    private _currentVolume = 100;

    private _isDebug = false;

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

    public play(path: string, options?: any, debug: boolean = false): void {
        options = typeof options === 'object' ? options : {};
        this._isDebug = debug;
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
            // console.log('player stopping');
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
                // console.log('player pausing');
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
                // console.log('player resuming');
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
                // console.log('player muting');
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
                // console.log('player unmuting');
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
        let buffer = new Buffer('');
        const args: string[] = ['-slave', path];
        this._audioProcess = spawn(this._player, args, options);

        const rexStart = new RegExp(AudioPlayer.KEYWORD_STARTING);
        const rexEnd = new RegExp(AudioPlayer.KEYWORD_EXITING);


        this._audioProcess.on('close', (code: number, signal: string) => {
            this.reset();
            // check for errors on stderr
            const customError = this.customError('MPlayerError', buffer);
            if (customError) {
                this.logger('child process error');
                this.emit('error', customError);
            } else {
                this.logger('child process closed with code:' + code + ' and signal:' + signal);
                this.emit('close');
            }
        });

        this._audioProcess.on('error', (err: Error) => {
            this.logger('child process error' + err);
            this.reset();
            this.emit('error', err);
        });

        this._audioProcess.on('exit', (code: number | null, signal: string | null) => {
            this.reset();
            if (buffer.length === 0) {
                this.logger('child process exited with code:' + code + ' and signal:' + signal);
                this.emit('exit');
            }
        });

        this._audioProcess.on('message', (msg: any)  => {
            this.logger('child process message event: ' + msg);
            this.emit('message', msg);
        });

        this._audioProcess.stdout.on('data', (chunk: any) => {
            const output: string = chunk.toString();
            if (output.substr(0, 2) === AudioPlayer.KEYWORD_PROGRESS) {
                // this.logger('player progress:' + output);
                this.emit('progress', output);
            } else {
                if (output.match(rexStart)) {
                    this.logger('player starting');
                    this.emit('start');
                } else if (output.match(rexEnd) && buffer.length === 0) {
                    this.logger('player ending');
                    this.emit('end');
                }
            }
        });

        this._audioProcess.stderr.on('data', (chunk: any) => {
            buffer += chunk;
            // console.log('from stderr', buffer.toString());
        });
    }

    private logger(message: string) {
        if (this._isDebug) {
            console.log(message);
        }
    }

    private customError(name: string, buffer: Buffer): Error | null {
        let retValue = null;
        let message = '';
        if (buffer.length > 0) {
            const bufferStr = buffer.toString();
            this.logger('Buffer:' + bufferStr);
            if (bufferStr.match('File not found')) {
                message = 'File not found error';
            } else if (bufferStr.match('No stream found to handle')) {
                message = 'No stream found to handle';
            }  else if (bufferStr.match('HTTP error 400 Bad Request')) {
                message = ' Http error 400 Bad Request';
            } else if (bufferStr.match('HTTP error 403 Forbidden')) {
                message = ' Http error 403 Forbidden';
            }
            const err = new Error(message);
            err.stack = '';
            retValue = message.length > 0 ? err : null;
        }
        return retValue;
    }
}


