import 'mocha';
import { expect } from 'chai';
import { AudioPlayer} from '../lib/audio-player';

describe('AudioPlayer Test Suite', () => {

    let subject: any;

    describe('Basic Interface Tests', () => {
        beforeEach(function () {
            // runs before each test in this block
            subject = new AudioPlayer();
        });

        it('isPlaying should be false before play an audio source', () => {
            expect(subject.isPlaying).to.equal(false);
        });

        it('isPaused should be false before play an audio source', () => {
            expect(subject.isPaused).to.equal(false);
        });

        it('isMuted should be false before play an audio source', () => {
            expect(subject.isMuted).to.equal(false);
        });

        it('play emits an error when it is not passed an audio source', () => {
            expect(() => { subject.play(''); }).to.throw(/No audio source specified/);
        });

        it('stop emits an error when no audio source is playing', () => {
            expect(() => { subject.stop(); }).to.throw(/No audio source to stop/);
        });

        it('pause emits an error when no audio source is playing', () => {
            expect(() => { subject.pause(); }).to.throw(/No audio source to pause/);
        });

        it('resume emits an error when no audio source is playing', () => {
            expect(() => { subject.resume(); }).to.throw(/No audio source to resume/);
        });

        it('mute emits an error when no audio source is playing', () => {
            expect(() => { subject.mute(); }).to.throw(/No audio source to mute/);
        });

        it('unMute emits an error when no audio source is playing', () => {
            expect(() => { subject.unMute(); }).to.throw(/No audio source to unmute/);
        });

        it('setVolume emits an error hhen it is not passed an audio source', () => {
            expect(() => { subject.setVolume(NaN); }).to.throw(/Invalid volume argument, should between 0 and 100/);
        });

        it('setVolume < 0 results a currentVolume of 0', () => {
            expect(subject.currentVolume).to.equal(100);
            subject.setVolume(-1);
            expect(subject.currentVolume).to.equal(0);
        });
        it('setVolume > 100 results a currentVolume of 100', () => {
            expect(subject.currentVolume).to.equal(100);
            subject.setVolume(1000);
            expect(subject.currentVolume).to.equal(100);
        });
        it('setVolume > 100 results a currentVolume of 100', () => {
            expect(subject.currentVolume).to.equal(100);
            subject.setVolume(1000);
            expect(subject.currentVolume).to.equal(100);
        });
        it('setVolume 30 results a currentVolume of 30', () => {
            expect(subject.currentVolume).to.equal(100);
            subject.setVolume(30);
            expect(subject.currentVolume).to.equal(30);
        });
    });

   xdescribe('Player Start Tests', () => {
        beforeEach(function () {
            // runs before each test in this block
            subject = new AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.mute();
        });

        afterEach(function () {
            // runs before each test in this block
            subject.stop();
        });

        it('start playing should emit a start event', (done) => {
            subject.on('start', () => {
                done();
            });
        });

        it('ending playing should emit a end event', (done) => {
            subject.on('end', () => {
                done();
            });
        });
    });
    xdescribe('Player Stop Tests', () => {
        it('stop playing should emit a stop event', (done) => {
            subject = new AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.mute();
            subject.on('stop', () => {
                done();
            });
            subject.stop();
        });

    });

    xdescribe('Player Single Events Tests', () => {
        afterEach(function () {
            // runs before each test in this block
            subject.stop();
        });
        it('mute playing should emit a mute event', (done) => {
            subject = new AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.on('mute', () => {
                done();
            });
            subject.mute();
        });
        it('unmute playing should emit a unmute event', (done) => {
            subject = new AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.on('unmute', () => {
                done();
            });
            subject.mute();
            subject.unMute();
        });

        it('pause playing should emit a pause event', (done) => {
            subject = new AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.on('pause', () => {
                done();
            });
            subject.pause();
        });
        it('resume playing should emit a resume event', (done) => {
            subject = new AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.pause();
            subject.on('resume', () => {
                done();
            });
            subject.resume();
        });
        it('setVolume should emit a volumeupdate event', (done) => {
            subject = new AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.on('volumeupdate', () => {
                done();
            });
            subject.setVolume(40);
        });

    });
    xdescribe('Player Errorhandler Tests', () => {
        it('start playing with invalid source file should emit an error event', (done) => {
            subject = new AudioPlayer();
            subject.play('x./test/sound.mp3', { }, true);
            subject.on('error', (error: Error) => {
                done();
            });
        });

        it('start playing with invalid source url should emit an stream not found error event', (done) => {
            subject = new AudioPlayer();
            subject.play('xhttps://xxaudiblecdn-vh.akamaihd.net', {}, true);
            subject.on('error', (error: Error) => {
                done();
            });
        });


        it('start playing with invalid source url should emit an http 400 bad request error event', (done) => {
            subject = new AudioPlayer();
            subject.play('https://xaudiblecdn-vh.akamaihd.net', {}, true);
            subject.on('error', (error: Error) => {
                done();
            });
        });

        it('start playing with invalid source url should emit an http 403 forbidden error event', (done) => {
            subject = new AudioPlayer();
            subject.play('https://xaudiblecdn-vh.akamaihd.net/i/295890/audiblewords/content/bk/argo/002149/V$', {}, true);
            subject.on('error', (error: Error) => {
                done();
            });
        });
    });
});
