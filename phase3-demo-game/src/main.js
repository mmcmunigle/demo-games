import Phaser from 'phaser';

import Level1 from './scenes/Level1';
import Level2 from './scenes/Level2';
import Level3 from './scenes/Level3';
import Level4 from './scenes/Level4';
import GameState from './scenes/GameState';
import StoreScene from './scenes/StoreScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
        },
    },
    scene: [Level1, Level2, Level3, Level4, StoreScene, GameState]
};

export default new Phaser.Game(config);
