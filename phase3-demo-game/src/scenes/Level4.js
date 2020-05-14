import Phaser from 'phaser'

import BaseScene from './BaseScene'
import BombSpawner from'../helpers/BombSpawner'

const GROUND_KEY = 'ground'
const PLATFORM_KEY = 'platform_64'
const SMALL_PLATFORM_KEY = 'platform_32'
const DUDE_KEY = 'dude'
const STAR_KEY = 'star'
const BOMB_KEY = 'bomb'
const HEART_KEY = 'heart'
const LAVA_KEY = 'lava'

export default class GameScene extends BaseScene {
    constructor() {
        super({ key: 'level-4' });

        this.player = undefined;
		this.cursors = undefined;
		this.stars = undefined;

		this.bombSpawner = undefined;
		this.bombCollider = undefined;

		this.clickButton = undefined;
		this.gameOver = false;

		this.lives = 2;
    }

    preload() {
		this.load.image('sky', 'assets/sky.png');
		this.load.image(LAVA_KEY, 'assets/lava.png');
		this.load.image(PLATFORM_KEY, 'assets/platform_64.png');
		this.load.image(SMALL_PLATFORM_KEY, 'assets/platform_32.png');
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
		const lava = this.createLavaPlatforms();
		this.stars = this.createStars();
		this.player = this.createPlayer(18, 450);
		const heart = this.physics.add.staticImage(400, 400, HEART_KEY);

		this.createBasics();

		this.bombSpawner = new BombSpawner(this, BOMB_KEY);
		const bombsGroup = this.bombSpawner.group;

        this.physics.add.collider(this.player, platforms);
		this.physics.add.collider(this.stars, platforms);
		this.physics.add.collider(bombsGroup, platforms);
		this.physics.add.collider(this.player, lava, this.hitLava, null, this);


		this.bombCollider = this.physics.add.overlap(this.player, bombsGroup, this.hitBomb, null, this);
		this.physics.add.collider(this.shield, bombsGroup);

		this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
		this.physics.add.overlap(this.player, heart, this.collectHeart, null, this);

		this.lives = this.registry.get('lives');
	}

	hitLava(player, lava) {
		this.registry.set('lives', --this.lives);

		if (this.lives <= 0) {
			this.physics.pause();

			player.setTint(0xff0000);

			player.anims.play('turn');

			this.gameOver = true;
			this.clickButton.visible = true;
		}
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
            repeat: 6,
            setXY: { x: 100, y: 0, stepX: 100 }
        });

        stars.children.iterate((child) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        });
        
        return stars;
    }

	createLavaPlatforms() {
		const lava = this.physics.add.staticGroup()

		const startX = 784;
		for (let i = 0; i < 23; i++) {
			lava.create(startX - (32 * i), 553, LAVA_KEY);
			lava.create(startX - (32 * i), 584, LAVA_KEY);
		}

		return lava;
	}

    createPlatforms() {
		const platforms = this.physics.add.staticGroup()
		
        platforms.create(400, 570, GROUND_KEY).setScale(2).refreshBody();

		platforms.create(100, 400, PLATFORM_KEY);
		platforms.create(200, 300, PLATFORM_KEY);
		platforms.create(300, 200, PLATFORM_KEY);
		platforms.create(400, 100, PLATFORM_KEY);
		platforms.create(500, 200, PLATFORM_KEY);
		platforms.create(600, 300, PLATFORM_KEY);
		platforms.create(700, 400, PLATFORM_KEY);

		platforms.create(400, 475, SMALL_PLATFORM_KEY);
        
        return platforms;
    }
}