import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  backgroundColor: 0x4488aa,
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 1280,
      height: 780
  },
};
