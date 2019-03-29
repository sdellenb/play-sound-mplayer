"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var chai_1 = require("chai");
var audio_player_1 = require("../lib/audio-player");
describe('AudioPlayer Test Suite', function () {
    var subject;
    describe('Basic Interface Tests', function () {
        beforeEach(function () {
            subject = new audio_player_1.AudioPlayer();
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
            chai_1.expect(function () { subject.play(''); }).to.throw(/No audio source specified/);
        });
        it('stop emits an error when no audio source is playing', function () {
            chai_1.expect(function () { subject.stop(); }).to.throw(/No audio source to stop/);
        });
        it('pause emits an error when no audio source is playing', function () {
            chai_1.expect(function () { subject.pause(); }).to.throw(/No audio source to pause/);
        });
        it('resume emits an error when no audio source is playing', function () {
            chai_1.expect(function () { subject.resume(); }).to.throw(/No audio source to resume/);
        });
        it('mute emits an error when no audio source is playing', function () {
            chai_1.expect(function () { subject.mute(); }).to.throw(/No audio source to mute/);
        });
        it('unMute emits an error when no audio source is playing', function () {
            chai_1.expect(function () { subject.unMute(); }).to.throw(/No audio source to unmute/);
        });
        it('setVolume emits an error hhen it is not passed an audio source', function () {
            chai_1.expect(function () { subject.setVolume(NaN); }).to.throw(/Invalid volume argument, should between 0 and 100/);
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
        beforeEach(function () {
            subject = new audio_player_1.AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.mute();
        });
        afterEach(function () {
            subject.stop();
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
    describe('Player Epecific Events Tests', function () {
        it('stop playing should emit a stop event', function (done) {
            subject = new audio_player_1.AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.mute();
            subject.on('stop', function () {
                done();
            });
            subject.stop();
        });
    });
    describe('Player Single Events Tests', function () {
        afterEach(function () {
            subject.stop();
        });
        it('mute playing should emit a mute event', function (done) {
            subject = new audio_player_1.AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.on('mute', function () {
                done();
            });
            subject.mute();
        });
        it('unmute playing should emit a unmute event', function (done) {
            subject = new audio_player_1.AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.on('unmute', function () {
                done();
            });
            subject.mute();
            subject.unMute();
        });
        it('pause playing should emit a pause event', function (done) {
            subject = new audio_player_1.AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.on('pause', function () {
                done();
            });
            subject.pause();
        });
        it('resume playing should emit a resume event', function (done) {
            subject = new audio_player_1.AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.pause();
            subject.on('resume', function () {
                done();
            });
            subject.resume();
        });
        it('setVolume should emit a volumeupdate event', function (done) {
            subject = new audio_player_1.AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.on('volumeupdate', function () {
                done();
            });
            subject.setVolume(40);
        });
    });
});
//# sourceMappingURL=audio-player.spec.js.map