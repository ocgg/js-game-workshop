import { Scene } from 'phaser';
import { LevelHelpers, UpdateLoop } from './level_helpers';


export class Level extends Scene {
    constructor(key) {
	super(key);
    }

    lose() {
        this.add.text(512, 250, 'Oh non !', {
            fontFamily: 'Arial Black', fontSize: 30, color: '#ff0000',
            stroke: '#fff', strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);
        this.add.text(512, 300, '<Entrée> Recommencer\n <Echap> Menu', {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'left'
        }).setOrigin(0.5).setScrollFactor(0);

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.restart();
        });
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MainMenu');
        });
    }

    win() {
        this.won = true;
        // particles from player
        const particles = this.add.particles(this.player.x, this.player.y, 'player_jump', {
            // frame: 9,
            lifespan: 1500,
            speed: { min: 300, max: 800 },
            angle: { min: 120, max: 270 },
            scale: { start: 0.5, end: 0 },
            rotate: { start: 0, end: 360 },
            gravityY: 300,
            on: false
        });
        particles.explode(100);
        // Make player disappear without destroying it (prevent error from update())
        this.player.setVisible(false);
        this.add.text(512, 250, 'Terminé !', {
            fontFamily: 'Arial Black', fontSize: 30, color: '#008800',
            stroke: '#fff', strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);
        this.add.text(512, 300, '<Entrée> Niveau suivant\n <Echap> Menu', {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'left',
        }).setOrigin(0.5).setScrollFactor(0);

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start(this.nextLevelKey);
        });
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MainMenu');
        });
    }

    startUpdate() {
        // Si le joueur atteint le bord droit de la scène, le niveau est terminé
        const playerIsAtLevelEnd = this.player.x > (this.ground_layer.width - this.player.width / 2);
        if (playerIsAtLevelEnd) this.win();

	this.zombie.update();
	this.player.update();
        UpdateLoop.checkFallingSpikes(this.fallingSpikes, this.player);
    }

    endUpdate() {
        UpdateLoop.listenMotionKeys(this);
    }

    // startInit() {
    //     this.won = false;
    //     this.killables = [];
    //
    //     LevelHelpers.setBackground(this);
    //     LevelHelpers.setTilemap(this, 'testlevel');
    //
    //     // SPRITES ////////////////////
    //     this.zombie = LevelHelpers.addZombie(this, 400, 376);
    //     this.player = LevelHelpers.addPlayer(this);
    //     this.fallingSpikes = LevelHelpers.addFallingSpikes(this, 625, 1000, 143);
    //
    //     // COLLISIONS /////////////////////////////////////
    //     // Tout ce qui doit percuter le sol
    //     this.physics.add.collider(this.ground_layer, [
    //         this.player,
    //         ...this.killables,
    //         ...this.fallingSpikes,
    //     ]);
    //     // Cas où le joueur meurt
    //     this.deadlyInteractions = [
    //         this.physics.add.overlap(this.player, this.fallingSpikes, () => this.player.die()),
    //         this.physics.add.overlap(this.player, this.objects_layer, (player, tile) => {
    //             // La propriété "danger" est configurée dans Tiled
    //             if (tile.properties.danger) this.player.die();
    //         }),
    //         // Quand le joueur touche le zombie
    //         this.physics.add.collider(this.player, this.killables, (player, zombie) => {
    //             const zCurrentAnim = this.zombie.anims.currentAnim.key;
    //             const zDead = zCurrentAnim && zCurrentAnim === 'zombie_dead';
    //             if (!zDead) this.zombie.attack();
    //         }),
    //     ]
    // }

    endInit(text, subtext = '') {
        // Gérer la caméra
        LevelHelpers.setScreenBounds(this);
        // Contrôles clavier
        this.cursors = this.input.keyboard.createCursorKeys();
        LevelHelpers.addStartText(this, text, subtext);
    }
}
