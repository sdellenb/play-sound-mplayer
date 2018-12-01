"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var chai_1 = require("chai");
var AudioPlayer_1 = require("../lib/AudioPlayer");
describe('AudioPlayer Test Suite', function () {
    var subject;
    describe('Basic Interface Tests', function () {
        beforeEach(function () {
            subject = new AudioPlayer_1.AudioPlayer();
        });
        it('isPlaying should be false before play an audio source', function () {
            chai_1.expect(subject.isPlaying).to.equal(false);
        });
        it('isPaused should be false before play an audio source', function () {
            chai_1.expect(subject.isPaused).to.equal(false);
        });
        it('isMuted should be false before play an audio source', function () {
            chai_1.expect(subject.isMuted).to.equal(false);
        });
        it('play emits an error when it is not passed an audio source', function () {
            try {
                subject.play('');
            }
            catch (error) {
                chai_1.expect(error).to.exist;
                chai_1.expect(error.message).to.equal('No audio source specified');
            }
        });
        it('stop emits an error when no audio source is playing', function () {
            try {
                subject.stop();
            }
            catch (error) {
                chai_1.expect(error).to.exist;
                chai_1.expect(error.message).to.equal('No audio source to stop');
            }
        });
        it('pause emits an error when no audio source is playing', function () {
            try {
                subject.pause();
            }
            catch (error) {
                chai_1.expect(error).to.exist;
                chai_1.expect(error.message).to.equal('No audio source to pause');
            }
        });
        it('resume emits an error when no audio source is playing', function () {
            try {
                subject.resume();
            }
            catch (error) {
                chai_1.expect(error).to.exist;
                chai_1.expect(error.message).to.equal('No audio source to resume');
            }
        });
        it('mute emits an error when no audio source is playing', function () {
            try {
                subject.mute();
            }
            catch (error) {
                chai_1.expect(error).to.exist;
                chai_1.expect(error.message).to.equal('No audio source to mute');
            }
        });
        it('unMute emits an error when no audio source is playing', function () {
            try {
                subject.unMute();
            }
            catch (error) {
                chai_1.expect(error).to.exist;
                chai_1.expect(error.message).to.equal('No audio source to unmute');
            }
        });
        it('setVolume emits an error hhen it is not passed an audio source', function () {
            try {
                subject.setVolume(NaN);
            }
            catch (error) {
                chai_1.expect(error).to.exist;
                chai_1.expect(error.message).to.equal('Invalid volume argument, should between 0 and 100');
            }
        });
        it('setVolume < 0 results a currentVolume of 0', function () {
            chai_1.expect(subject.currentVolume).to.equal(100);
            subject.setVolume(-1);
            chai_1.expect(subject.currentVolume).to.equal(0);
        });
        it('setVolume > 100 results a currentVolume of 100', function () {
            chai_1.expect(subject.currentVolume).to.equal(100);
            subject.setVolume(1000);
            chai_1.expect(subject.currentVolume).to.equal(100);
        });
        it('setVolume > 100 results a currentVolume of 100', function () {
            chai_1.expect(subject.currentVolume).to.equal(100);
            subject.setVolume(1000);
            chai_1.expect(subject.currentVolume).to.equal(100);
        });
        it('setVolume 30 results a currentVolume of 30', function () {
            chai_1.expect(subject.currentVolume).to.equal(100);
            subject.setVolume(30);
            chai_1.expect(subject.currentVolume).to.equal(30);
        });
    });
    xdescribe('Player Events Tests', function () {
        xit('play', function () {
            subject.play('http://www.kozco.com/tech/organfinale.mp3', {});
            setTimeout(function () {
                subject.pause();
            }, 2000);
            setTimeout(function () {
                subject.resume();
            }, 5000);
        });
        xit('mute/unmute', function () {
            subject.play('http://www.kozco.com/tech/organfinale.mp3', {});
            setTimeout(function () {
                subject.mute();
            }, 2000);
            setTimeout(function () {
                subject.unMute();
            }, 5000);
        });
        xit('setVolume', function () {
            var process = subject.play('http://www.kozco.com/tech/organfinale.mp3', {});
            setTimeout(function () {
                subject.setVolume(30);
            }, 2000);
            setTimeout(function () {
                subject.setVolume(90);
            }, 5000);
        });
    });
});
//# sourceMappingURL=AudioPlayer.spec.js.map