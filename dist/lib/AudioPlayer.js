"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var events_1 = require("events");
var AudioPlayer = (function (_super) {
    __extends(AudioPlayer, _super);
    function AudioPlayer() {
        var _this = _super.call(this) || this;
        _this._player = 'mplayer';
        _this._audioProcess = null;
        _this._isPlaying = false;
        _this._isPaused = false;
        _this._isMuted = false;
        _this._currentVolume = 100;
        return _this;
    }
    Object.defineProperty(AudioPlayer.prototype, "isPlaying", {
        get: function () {
            return this._isPlaying;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioPlayer.prototype, "isPaused", {
        get: function () {
            return this._isPaused;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioPlayer.prototype, "isMuted", {
        get: function () {
            return this._isMuted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioPlayer.prototype, "currentVolume", {
        get: function () {
            return this._currentVolume;
        },
        enumerable: true,
        configurable: true
    });
    AudioPlayer.prototype.play = function (path, options) {
        options = typeof options === 'object' ? options : {};
        options.stdio = ['pipe', 'pipe', 'pipe'];
        options.shell = false;
        if (!path) {
            this.emit('error', new Error('No audio source specified'));
        }
        else {
            this._isPlaying = true;
            this.handlePlay(path, options);
        }
    };
    AudioPlayer.prototype.stop = function () {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to stop'));
        }
        else {
            console.log('player stopping');
            this.emit('stop');
            this._audioProcess.kill();
            this._audioProcess = null;
        }
    };
    AudioPlayer.prototype.pause = function () {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to pause'));
        }
        else {
            if (!this._isPaused) {
                console.log('player pausing');
                this.emit('pause');
                this._isPaused = true;
                this._audioProcess.stdin.write('pause\n');
            }
        }
    };
    AudioPlayer.prototype.resume = function () {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to resume'));
        }
        else {
            if (this._isPaused) {
                console.log('player resuming');
                this._isPaused = false;
                this._audioProcess.stdin.write('pause\n');
                this.emit('resume');
            }
        }
    };
    AudioPlayer.prototype.mute = function () {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to mute'));
        }
        else {
            if (!this._isMuted) {
                console.log('player muting');
                this.emit('mute');
                this._isMuted = true;
                this._audioProcess.stdin.write('mute\n');
            }
        }
    };
    AudioPlayer.prototype.unMute = function () {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to unmute'));
        }
        else {
            if (this._isMuted) {
                console.log('player unmuting');
                this.emit('unmute');
                this._isMuted = true;
                this._audioProcess.stdin.write('mute\n');
            }
        }
    };
    AudioPlayer.prototype.setVolume = function (volRel) {
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
    };
    AudioPlayer.prototype.reset = function () {
        this._currentVolume = 100;
        this._isPlaying = false;
        this._isMuted = false;
        this._isPaused = false;
    };
    AudioPlayer.prototype.handlePlay = function (path, options) {
        var _this = this;
        var args = ['-slave', path];
        this._audioProcess = child_process_1.spawn(this._player, args, options);
        var rexStart = new RegExp(AudioPlayer.KEYWORD_STARTING);
        var rexEnd = new RegExp(AudioPlayer.KEYWORD_EXITING);
        this._audioProcess.stdout.on('data', function (chunk) {
            var output = chunk.toString();
            if (output.substr(0, 2) === AudioPlayer.KEYWORD_PROGRESS) {
                _this.emit('progress', output);
            }
            else {
                if (output.match(rexStart)) {
                    _this.emit('start');
                }
                else if (output.match(rexEnd)) {
                    _this.emit('end');
                }
            }
        });
        this._audioProcess.on('exit', function (code, signal) {
            _this.reset();
            _this.emit('exit');
        });
        this._audioProcess.on('close', function (code, signal) {
            _this.reset();
            _this.emit('close');
        });
        this._audioProcess.on('message', function (msg) {
            _this.emit('message', msg);
        });
        this._audioProcess.on('error', function (err) {
            _this.emit('error', err);
        });
    };
    AudioPlayer.KEYWORD_PROGRESS = 'A:';
    AudioPlayer.KEYWORD_STARTING = 'Starting playback...';
    AudioPlayer.KEYWORD_EXITING = 'Exiting...';
    return AudioPlayer;
}(events_1.EventEmitter));
exports.AudioPlayer = AudioPlayer;
//# sourceMappingURL=AudioPlayer.js.map