import Phaser from 'phaser';

export class Zombie extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'zombie_idle');
	scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.66).setFlipX(true);
        this.body.allowGravity = false;
        this.body.setSize(80, 100)
            .setOffset((this.width - 80) / 2, 25)
            .setImmovable(true);
        this.anims.play('zombie_idle');

	this.hitbox = scene.add.sprite(0, 0, 'hitbox')
            .setScale(0.5)
            .setVisible(false);

	this.dead = false;
    }

    update() {
        if (this.dead) return;
        this.hitbox.setPosition(this.x + (this.flipX ? -15 : 15), this.y);
        this.setFlipX(this.scene.player.x < this.x);
        // si le joueur est à portée, attaque
        const playerOnRange = Phaser.Geom.Intersects.RectangleToRectangle(
            this.hitbox.getBounds(),
            this.scene.player.getBounds()
        );
        playerOnRange && this.attack();
    }

    attack() {
        // C'est un zombie, alors il attaque au bout de 250ms
        setTimeout(() => {
            if (this.dead) return;
            this.anims.play('zombie_attack', true);
        }, 250);
        setTimeout(() => {
            if (this.dead) return;
            const hbBounds = this.hitbox.getBounds();
            const playerOnRange = Phaser.Geom.Intersects.RectangleToRectangle(hbBounds, this.scene.player.getBounds());
            playerOnRange && this.scene.die();
        }, 470);
        this.on('animationcomplete', () => {
            if (!this.dead) this.anims.play('zombie_idle', true);
        });
    }

    die() {
	this.dead = true;
	// this.setVelocityX(0);
        this.body.enable = false;
	this.anims.play('zombie_dead', true)
        this.scene.killables = this.scene.killables.filter(k => k !== this);
    }
}
