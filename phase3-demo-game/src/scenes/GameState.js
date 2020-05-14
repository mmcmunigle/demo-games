import Phaser from 'phaser'

export default class GameState extends Phaser.Scene {
    constructor() {
        super({ key: 'game-state', active: true });

        this.scoreText = undefined;
        this.starsText = undefined;
        this.livesText = undefined;
        this.shieldsText = undefined;

        this.stars = 0;
        this.score = 0;
        this.lives = 2;
        this.level = 1;
        this.shields = 0;
    }

    preload() {
        this.load.image('star-count', 'assets/star.png');
        this.load.image('heart-count', 'assets/heart.png');
        this.load.image('shield-count', 'assets/shield.png')
    }
    
    create() {
        const scoreStyle = { fontSize: '24px', fill: '#000' };
        const statsStyle = { fontSize: '20px', fill: '#000' };
        this.scoreText = this.add.text(20, 10, 'Score: 0', scoreStyle);

        this.physics.add.staticImage(30, 50, 'star-count').setScale(0.8).refreshBody();
        this.starsText = this.add.text(45, 40, 'x0', statsStyle);

        this.physics.add.staticImage(110, 50, 'heart-count').setScale(0.7).refreshBody();
        this.livesText = this.add.text(125, 40, 'x2', statsStyle);

        this.physics.add.staticImage(30, 75, 'shield-count').setScale(0.5).refreshBody();
        this.shieldsText = this.add.text(45, 65, 'x0', statsStyle);

        // Handle registry updates and other events
        this.registry.events.on('changedata', this.updateData, this);

        this.events.on('addStar', ((num = 1) => {
            this.addStar();
        }), this);

        this.events.on('levelComplete', (() => {
            this.levelComplete();
        }), this);

        this.events.on('restartLevel', (() => {
            this.restartLevel();
        }), this);

        // Set Defaults
        this.registry.set('lives', this.lives);
        this.registry.set('stars', this.stars);
        this.registry.set('shields', this.shields);
        this.registry.set('score', this.score);
    }

    updateData(parent, key, data) {
        if (key === 'lives') {
            this.livesText.setText('x' + data);
            this.lives = data;
        } else if (key == 'stars') {
            this.starsText.setText('x' + data);
            this.stars = data;
        } else if (key == 'shields') {
            this.shieldsText.setText('x' + data);
            this.shields = data;
        }
    }

    addStar() {
        this.score += 10;
        this.stars += 2;

        this.registry.set('score', this.score);
        this.registry.set('stars', this.stars);

        this.scoreText.setText('Score: ' + this.score);
        this.starsText.setText('x' + this.stars);
    }

    restartLevel() {
        this.stars = 0;
        this.registry.set('stars', this.stars);
        this.starsText.setText('x' + this.stars);

        this.lives = 1;
        this.registry.set('lives', this.lives);
        this.livesText.setText('x' + this.lives);

    }

    levelComplete() {
        this.level += 1;
        this.registry.set('level', this.level);
    }
}