import { Zombie } from './zombie.js';


export class LevelHelpers {
    static setBackground(scene) {
        scene.cameras.main.setBackgroundColor('#000000');
        scene.background = scene.add.image(512, 384, 'ga2d-bg').setOrigin(0.5);

        scene.background.setScrollFactor(0);
        scene.background.setScrollFactor(0);
    }

    static setTilemap(scene, tilemapName) {
	scene.map = scene.add.tilemap(tilemapName);

        scene.ts = {
            ground: scene.map.addTilesetImage('jungle-ground-brown', 'ground', 32, 32, 1, 2),
            wall:   scene.map.addTilesetImage('jungle-wall-brown', 'wall', 32, 32, 1, 2),
            water:  scene.map.addTilesetImage('jungle-water', 'water', 32, 32, 1, 2),
            plants: scene.map.addTilesetImage('tile_jungle_plants_objects', 'plants'),
            bridge: scene.map.addTilesetImage('jungle-bridge', 'bridge', 32, 32, 1, 2),
            sign:   scene.map.addTilesetImage('sign', 'sign'),
            spikes: scene.map.addTilesetImage('spikes', 'spikes'),
        };
        const ts = scene.ts;

        // L'eau est en arrière plan
        if (scene.map.getLayer('water')) {
            scene.water_layer = scene.map.createLayer('water', ts.water);
        }
        // Ground layer: tuiles "solides"
        scene.ground_layer = scene.map.createLayer('ground', [
            ts.ground,
            ts.wall,
        ]);
        // La propriété "collides" est configurée dans Tiled
        scene.ground_layer.setCollisionByProperty({ collides: true });

        // Bridge layer: tuiles "pont"
        if (scene.map.getLayer('bridge')) {
            scene.bridge_layer = scene.map.createLayer('bridge', ts.bridge);
            scene.bridge_layer.setCollisionByProperty({ collides: true });
        }
        // Decoration layer: tuiles "décoratives"
        scene.decoration_layer = scene.map.createLayer('decoration', [
            ts.plants, ts.sign,
        ]);
        // Objects layer: objets avec interaction
        scene.objects_layer = scene.map.createLayer('objects', [
            ts.plants,
            ts.spikes,
        ]);

    }

    // static addPlayer(scene) {
    //     const player = new Player(scene, 100, 300);
    //     scene.cameras.main.startFollow(player);
    //     return player;
    // }

    static addZombie(scene, x, y) {
	const zombie = new Zombie(scene, x, y);
	// scene.killables.push(zombie);
	return zombie;
    }

    static addFallingSpikes(scene, xmin, xmax, y) {
	const fallingSpikes = [];
        for (let x = xmin; x < xmax; x += 32) {
            const spike = scene.physics.add.sprite(x, y, 'spikes').setFlipY(true);
            spike.body.setMaxVelocityY(800).allowGravity = false;
            fallingSpikes.push(spike);
        }
	return fallingSpikes;
    }

    static setScreenBounds(scene) {
        const groundWidth = scene.ground_layer.width;
        const groundHeight = scene.ground_layer.height;
        
        // Définit les limites du monde par rapport à la map du sol
        scene.physics.world.bounds.width = groundWidth;
        scene.physics.world.bounds.height = groundHeight;

        scene.background.displayWidth = scene.sys.game.config.width;
        // scene.background.displayHeight = groundHeight;

        const zoomFactor = 1.4;
        scene.cameras.main.setZoom(zoomFactor);
        // la caméra ne doit pas montrer en dehors de la carte
        scene.cameras.main.setBounds(
            scene.ground_layer.originX,
            scene.ground_layer.originY,
            groundWidth,
            groundHeight
        );
        scene.background.setCrop(
            0, 0,
            scene.cameras.main.width * zoomFactor,
            groundHeight * zoomFactor
        );
        scene.background.displayHeight = groundHeight;
    }

    static addStartText(scene, text, subText = '') {
	text = scene.add.text(512, 200, text, {
		fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
		stroke: '#000000', strokeThickness: 3,
		align: 'center'
	}).setOrigin(0.5).setScrollFactor(0);
        subText = scene.add.text(512, 250, subText, {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);

	setTimeout(() => {
            text.destroy();
            subText.destroy();
        }, 2000);
    }
}

export class UpdateLoop {
    static checkFallingSpikes(spikes, player) {
	spikes.forEach(spike => {
	    if (Math.abs(player.x - spike.x) < 100) {
		spike.setAccelerationY(1300);
		spikes = spikes.filter(s => s !== spike);
	    }
	});
    }

    static listenMotionKeys(scene) {
	const { player, cursors } = scene;
        const onGround = player.body.onFloor();
        const currentAnim = player.anims.currentAnim;
        const attacking = currentAnim && currentAnim.key === 'attack';
        const busy = attacking || !onGround;

        // Aller à gauche
        if (cursors.left.isDown) {
            player.setFlipX(true).setVelocityX(-600);
            !busy && player.anims.play('right', true);
        }
        // Aller à droite
        else if (cursors.right.isDown) {
            player.setFlipX(false).setVelocityX(600);
            !busy && player.anims.play('right', true);
        }
        // Ni gauche ni droite
        else {
            player.setVelocityX(0);
            !busy && player.anims.play('idle', true)
        }
        // Sauter
        if (cursors.up.isDown && onGround) {
            player.setVelocityY(-1300);
            !attacking && player.anims.play('jump', true);
        }
        // Attaquer
        else if (cursors.space.isDown) {
	    player.attack();
        }
        // Animation de saut si le joueur est en l'air et qu'il n'attaque pas
        !onGround && !attacking && this.player.anims.play('jump', true);
    }
}
