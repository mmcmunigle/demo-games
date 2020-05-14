import Phaser from 'phaser'

import BaseScene from './BaseScene'
import BombSpawner from'../helpers/BombSpawner'

const GROUND_KEY = 'ground'
const PLATFORM_KEY = 'small_platform'
const DUDE_KEY = 'dude'
const STAR_KEY = 'star'
const BOMB_KEY = 'bomb'
const HEART_KEY = 'heart'

export default class GameScene extends BaseScene {
    constructor() {
        super({ key: 'level-3' });

        this.player = undefined;
		this.cursors = undefined;
		this.stars = undefined;

		this.bombSpawner = undefined;
		this.bombCollider = undefined;

		this.clickButton = undefined;
		this.gameOver = false;

		this.lives = undefined;
    }

    preload() {
		this.load.image('sky', 'assets/sky.png');
		this.load.image(PLATFORM_KEY, 'assets/tiny_platform.png');
		this.load.image(GROUND_KEY, 'assets/platform.png');
		this.load.image(STAR_KEY, 'assets/star.png');
		this.load.image(BOMB_KEY, 'assets/bomb.png');
		this.load.image(HEART_KEY, 'assets/heart.png');
        
        this.load.spritesheet(DUDE_KEY, 
			'assets/dude.png',
			{ frameWidth: 32, frameHeight: 48 }
		)
    }

    create() {
        this.add.image(400, 300, 'sky');
        
        const platforms = this.createPlatforms();
		this.stars = this.createStars();
		this.player = this.createPlayer();
		const heart = this.physics.add.staticImage(300, 100, HEART_KEY);

		this.createBasics();

		this.bombSpawner = new BombSpawner(this, BOMB_KEY);
		const bombsGroup = this.bombSpawner.group;

        this.physics.add.collider(this.player, platforms);
		this.physics.add.collider(this.stars, platforms);
		this.physics.add.collider(bombsGroup, platforms);
		this.bombCollider = this.physics.add.overlap(this.player, bombsGroup, this.hitBomb, null, this);
		this.physics.add.collider(this.shield, bombsGroup);

		this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
		this.physics.add.overlap(this.player, heart, this.collectHeart, null, this);

		this.lives = this.registry.get('lives');
	}

    collectStar(player, star)
	{
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
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate((child) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        });
        
        return stars;
    }

    createPlatforms() {
        const platforms = this.physics.add.staticGroup()

        platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();

		platforms.create(20, 150, PLATFORM_KEY);
		platforms.create(300, 300, PLATFORM_KEY);
		platforms.create(400, 450, PLATFORM_KEY);
		platforms.create(520, 100, PLATFORM_KEY);
		platforms.create(700, 280, PLATFORM_KEY);
        
        return platforms;
    }
}