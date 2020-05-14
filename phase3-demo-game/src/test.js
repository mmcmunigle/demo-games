import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'

const config = {
	a
type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		}
	},
	scene: [HelloWorldScene]
}

	console.log();

export default new Phaser.Game(config)