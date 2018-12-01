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
    describe('Player Events Tests', function () {
        before(function () {
            subject = new AudioPlayer_1.AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.mute();
        });
        it('start playing should emit a start event', function (done) {
            subject.on('start', function () {
                done();
            });
        });
        it('ending playing should emit a end event', function (done) {
            subject.on('end', function () {
                done();
            });
        });
    });
});
//# sourceMappingURL=AudioPlayer.spec.js.map