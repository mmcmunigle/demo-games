import Phaser from 'phaser'

const DUDE_KEY = 'dude';
const BULLET_KEY = 'bullet'
const FIRE_RATE = 1000;

export default class GameScene extends Phaser.Scene {
    constructor(config) {
		super(config);

		this.cursors = undefined;
		this.player = undefined;
		this.activeShield = undefined;
		this.shield = undefined;
		this.gameOver = false;
		this.bullets = undefined;
	}
	
	createBasics() {
		this.shield = this.physics.add.staticImage(0, 0, 'shield').setScale(1.75);
		this.shield.disableBody(true, true);

		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.clickButton = this.add.text(680, 50, 'Restart', { fill: '#444' })
			.setInteractive({ useHandCursor: true })
			.on('pointerup', () => {
				this.restartLevel();
		});

		this.clickButton.visible = false;
	}

	restartLevel() {
		const state = this.scene.get('game-state');
		state.events.emit('restartLevel');
		this.scene.restart();
		this.lives = 1;
		this.gameOver = false;
	}
	
	// Dispatch a scene event that the GameState will handle
	addStar() {
		const state = this.scene.get('game-state');
		state.events.emit('addStar');
	}

	levelComplete() {

		this.add.text(115, 300, 'LEVEL COMPLETE', {fontSize: '64px', fill: '#000'})

		this.physics.pause();
		setTimeout(() => {
			const state = this.scene.get('game-state');
			state.events.emit('levelComplete');
			this.scene.start('store');
		}, 2000);
		
	}

	collectHeart(player, heart) {
		heart.disableBody(true, true);
		this.registry.set('lives', ++this.lives);
	}

	hitBomb(player, bomb) {
		this.registry.set('lives', --this.lives);

		if (this.lives <= 0) {
			this.physics.pause();

			player.setTint(0xff0000);

			player.anims.play('turn');

			this.gameOver = true;
			this.clickButton.visible = true;
		}
		
		this.destroyBomb(player, bomb);
	}

	destroyBomb(player, bomb) {
		bomb.setTint(0xff0000);
		bomb.disableBody(true, true);
	}

    update()
	{
		if (this.gameOver) {
			return;
		}

		// this.bullets.children.each(function(b) {
        //     if (b.active) {
        //         if (b.y > 600) {
        //             b.setActive(false);
        //         }
        //     }
        // }.bind(this));

		if (this.cursors.left.isDown)
		{
			this.player.setVelocityX(-160)

			this.player.anims.play('left', true)

			if (this.cursors.space.isDown)
			{
				this.shootGun('left');
			}
		}
		else if (this.cursors.right.isDown)
		{
			this.player.setVelocityX(160)

			this.player.anims.play('right', true)

			if (this.cursors.space.isDown)
			{
				this.shootGun('right');
			}
		}
		else
		{
			this.player.setVelocityX(0)

			this.player.anims.play('turn')

			if (this.cursors.space.isDown)
			{
				this.shootGun('up');
			}
		}

		if (this.cursors.up.isDown && this.player.body.touching.down)
		{
			this.player.setVelocityY(-330)
		}

		

		if (this.cursors.down.isDown)
		{
			let shields = this.registry.get('shields');
			if (shields > 0) {
				if (!this.activeShield) {
					this.activeShield = true;
					this.shield.enableBody(true, this.getPlayerCenterX(),
										   this.getPlayerCenterY(), true, true);
					this.physics.world.removeCollider(this.bombCollider);

					this.registry.set('shields', --shields)
					setTimeout(() => {
						this.activeShield = false;
						this.shield.disableBody(true, true);
						this.physics.world.colliders.add(this.bombCollider);
					}, 5000);
				}
			}
		}

		if (this.activeShield) {
			this.shield.x = this.getPlayerCenterX();
			this.shield.y = this.getPlayerCenterY();
			this.shield.refreshBody();
		}
	}
	
	createBullets(numBullets = 5) {
        const bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 3,
		});
		bullets.enableBody = true;
		
		// bullets.children.iterate((child) => {
		// 	child.kill()(Phaser.Math.FloatBetween(0.4, 0.8))
        // });

        // bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet);
		// // Same as above, set the anchor of every sprite to 0.5, 1.0
		// bullets.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
	
		// // This will set 'checkWorldBounds' to true on all sprites in the group
		// bullets.setAll('checkWorldBounds', true);
        
        return bullets;
	}

	resetBullet(bullet) {
		// Destroy the bullet
		bullet.kill();
	}

	shootGun(direction = 'up') {
		const velocity = direction === 'left' ? -500 : 500;
		const bullet = this.bullets.get(this.getPlayerCenterX(), this.getPlayerCenterY() + 15);
		if (bullet)
		{
			bullet.setActive(true);
			bullet.setVisible(true);
			if (direction === 'up') {
				bullet.body.velocity.y = -500;
			} else {
				bullet.body.velocity.x = velocity;
			}
		}
	}

    createPlayer(startX=100, startY=450) {
		const player = this.physics.add.sprite(startX, startY, DUDE_KEY);
		player.setBounce(0.2);
		player.setCollideWorldBounds(true);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});
		
		this.anims.create({
			key: 'turn',
			frames: [ { key: DUDE_KEY, frame: 4 } ],
			frameRate: 20
		});
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
        });
        
        return player;
	}

	getPlayerCenterX() {
		return this.player.body.position.x + this.player.displayWidth / 2;
	}

	getPlayerCenterY() {
		return this.player.body.position.y + this.player.displayHeight / 2;
	}
}