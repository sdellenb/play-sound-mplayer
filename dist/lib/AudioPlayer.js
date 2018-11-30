"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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
        return _this;
    }
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
            this._audioProcess.kill();
            this._audioProcess = null;
            this.emit('stop');
        }
    };
    AudioPlayer.prototype.pause = function () {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to pause'));
        }
        else {
            if (!this._isPaused) {
                console.log('player pausing');
                this._isPaused = true;
                this._audioProcess.stdin.write('pause\n');
                this.emit('pause');
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
                this._isMuted = true;
                this._audioProcess.stdin.write('mute\n');
                this.emit('mute');
            }
        }
    };
    AudioPlayer.prototype.unmute = function () {
        if (!this._audioProcess) {
            this.emit('error', new Error('No audio source to unmute'));
        }
        else {
            if (this._isMuted) {
                console.log('player unmuting');
                this._isMuted = true;
                this._audioProcess.stdin.write('mute\n');
                this.emit('unmute');
            }
        }
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
                console.log('player progress', output);
                _this.emit('progress', output);
            }
            else {
                if (output.match(rexStart)) {
                    console.log('player starting');
                    _this.emit('start');
                }
                else if (output.match(rexEnd)) {
                    console.log('player ending');
                    _this.emit('end');
                }
            }
        });
        this._audioProcess.on('exit', function (code, signal) {
            console.log('child process exited with ' + 'code ${code} and signal ${signal}');
            _this._isPlaying = false;
            _this._isPaused = false;
            _this.emit('exit');
        });
        this._audioProcess.on('close', function (code, signal) {
            console.log('child process closed with ' + 'code ${code} and signal ${signal}');
            _this._isPlaying = false;
            _this._isPaused = false;
            _this.emit('close');
        });
        this._audioProcess.on('message', function (msg) {
            console.log('child process message event ', msg);
            _this.emit('message', msg);
        });
        this._audioProcess.on('error', function (err) {
            console.log('child process error', err);
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