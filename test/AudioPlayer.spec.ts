import { expect } from 'chai';
import 'mocha';

import { AudioPlayer } from '../lib/AudioPlayer';


describe('audioplayer tests', () => {

    const player = new AudioPlayer();


    xit('test', () => { });

    //http://www.kozco.com/tech/organfinale.mp3
    xit('play', () => {
        // const process = player.play('e:/asound.wav', {});
        const process = player.play('http://www.kozco.com/tech/organfinale.mp3', {});
        setTimeout(() => {
            player.pause();
        }, 2000);
        setTimeout(() => {
            player.resume();
        }, 5000);
    });
    it('mute/unmute', () => {
        // const process = player.play('e:/asound.wav', {});
        const process = player.play('http://www.kozco.com/tech/organfinale.mp3', {});
        setTimeout(() => {
            player.mute();
        }, 2000);
        setTimeout(() => {
            player.unmute();
        }, 5000);
    });
});
