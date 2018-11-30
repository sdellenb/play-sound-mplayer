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
        _this.isPaused = false;
        return _this;
    }
    ;
    AudioPlayer.prototype.play = function (path, options) {
        options = typeof options === 'object' ? options : {};
        options.stdio = ['pipe', 'pipe', 'pipe'];
        options.shell = true;
        if (!path) {
            this.emit('error', new Error('No audio source specified'));
        }
        this.handlePlay(path, options);
    };
    AudioPlayer.prototype.pause = function () { };
    AudioPlayer.prototype.resume = function () { };
    AudioPlayer.prototype.stop = function () { };
    AudioPlayer.prototype.handlePlay = function (path, options) {
        var args = ['-slave', path];
        this._audioProcess = child_process_1.spawn(this._player, args, options);
        this._audioProcess.stdout.on('data', function (chunk) {
            var state = chunk.toString();
            var regex = new RegExp("A:");
            if (!state.match(regex)) {
            }
            console.log('data::', state);
        });
        this._audioProcess.on('exit', function (code, signal) {
            console.log('child process exited with ' +
                ("code " + code + " and signal " + signal));
        });
        this._audioProcess.on('close', function (code, signal) {
            console.log('child process closed with ' +
                ("code " + code + " and signal " + signal));
        });
        this._audioProcess.on('message', function (msg) {
            console.log('child process message event ', msg);
        });
        this._audioProcess.on('error', function (err) {
            console.log('child process error event ', err);
        });
    };
    return AudioPlayer;
}(events_1.EventEmitter));
exports.AudioPlayer = AudioPlayer;
//# sourceMappingURL=AudioPlayer.js.map