import 'mocha';
import { expect } from 'chai';
import { AudioPlayer, IAudioPlayer } from '../lib/AudioPlayer';
describe('AudioPlayer Test Suite', () => {

    let subject: AudioPlayer;

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
            try {
                subject.play('');
            } catch (error) {
                // tslint:disable-next-line:no-unused-expression
                expect(error).to.exist;
                expect(error.message).to.equal('No audio source specified');
            }
        });
        it('stop emits an error when no audio source is playing', () => {
            try {
                subject.stop();
            } catch (error) {
                // tslint:disable-next-line:no-unused-expression
                expect(error).to.exist;
                expect(error.message).to.equal('No audio source to stop');
            }
        });
        it('pause emits an error when no audio source is playing', () => {
            try {
                subject.pause();
            } catch (error) {
                // tslint:disable-next-line:no-unused-expression
                expect(error).to.exist;
                expect(error.message).to.equal('No audio source to pause');
            }
        });
        it('resume emits an error when no audio source is playing', () => {
            try {
                subject.resume();
            } catch (error) {
                // tslint:disable-next-line:no-unused-expression
                expect(error).to.exist;
                expect(error.message).to.equal('No audio source to resume');
            }
        });
        it('mute emits an error when no audio source is playing', () => {
            try {
                subject.mute();
            } catch (error) {
                // tslint:disable-next-line:no-unused-expression
                expect(error).to.exist;
                expect(error.message).to.equal('No audio source to mute');
            }
        });
        it('unMute emits an error when no audio source is playing', () => {
            try {
                subject.unMute();
            } catch (error) {
                // tslint:disable-next-line:no-unused-expression
                expect(error).to.exist;
                expect(error.message).to.equal('No audio source to unmute');
            }
        });
        it('setVolume emits an error hhen it is not passed an audio source', () => {
            try {
                subject.setVolume(NaN);
            } catch (error) {
                // tslint:disable-next-line:no-unused-expression
                expect(error).to.exist;
                expect(error.message).to.equal('Invalid volume argument, should between 0 and 100');
            }
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

    xdescribe('Player Events Tests', () => {
        before(function () {
            // runs before each test in this block
            subject = new AudioPlayer();
            subject.play('./test/sound.mp3', {});
            subject.mute();
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

});
