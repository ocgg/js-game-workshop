import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        this.load.image('opp-background', 'tilesets/backgrounds/bg_grassland_1.png');
        this.load.image('ga2d-bg', 'gameart2d-bg.png');

        /* TILESETS ********************/
        // ANCIEN
        this.load.image('plants', 'tilesets/environment/tile_jungle_plants_objects.png');
        // NOUVEAU
        this.load.image('ground', 'tilesets/environment/jungle-ground-brown.png');
        this.load.image('wall', 'tilesets/environment/jungle-wall-brown.png');
        this.load.image('bridge', 'tilesets/environment/jungle-bridge.png');
        this.load.image('water', 'tilesets/environment/jungle-water.png');
        this.load.image('spikes', 'tilesets/spikes.png');
        this.load.image('sign', 'tilesets/sign.png');

        /* TILEMAPS ********************/
        this.load.tilemapTiledJSON('testlevel', 'tilemaps/test.json');
        this.load.tilemapTiledJSON('level1', 'tilemaps/level1.json');
        this.load.tilemapTiledJSON('level2', 'tilemaps/level2.json');
        this.load.tilemapTiledJSON('level3', 'tilemaps/level3.json');
        this.load.tilemapTiledJSON('level4', 'tilemaps/level4.json');
        this.load.tilemapTiledJSON('level5', 'tilemaps/level5.json');
        
        /* SPRITESHEETS ****************/
        this.load.image('hitbox', 'hitbox.png');
        // Ninjagirl
        this.load.spritesheet('player_run', 'spritesheets/run.png', { frameWidth: 94, frameHeight: 130 });
        this.load.spritesheet('player_idle', 'spritesheets/idle.png', { frameWidth: 73, frameHeight: 125 });
        this.load.spritesheet('player_jump', 'spritesheets/jump.png', { frameWidth: 100, frameHeight: 136 });
        this.load.spritesheet('player_dead', 'spritesheets/dead.png', { frameWidth: 145, frameHeight: 150 });
        this.load.spritesheet('player_attack', 'spritesheets/attack.png', { frameWidth: 131, frameHeight: 141 });
        // Zombie
        this.load.spritesheet('zombie_idle', 'spritesheets/zombie_idle.png', { frameWidth: 108, frameHeight: 130 });
        this.load.spritesheet('zombie_attack', 'spritesheets/zombie_attack.png', { frameWidth: 108, frameHeight: 130 });
        this.load.spritesheet('zombie_dead', 'spritesheets/zombie_dead.png', { frameWidth: 157, frameHeight: 132 });
        this.load.spritesheet('zombie_walk', 'spritesheets/zombie_walk.png', { frameWidth: 108, frameHeight: 130 });
    }

    create ()
    {
        // PLAYER
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player_run', { start: 0, end: 9 }),
            frameRate: 25,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 9 }),
            frameRate: 15,
            // repeat: 0,
            yoyo: true,
        });
        this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNumbers('player_dead', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: 0,
        });
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('player_attack', { start: 0, end: 9 }),
            frameRate: 30,
            repeat: 0,
        });

        // ZOMBIE
        this.anims.create({
            key: 'zombie_idle',
            frames: this.anims.generateFrameNumbers('zombie_idle', { start: 0, end: 14 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'zombie_attack',
            frames: this.anims.generateFrameNumbers('zombie_attack', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: 0,
        });
        this.anims.create({
            key: 'zombie_dead',
            frames: this.anims.generateFrameNumbers('zombie_dead', { start: 0, end: 11 }),
            frameRate: 15,
            repeat: 0,
        });
        this.anims.create({
            key: 'zombie_walk',
            frames: this.anims.generateFrameNumbers('zombie_walk', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1,
        });

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
