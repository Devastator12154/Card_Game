import React from 'react';
import './App.css';
import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';

new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene]
  })
);


function App() {
  return (
    <div className="App">
       <div id="game"></div>
      
    </div>
  );
}

export default App;
