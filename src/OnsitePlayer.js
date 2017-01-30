import React, { Component, PropTypes } from 'react'
import AudioWrapper from "./AudioWrapper";
import Episode from './episode'
import axios from 'axios';
import cx from 'classnames'
import SampleAudio from './assets/audio/Bloodflood.mp3'
import DefaultArt from './assets/img/logo.webp'
import PodcastArrow from './assets/img/podcast-arrow.svg'

class OnsitePlayer extends Component {
  static propTypes = {
    audioTitle: PropTypes.string,
    playerTitle: PropTypes.string,
    artUrl: PropTypes.string,
    audioUrl: PropTypes.string,
    nextAudioUrl: PropTypes.string,
    nextAudioTitle: PropTypes.string,
    prevAudioUrl: PropTypes.string,
    prevAudioTitle: PropTypes.string,
  }
  static defaultProps = {
    artUrl: DefaultArt,
    audioTitle: "Your favorite song - Your favorite album",
    playerTitle: "React Onsite Player",
  }
  state = {
    audioLoaded: false,
    isActive: true,
    isHidden: false,
    isPaused: true,Art: PropTypes.string,
    isPlaying: false,
    isMuted: false,
    isLoading: false,
    isScrubbing: false,
    loop: false,
    defaultVolume: 0.5,
    source: SampleAudio,
    trackDuration : 0,
    currentTime: 0,
    displayTime: 0,
    currentAudioTitle: "",
    detailsLoaded: false,
  }
  play = () => {
    this.setState({isPaused: true, isPlaying: true})
  }
  pause = () => {
    this.setState({isPaused: true, isPlaying: false})
  }
  handleLoadedData = (duration) => {
    this.setState({trackDuration: duration})
  }
  handlePlayPause = () => {
    this.state.isPlaying ? this.pause() : this.play()
  }
  handleTimeUpdate = (data) => {
    if(!this.state.isScrubbing){
      this.setState({
        trackDuration: data.trackDuration,
        displayTime: data.currentTime,
      })
    }
  }
  handlePlaybackEnd = () => {
    this.setState({
      isPaused: false,
      isPlaying: false,
      trackDuration : 0,
      currentTime: 0,
    })
  }
  handleProgress = (data) => {
    if (!this.state.isSeeking) {
      this.setState({currentTime: data.currentTime})
    }
  }
  handleIncrement = (interval) => {
    this.setState({currentTime: this.state.displayTime + 15})
  }
  handleDecrement = (interval) => {
    this.setState({currentTime: this.state.displayTime - 15})
  }
  handleScrubberMouseDown = event => {
    this.setState({isScrubbing: true})
  }
  handleScrubberMouseUp = (event) => {
    const newTime = event.target.value > 0 ? parseInt(event.target.value, 10) : 0
    this.setState({
      isScrubbing: false,
      currentTime: newTime,
    })
  }
  handleScrubberChange = (event) => {
    const seekedTime = event.target.value > 0 ? parseInt(event.target.value, 10) : 0
    this.setState({
      displayTime: seekedTime,
    })
  }

  close = () => {
    this.pause()
    this.setState({isActive: false})
  }
  hide() {
    this.setState({
      isHidden: true,
      isPlaying: false,
      isPaused: true,
    })
  }
  show() {
    this.setState({
      isActive:true,
      isHidden: false,
    })
  }
  togglePlayer = () => {
    console.log(this.state.isHidden)
    this.state.isHidden ? this.show() : this.hide()
  }

  loadDetails(detailsUrl) {
    this.setState({detailsLoaded: false})
    axios.get(detailsUrl)
    .then(response => {
      console.log(response)
      this.setState({episode: new Episode(response.data)})
      this.loadUI()
      this.setState({detailsLoaded: true})
      this.show()
    })
    .catch(error => console.log(error))
  }

  seekBy() {

  }

  render () {
    const playerClasses = cx(
      'podcast-player',
      'js-player',
      {'podcast-player--is-active': this.state.isActive},
      {'podcast-player--is-hidden': this.state.isHidden},
    )
    return (
      <div>
        <AudioWrapper
          ref={ node => this.audio = node}
          source={this.state.source}
          isPlaying={this.state.isPlaying}
          isMuted={this.state.isMuted}
          isLoading={this.state.isLoading}
          isScrubbing={this.state.isScrubbing}
          loop={this.state.loop}
          currentTime={this.state.currentTime}
          defaultVolume={this.state.defaultVolume}
          onProgress={this.handleProgress}
          onTimeUpdate={this.handleTimeUpdate}
          onEnd={this.handlePlaybackEnd}
          onLoadedData={this.handleLoadedData}
          onSeeking={this.handleSeeking}
          onSeeked={this.handleSeeked}
        />
        <div className="player-container">
          <div id="player">
           <figure className={playerClasses}>
              <PlayerNav
                togglePlayer={this.togglePlayer}
                close={this.close}
              />
              <PlayerArt source={this.props.artUrl} />
              <PlayerDetails
                title={this.props.playerTitle}
                audioTitle={this.props.audioTitle} />
              <PlayerButtons
                isPaused={this.state.isPaused}
                isPlaying={this.state.isPlaying}
                isLoading={this.state.isLoading}
                onPlayPause={this.handlePlayPause}
                onIncrement={this.handleIncrement}
                onDecrement={this.handleDecrement}
              />
              <PlayerSlider
                trackDuration={this.state.trackDuration}
                currentTime={this.state.displayTime}
                title={this.props.playerTitle}
                audioTitle={this.props.audioTitle}
                onScrubberChange={this.handleScrubberChange}
                onMouseDown={this.handleScrubberMouseDown}
                onMouseUp={this.handleScrubberMouseUp}
              />
            </figure>
          </div>
        </div>
      </div>
    )
  }
}

const PlayerNav = ({togglePlayer, close}) => {
  return(
    <nav className="podcast-player_nav">
      <button
        className="podcast-player_nav_button podcast-player_nav_button--hide js-player-hide"
        title="Toggle Player"
        onClick={togglePlayer}>
        </button>
      <button
        className="podcast-player_nav_button podcast-player_nav_button--close js-player-close"
        title="Close Player"
        onClick={close}>
      </button>
    </nav>
  )
}
PlayerNav.propTypes = {
  togglePlayer: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
}

const PlayerDetails = ({playerTitle, audioTitle}) => {
  return (
    <div className="podcast-player_details">
      <div className="podcast-player_details_title">
        <span className="js-player-now-playing">
          {playerTitle}
        </span>
        <figcaption className="js-player-title">
          {audioTitle}
        </figcaption>
      </div>
    </div>
  )
}
PlayerDetails.propTypes = {
  playerTitle: PropTypes.string,
  audioTitle: PropTypes.string,
}

const PlayerButtons = ({
  isPaused,
  isPlaying,
  isLoading,
  onPlayPause,
  onIncrement,
  onDecrement,
}) => {
  const playButtonClasses = cx(
    'podcast-player-button',
    'podcast-player-button--play',
    'js-player-play-button',
    {'is-paused': isPaused},
    {'is-playing': isPlaying},
    {'is-loading': isLoading},
  )
  return (
    <div className="podcast-player_buttons">
      <button
        className="podcast-player-button podcast-player-button--episode js-player-prev-button"
        title="Listen to the previous episode">
        <span
          className="js-player-prev-number">
        </span>
        <img src={PodcastArrow} alt="Previous episode"/>
      </button>
      <button
        className="podcast-player-button podcast-player-button--back15 js-player-back-button"
        title="Seek back 15 seconds"
        onClick={onDecrement.bind(15)}>
      </button>

      <button
        className={playButtonClasses}
        onClick={onPlayPause.bind(15)}>
      </button>

      <button
        className="podcast-player-button podcast-player-button--forward15 js-player-forward-button"
        title="Seek forward 15 seconds"
        onClick={onIncrement}>
      </button>
      <button className="podcast-player-button podcast-player-button--episode js-player-next-button" title="Listen to the next episode">
        <img
          className="flip-horizontal"
          src={PodcastArrow}
          alt="Next episode"
        />
          <span className="js-player-next-number"></span>
      </button>
    </div>
  )
}

PlayerButtons.propTypes = {
  isPaused: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onPlayPause: PropTypes.func.isRequired,
}

const PlayerArt = ({source}) => (
  <img
    className="podcast-player_art js-player-art"
    role="presentation"
    src={source} />
)

PlayerArt.propTypes = {
  source: PropTypes.string.isRequired,
}

const PlayerSlider = ({
  trackDuration,
  currentTime,
  title,
  audioTitle,
  onScrubberChange,
  onMouseDown,
  onMouseUp,
}) => {

  const roundedCurrentTime = Math.round(currentTime || 0)
  const percentComplete = roundedCurrentTime / trackDuration * 100
  const formattedCurrentTime = Episode.formatTime(currentTime | 0)
  const formattedDuration = Episode.formatTime(trackDuration| 0)
  return (
    <form className="podcast-player_slider">
      <div className="range-slider">
        <span className="range-slider_above">
          <span className="js-player-now-playing">{title}</span>
        </span>
        <div className="range-slider_range_wrap">
          <input
            className="range-slider_range js-player-scrubber"
            type="range"
            value={roundedCurrentTime}
            onChange={onScrubberChange}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            min="0"
            max={trackDuration}/>
          <div
            className="range-slider_range_track js-player-track"
            style={{width: `${percentComplete}%`}}
          >
          </div>
        </div>
        <span className="range-slider_below">
          <span className="js-player-title">{audioTitle}</span>
          <output>
            <b className="js-player-current">{formattedCurrentTime}</b> /
            <span className="js-player-duration"> {formattedDuration}</span>
          </output>
        </span>
      </div>
    </form>
  )
}
PlayerSlider.propTypes = {
  trackDuration: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  onScrubberChange: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
}

export default OnsitePlayer