// @flow

import React, { Component } from 'react';
import OnsitePlayer from './OnsitePlayer'
import './App.css';

class App extends Component {
  state = {
    canPlay: false,
    isPlaying: false,

  }
  handlePlay(event) {
   if(this.state.canPlay) {
    event.preventDefault()
    console.log("handling play")
   }
  }
  render() {
    return (
      <OnsitePlayer
        canPlay={this.state.canPlay}
        handlePlay={this.handlePlay}
      />
    );
  }
}

export default App;
