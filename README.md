[![Build Status](https://travis-ci.org/rgsmolin/play-sound-mplayer.svg?branch=master)](https://travis-ci.org/rgsmolin/play-sound-mplayer)
[![NPM](https://img.shields.io/npm/v/play-sound-mplayer.svg)](https://www.npmjs.com/package/play-sound-mplayer)
[![Coverage Status](https://coveralls.io/repos/github/rgsmolin/play-sound-mplayer/badge.svg?branch=develop)](https://coveralls.io/github/rgsmolin/play-sound-mplayer?branch=develop)

# play-sound-mplayer
Play sounds by shelling out with MPlayer audio player. Make it easy to play audio in Node.js.

## This is still a work in progress and not yet a final concept

## Installation
```
npm install play-sound-mplayer
```
Since we use  mplayer over the command-line to facilitate audio playback, you will also need to install a mplayer instance.

## Usage
### Getting Started
To get started, require the module in your program and create a new AudioPlayer instance. 

```javascript
const AudioPlayer = require('play-sound-mplayer');
const player = new AudioPlayer();
```

### Play
To play an audio source, use the `play` function and pass in the file path  or url of the audio source that is to be played:

```javascript
player.on('start', () => {
  // Do something here when the audio starts playing
});

player.on('end', () => {
  // Do something here when the audio finishes playing
});

player.on('error', (error: Error) => {
  // Do something here when an error thrown
});

player.play('./test/sound.mp3');
```

### Stop
Stop the playback (without the ability to resume later) by using the `stop` function:

```javascript
player.on('stop', () => {
  // Do something here when the audio is stopped
});

player.stop();
```

### Pause
Pause the playback (with the ability to resume later) by using the `pause` function:

```javascript
player.on('pause', () => {
  // Do something here when the audio is paused
});

player.pause();
```

### Resume
Resume the playback from a paused state by using the `resume` function:

```javascript
player.on('resume', () => {
  // Do something here when the audio is resumed
});

player.resume();
```

### Mute
Mute the playback (with the ability to unmute later) by using the `mute` function:

```javascript
player.on('muted', () => {
  // Do something here when the audio is muted.
});

player.mute();
```

### Unmute
Unmute the playback from a muted state by using the `unMute` function:

```javascript
player.on('unmuted', () => {
  // Do something here when the audio is unmuted
});

player.unMute();
```

### Set Playback Volume
Set the volume of the playback by using the `setVolume(0..100)` function:

```javascript
player.on('volumeupdate', (volume: number) => {
  // Do something here when the audio volume updated with volume: number 0..100
});

player.setVolume(30);
```
