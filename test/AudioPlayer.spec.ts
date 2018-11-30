import { expect } from 'chai';
import 'mocha';

import { AudioPlayer } from '../lib/AudioPlayer';


describe('audioplayer tests', () => {

    const player = new AudioPlayer();


    xit('test', () => { });

    //http://www.kozco.com/tech/organfinale.mp3
    it('play', () => {
        // const process = player.play('e:/asound.wav', {});
        const process = player.play('http://www.kozco.com/tech/organfinale.mp3', {})
    });
});