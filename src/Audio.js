import React, {Component, PropTypes} from 'react'


export default class ChangelogAudio extends Component {
  propTypes = {
    audioUrl: PropTypes.string,
    defaultTime: PropTypes.number,
  }
  componentDidUpdate(prevProps){
    if (prevProps.defaultTime !== this.props.defaultTime) {
      this.updateCurrentTime();
    }
  }
  onTimeUpdate(callback) {
    this.run("timeupdate", callback);
  }

  onEnd(callback) {
    this.run("ended", callback);
  }

  canPlay() {
    return this.hasAudio;
  }

  play() {
    this.audio.play();
  }

  pause() {
    if (!this.playing()) return;
    this.audio.pause();
  }

  playing() {
    return this.audio.duration > 0 && !this.audio.paused;
  }

  willLoop() {
    return this.audio.loop;
  }

  loop(bool) {
    this.audio.loop = bool;
  }

  volume() {
    return this.audio.volume;
  }

  setVolume(value) {
    if (value < 0) return false;

    if (value > 1) {
      this.audio.volume = value / 100;
    } else {
      this.audio.volume = value;
    }
  }

  isMuted() {
    return this.audio.muted;
  }

  mute() {
    this.audio.muted = true;
  }

  unmute() {
    this.audio.muted = false;
  }

  currentSeek() {
    return this.audio.currentTime;
  }

  seek(to, before, after) {
    to = parseInt(to, 10);
    if (to < 0) to = 0;

    if (before) {
      this.runOnce("seeking", before);
    }

    if (after) {
      this.runOnce("seeked", after);
    }

    this.audio.currentTime = to;
  }

changeSpeed() {
  if (this.audio.playbackRate === 2) {
    this.audio.playbackRate = 1;
    return;
  }

  this.audio.playbackRate += 0.5;
}

  run(eventName, fn) {
    this.audio.addEventListener(eventName, fn);
  }

  runOnce(eventName, fn) {
    let listener = () => {
      fn.call();
      this.audio.removeEventListener(eventName, listener);
    }

    this.audio.addEventListener(eventName, listener);
  }
  updateCurrentTime() {
    if (this.audio.readyState) {
      this.audio.currentTime = this.props.defaultTime
    }
  }
  render() {
    return(
      <audio
        ref={(node) => this.audio = node}
        preload='auto'
        type='audio/mpeg'
        src={this.props.file}
      />
    )
  }
}
