"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var AudioPlayer_1 = require("../lib/AudioPlayer");
describe('audioplayer tests', function () {
    var player = new AudioPlayer_1.AudioPlayer();
    xit('test', function () { });
    it('play', function () {
        var process = player.play('http://www.kozco.com/tech/organfinale.mp3', {});
    });
});
//# sourceMappingURL=AudioPlayer.spec.js.map