import React, { Component, PropTypes } from 'react'
import AudioWrapper from "./AudioWrapper";
import Episode from './episode'
import axios from 'axios';
import cx from 'classnames'
import SampleAudio from './assets/audio/Bloodflood.mp3'
import SampleArt from './assets/audio/an-awesome-wave.jpg'
import DefaultArt from './assets/img/podcast-cover-art.svg'
import PodcastArrow from './assets/img/podcast-arrow.svg'

class OnsitePlayer extends Component {
  state = {
    audioLoaded: false,
    isActive: true,
    isHidden: false,
    isPaused: true,
    isPlaying: true,
    isMuted: false,
    isLoading: false,
    loop: false,
    defaultTime: 0,
    defaultVolume: 0.5,
    source: SampleAudio,
    episode: new Episode({
      prev: null,
      next:null,
      art_url: SampleArt,
      audio_url: SampleAudio,
      podcast: 'Week 1',
      duration: 3600,
      title: 'An awesome wave',
      blogTitle: 'Episode 44: Whatever',
    }),
    detailsLoaded: false,
  }
  componentDidMount() {

  }
  play = () => {
    this.setState({isPaused: true, isPlaying: true})
  }
  pause = () => {
    this.setState({isPaused: true, isPlaying: false})
  }
  handleLoadedData = (duration) => {
    console.log(duration)
    const episode = this.state.episode
    episode.duration =duration
    this.setState({episode: episode})
  }
  handlePlayPause = () => {
    this.state.isPlaying ? this.pause() : this.play()
  }
  handleTimeUpdate = (data) => {
  }
  handleProgress = (event) => {
    console.log(event )
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

  loadEpisode(event) {
    event.preventDefault()
    if(this.canPlay()) {

    }
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
  loadUI() {
    this.art.attr("src", process.env.PUBLIC_URL + '/an-awesome-wave.jpg')
    this.nowPlaying.text(this.episode.nowPlaying())
    this.title.text(this.episode.title())
    this.duration.text(Episode.formatTime(this.episode.duration()))
    this.scrubber.attr("max", this.episode.duration())
  }

  scrub(to) {
    this.setState({
      isScrubbing: true,
      percentComplete: to / this.episode.duration() * 100
    })
  }
  scrubEnd(to) {
    this.setState({
      isScrubbing: false,
    })
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
          source={this.state.source}
          isPlaying={this.state.isPlaying}
          isMuted={this.state.isMuted}
          isLoading={this.state.isLoading}
          loop={this.state.loop}
          defaultTime={this.state.defaultTime}
          defaultVolume={this.state.defaultVolume}
          onProgress={this.handleProgress}
          onTimeUpdate={this.handleTimeUpdate}
          onEnd={this.handleScrubberChange}
          onLoadedData={this.handleLoadedData}
        />
        <div className="player-container" ref={(node) =>  {this.container = node}}>
          <div id="player" ref={(node) => this.player = node}>
            <figure className={playerClasses}>
              <PlayerNav
                togglePlayer={this.togglePlayer}
                close={this.close}
              />
              <PlayerArt source={this.state.episode.art()} />
              <PlayerDetails
                title={this.state.episode.title()}
                blogTitle={this.state.episode.blogTitle} />
              <PlayerButtons
                isPaused={this.state.isPaused}
                isPlaying={this.state.isPlaying}
                isLoading={this.state.isLoading}
                onPlayPause={this.handlePlayPause}
              />
              <PlayerSlider
                episode={this.state.episode}
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

const PlayerDetails = ({title, blogTitle}) => {
  return (
    <div className="podcast-player_details">
      <div className="podcast-player_details_title">
        <span className="js-player-now-playing">
          {blogTitle}
        </span>
        <figcaption className="js-player-title">
          {title}
        </figcaption>
      </div>
    </div>
  )
}
PlayerDetails.propTypes = {
  title: PropTypes.string,
  blogTitle: PropTypes.string,
}

const PlayerButtons = ({isPaused, isPlaying, isLoading, onPlayPause}) => {
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
        title="Seek back 15 seconds">
      </button>

      <button
        className={playButtonClasses}
        onClick={onPlayPause}>
      </button>

      <button
        className="podcast-player-button podcast-player-button--forward15 js-player-forward-button"
        title="Seek forward 15 seconds">
      </button>
      <button className="podcast-player-button podcast-player-button--episode js-player-next-button" title="Listen to the next episode">
        <img
          className="flip-horizontal"
          src={PodcastArrow}
          alt="Next episode"
        />
          <span
            className="js-player-next-number"
            ref={(node) =>  {this.nextNumber = node}}
            >
          </span>
      </button>
    </div>
  )
}

PlayerButtons.propTypes = {
  title: PropTypes.string,
  blogTitle: PropTypes.string,
}

const PlayerArt = ({source}) => (
  <img
    className="podcast-player_art js-player-art"
    role="presentation"
    src={source || DefaultArt}
  />
)

PlayerArt.propTypes = {
  source: PropTypes.string,
}

const PlayerSlider = ({currentSeek, episode, handleScrubberInput, handleScrubberChange}) => {
  const seek = Math.round(currentSeek || 0)
  const percentComplete = seek / episode.duration() * 100
  const current = Episode.formatTime(currentSeek)
  return (
    <form className="podcast-player_slider">
      <div className="range-slider">
        <span className="range-slider_above">
          <span className="js-player-now-playing"></span>
        </span>
        <div className="range-slider_range_wrap">
          <input
            className="range-slider_range js-player-scrubber"
            type="range"
            value={seek}
            onInput={() => handleScrubberInput}
            onChange={() => handleScrubberChange}
            min="0"
            max="500"
            ref={(node) =>  {this.scrubber = node}}
          />
          <div
            className="range-slider_range_track js-player-track"
            style={{width: `${percentComplete}%`}}
          >
          </div>
        </div>
        <span className="range-slider_below"> <span className="js-player-title"></span>
          <output>
            <b className="js-player-current">{current}</b> / <span className="js-player-duration">{Episode.formatTime(episode.duration())}</span>
          </output>
        </span>
      </div>
    </form>
  )
}
PlayerSlider.propTypes = {
  currentSeek: PropTypes.number.isRequired,
  handleScrubberInput: PropTypes.func.isRequired,
  handleScrubberChange: PropTypes.func.isRequired,
}

export default OnsitePlayer