"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var AudioPlayer_1 = require("../lib/AudioPlayer");
describe('audioplayer tests', function () {
    var player = new AudioPlayer_1.AudioPlayer();
    xit('test', function () { });
    xit('play', function () {
        var process = player.play('http://www.kozco.com/tech/organfinale.mp3', {});
        setTimeout(function () {
            player.pause();
        }, 2000);
        setTimeout(function () {
            player.resume();
        }, 5000);
    });
    it('mute/unmute', function () {
        var process = player.play('http://www.kozco.com/tech/organfinale.mp3', {});
        setTimeout(function () {
            player.mute();
        }, 2000);
        setTimeout(function () {
            player.unmute();
        }, 5000);
    });
});
//# sourceMappingURL=AudioPlayer.spec.js.map