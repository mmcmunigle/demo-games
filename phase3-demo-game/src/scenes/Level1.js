import Phaser from 'phaser'

import BaseScene from './BaseScene'
import BombSpawner from'../helpers/BombSpawner'

const GROUND_KEY = 'ground'
const DUDE_KEY = 'dude'
const STAR_KEY = 'star'
const BOMB_KEY = 'bomb'
const BULLET_KEY = 'bullet'

export default class GameScene extends BaseScene {
    constructor() {
        super({ key: 'level-1' });

        this.player = undefined;
		this.cursors = undefined;
		this.stars = undefined;
		this.shield = undefined;
		this.platforms = undefined;

		this.bombSpawner = undefined;
		this.bombCollider = undefined;

		this.lives = 2;
		this.gameOver = false;
		this.activeShield = false;
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
		this.load.image(GROUND_KEY, 'assets/platform.png');
		this.load.image(STAR_KEY, 'assets/star.png');
		this.load.image(BOMB_KEY, 'assets/bomb.png');
		this.load.image('shield', 'assets/shield.png');
		this.load.image(BULLET_KEY, 'assets/bullet.png');
        
        this.load.spritesheet(DUDE_KEY, 
			'assets/dude.png',
			{ frameWidth: 32, frameHeight: 42 }
		)
    }

    create() {
        this.add.image(400, 300, 'sky');
		
        this.platforms = this.createPlatforms();
		this.stars = this.createStars();
		this.player = this.createPlayer();
		this.bullets = this.createBullets();

		this.createBasics();

		this.bombSpawner = new BombSpawner(this, BOMB_KEY);
		const bombsGroup = this.bombSpawner.group;

        this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.stars, this.platforms);
		this.physics.add.collider(bombsGroup, this.platforms);

		this.bombCollider = this.physics.add.overlap(this.player, bombsGroup, this.hitBomb, null, this);
		this.physics.add.collider(this.shield, bombsGroup);

		this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
		this.physics.add.overlap(this.shield, this.stars, this.collectStar, null, this);

	}

	

    collectStar(player, star) {
		star.disableBody(true, true)
		this.addStar();

		if (this.stars.countActive(true) === 0) {
			this.levelComplete();
		}

		this.bombSpawner.spawn(player.x);
	}
    
    createStars() {
        const stars = this.physics.add.group({
            key: STAR_KEY,
            repeat: 8,
			setXY: { x: 24, y: 0, stepX: 94 }
        });

        stars.children.iterate((child) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        });
        
        return stars;
    }

    createPlatforms() {
        const platforms = this.physics.add.staticGroup()

		platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();

        platforms.create(620, 400, GROUND_KEY);
		platforms.create(50, 250, GROUND_KEY);
		platforms.create(750, 220, GROUND_KEY);
        
        return platforms;
    }
}