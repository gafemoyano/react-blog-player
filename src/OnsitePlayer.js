import React, { Component } from 'react'
import ChangelogAudio from "./Audio";
import Episode from './episode'
import axios from 'axios';


class OnsitePlayer extends Component {
  state = {
    audio: new ChangelogAudio (),
    episode: {},
    detailsLoaded: false,
    audioLoaded: false,
  }
  componentDidMount() {

  }
  canPlay() {
    console.log('canPlay')
  }
  isActive() {
    console.log('isActive')
  }
  isPlaying() {
    console.log('isPlaying-')
  }
  play() {
    console.log('play')
  }
  pause() {
    console.log('pause')
    this.audio.pause();
    this.playButton.addClass("is-paused").removeClass("is-playing is-loading");
  }
  togglePlayPause() {
    console.log('togglePlayPause')
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }
  close() {
    console.log('close')
  }
  hide() {
    console.log('close')
  }
  loadAudio(audioUrl) {
    this.setState({audioLoaded: false})
    this.audio.load(audioUrl, () => {
      this.setState({audioLoaded: true})
      this.play()
    })
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

    // if (this.episode.hasPrev()) {
    //   this.prevNumber.text(this.episode.prevNumber())
    //   this.prevButton.attr("title", "Listen to " + this.episode.prevTitle())
    //   this.prevButton.attr("href", this.episode.prevAudio())
    //   this.prevButton.data("play", this.episode.prevLocation())
    // } else {
    //   this.resetPrevUI()
    // }

    // if (this.episode.hasNext()) {
    //   this.nextNumber.text(this.episode.nextNumber())
    //   this.nextButton.attr("title", "Listen to " + this.episode.nextTitle())
    //   this.nextButton.attr("href", this.episode.nextAudio())
    //   this.nextButton.data("play", this.episode.nextLocation())
    // } else {
    //   this.resetNextUI()
    // }
  }
  resetUI() {
    this.nowPlaying.text("Loading...");
    this.title.text("");
    this.current.text("0:00");
    this.duration.text("0:00");
    this.resetPrevUI();
    this.resetNextUI();
    this.scrubber.first().value = 0;
    this.track.first().style.width = "0%";
  }

  resetPrevUI() {
    this.prevNumber.text("");
    this.prevButton.first().removeAttribute("href");
    this.prevButton.first().removeAttribute("data-play");
  }

  resetNextUI() {
    this.nextNumber.text("");
    this.nextButton.first().removeAttribute("href");
    this.nextButton.first().removeAttribute("data-play");
  }
  scrub(value) {

  }
  scrubEnd(value) {

  }
  seekBy() {

  }

  render () {
    return (
<div className="player-container" ref={(node) =>  {this.container = node}}>
  <div id="player" ref={(node) =>  {this.player = node}}>
    <figure className="podcast-player js-player">
      <nav className="podcast-player_nav">
        <button
          className="podcast-player_nav_button podcast-player_nav_button--hide js-player-hide"
          title="Hide Player"
          ref={(node) =>  {this.hideButton = node}}>
          </button>
        <button
          className="podcast-player_nav_button podcast-player_nav_button--close js-player-close"
          title="Close Player"
          ref={(node) =>  {this.closeButton = node}}>
        </button>
      </nav>
      <img
        className="podcast-player_art js-player-art"
        role="presentation"
        ref={(node) =>  {this.art = node}}
      />
      <div className="podcast-player_details">
        <div className="podcast-player_details_title">
          <span
            className="js-player-now-playing"
            ref={(node) =>  {this.nowPlaying = node}}>
          </span>
          <figcaption
            className="js-player-title"
            ref={(node) =>  {this.title = node}}>
          </figcaption>
        </div>
      </div>
      <div className="podcast-player_buttons">
        <button
          className="podcast-player-button podcast-player-button--episode js-player-prev-button"
          title="Listen to the previous episode"
          ref={(node) =>  {this.prevButton = node}}>
          <span
            className="js-player-prev-number"
            ref={(node) =>  {this.prevNumber = node}}>
          </span>
          <img src="" alt="Previous episode"/>
        </button>
        <button
          className="podcast-player-button podcast-player-button--back15 js-player-back-button"
          title="Seek back 15 seconds"
          ref={(node) =>  {this.backButton = node}}>
        </button>

        <button
          className="podcast-player-button podcast-player-button--play js-player-play-button"
          ref={(node) =>  {this.playButton = node}}>
        </button>

        <button
          className="podcast-player-button podcast-player-button--forward15 js-player-forward-button"
          title="Seek forward 15 seconds"
          ref={(node) =>  {this.forwardButton = node}}>
        </button>
        <button className="podcast-player-button podcast-player-button--episode js-player-next-button" title="Listen to the next episode">
          <img
            className="flip-horizontal"
            src=""
            alt="Next episode"
          />
            <span
              className="js-player-next-number"
              ref={(node) =>  {this.nextNumber = node}}
              >
            </span>
        </button>
      </div>
      <form className="podcast-player_slider">
        <div className="range-slider">
          <span className="range-slider_above"><span className="js-player-now-playing"></span></span>
          <div className="range-slider_range_wrap">
            <input
              className="range-slider_range js-player-scrubber"
              type="range"
              value="0"
              min="0"
              max="500"
              ref={(node) =>  {this.scrubber = node}}
            />
            <div
              className="range-slider_range_track js-player-track"
              ref={(node) =>  {this.track = node}}
            >
            </div>
          </div>
          <span className="range-slider_below"> <span className="js-player-title"></span>
            <output>
              <b className="js-player-current">0:00</b> / <span className="js-player-duration" ref={(node) =>  {this.duration = node}}>0:00</span>
            </output>
          </span>
        </div>
      </form>
    </figure>
  </div>
</div>
    )
  }
}

export default OnsitePlayer