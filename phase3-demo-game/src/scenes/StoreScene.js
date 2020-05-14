import Phaser from 'phaser'

export default class StoreScene extends Phaser.Scene {
    constructor() {
        super('store');
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('store', 'assets/store_front.png');
        this.load.image('star-store', 'assets/star.png')
        this.load.image('heart-store', 'assets/heart.png')
        this.load.image('shield-store', 'assets/shield.png')
    }

    create() {
        this.add.image(400, 300, 'sky');
        this.add.image(400, 325, 'store');

        const statsStyle = { fontSize: '26px', fill: '#000' };
        const nextLevelStyle = { fontSize: '22px', fill: 0xffff00 };

        // New Life
        this.add.image(250, 255, 'heart-store').setScale(2);
        this.add.image(225, 310, 'star-store').setScale(1.3);
        this.add.text(250, 300, 'x10', statsStyle);
        this.add.text(190, 340, 'Purchase Life', { fill: '#222' }).setInteractive().on(
            'pointerdown', () => this.purchaseLife());

        // Shield
        this.add.image(550, 255, 'shield-store').setScale(1.75);
        this.add.image(525, 310, 'star-store').setScale(1.3);
        this.add.text(550, 303, 'x20', statsStyle);
        this.add.text(480, 340, 'Purchase Shield', { fill: '#222' }).setInteractive().on(
            'pointerdown', () => this.purchaseShield());

        this.add.image(225, 475, 'star-store').setScale(1.3);
        this.add.text(250, 465, 'x50', statsStyle);

        this.add.image(525, 475, 'star-store').setScale(1.3);
        this.add.text(550, 465, 'x100', statsStyle);


        // const nextLevelButton = this.add.rectangle(410, 540, 160, 36, 0xaaaaaa);
        // nextLevelButton.setStrokeStyle(2, 0xefc53f);

        // var rect = new Phaser.Geom.Rectangle(330, 522, 160, 36);
        // const nextLevelButton = this.add.graphics({ fillStyle: { color: 0x00ff00 } });
        // nextLevelButton.fillRoundedRect(rect, 8);

        this.add.text(345, 530, 'Next Level', nextLevelStyle).setInteractive()
            .on('pointerdown', () => this.nextLevel())
    }

    purchaseLife() {
        let stars = this.registry.get('stars');
        if (stars >= 10) {
            const lives = this.registry.get('lives');
            this.registry.set('lives', lives + 1);
            this.registry.set('stars', stars - 10);
        } 
    }

    purchaseShield() {
        let stars = this.registry.get('stars');
        if (stars >= 20) {
            const shields = this.registry.get('shields');
            this.registry.set('shields', shields + 1);
            this.registry.set('stars', stars - 20);
        }
    }

    nextLevel() {
        const level = this.registry.get('level');
        this.scene.start(`level-${level}`);
    }
}