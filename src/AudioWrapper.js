import React, {Component, PropTypes} from 'react'


export default class AudioWrapper extends Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    isMuted: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    loop: PropTypes.bool.isRequired,
    defaultTime: PropTypes.number.isRequired,
    defaultVolume: PropTypes.number.isRequired,
    onProgress: React.PropTypes.func.isRequired,
    onTimeUpdate: React.PropTypes.func.isRequired,
    onLoadedData: React.PropTypes.func.isRequired,
    onEnd: React.PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.audio.addEventListener('progress', this.handleProgress)
    this.audio.addEventListener('timeupdate', this.handleTimeUpdate)
    this.audio.addEventListener('ended', this.handleMediaEnd)
    this.audio.addEventListener('loadeddata', this.handleLoadedData)

    this.updateIsPlaying()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.source !== this.props.source) {
      this.updateSource()
    }
    if (prevProps.isPlaying !== this.props.isPlaying) {
      this.updateIsPlaying()
    }
    if (prevProps.defaultTime !== this.props.defaultTime) {
      this.updateCurrentTime()
    }
    if (prevProps.defaultVolume !== this.props.defaultVolume) {
      this.updateVolume()
    }
  }

  componentWillUnmount() {
    this.audio.removeEventListener('progress', this.handleProgress)
    this.audio.removeEventListener('timeupdate', this.handleTimeUpdate)
    this.audio.removeEventListener('ended', this.handleMediaEnd)
  }

  handleTimeUpdate = () => {
    this.props.onTimeUpdate({
      currentTime: this.audio.currentTime,
      trackDuration: this.audio.duration
    })
  }

  handleMediaEnd= () => {
    this.audio.currentTime = 0
    this.props.onEnd()
  }
  handleLoadedData = () => {
      console.log('loaded')
      this.props.onLoadedData(this.audio.duration)

  }
  handleProgress= () => {
    this.props.onProgress({
      trackDuration: this.audio.trackDuration,
      buffered: this.audio.buffered,
    })
  }
  updateCurrentTime() {
    if (this.audio.readyState) {
      this.audio.currentTime = this.props.defaultTime;
    }
  }

  updateIsPlaying() {
    if (this.props.isPlaying) {
      this.audio.play()
    } else {
      this.audio.pause()
    }
  }

  updateSource() {
    const isPlaying = this.props.isPlaying
    const audio = this.audio

    audio.pause()
    this.props.onTimeUpdate({
      currentTime: 0,
      trackDuration: audio.duration
    })

    audio.load(this.props.source, this.props.onAudioLoaded(audio.duration))
    if (isPlaying) {
      audio.play()
    }
  }
  loadAudio(audioUrl) {
    this.audioLoaded = false;
    this.audio.load(audioUrl, () => {
      this.audioLoaded = true;
      this.play();
    });
  }
  updateVolume() {
    const volume = this.props.defaultVolume
    if (volume < 0){
      return false
    }
    if (volume > 1) {
      this.audio.volume = volume / 100
    }
    else {
      this.audio.volume = volume
    }
  }

  updateLoop() {
    this.audio.loop = this.props.loop
  }

  updateIsMuted() {
    this.audio.muted = this.props.isMuted
  }
  render() {
    return(
      <audio
        ref={(node) => this.audio = node}
        preload='auto'
        type='audio/mpeg'
        src={this.props.source}
      />
    )
  }
}
