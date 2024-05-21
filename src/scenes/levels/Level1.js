// import { this } from 'phaser';
import { Level } from '../../../modules/level';
import { LevelHelpers } from '../../../modules/level_helpers';


export class Level1 extends Level
{
    create() {
        this.startInit();

        ///////////////////////////////////////////////////////////////////////
        // NIVEAU 1 ///////////////////////////////////////////////////////////
        //
        // OBJECTIF: que le joueur puisse marcher sur le sol !
        //
        // Pour gagner, le joueur doit percuter (pas juste traverser) le bord
        // droit du monde.
        //
        // En cas de difficulté, il y a des indices tout en bas de ce fichier !
        //
        ///////////////////////////////////////////////////////////////////////

        // player contient le joueur
        const player = this.physics.add.sprite(100, 227, 'player_idle')

        // ground contient le "sol" du niveau
        const ground = this.ground_layer;

        // que contient bridge ???
        const bridge = this.bridge_layer;

        // VOTRE CODE ICI: ////////////////////////////////
        


        // (fin de votre code)

        this.endInit(player);
    }


    ///////////////////////////////////////////////////////////////////////////
    //
    // Le code ci-dessous créée le niveau, les objets graphiques, les
    // interactions, etc. Il a été déplacé ici pour simplifier la lisibilité
    // du code "utile" pour finir le niveau.
    //
    // Il n'est donc pas nécessaire d'y toucher.
    //
    // Cela dit, n'hésitez pas à y jetez un oeil pour aller plus loin !
    //
    ///////////////////////////////////////////////////////////////////////////


    constructor() {
        super('Level1');
        this.nextLevelKey = 'Level2';
        this.won = false;
    }

    update() {
        if (this.player.dead || this.won) return;
        this.endUpdate();
    }

    startInit() {
        this.physics.world.gravity.y = 1000;
        LevelHelpers.setBackground(this);
        
        // TILEMAP
	this.map = this.add.tilemap('level1');

        // Tilesets dont on a besoin pour générer la carte
        // Ils sont définis et importés dans Preloader.js
        this.ts = {
            ground: this.map.addTilesetImage('jungle-ground-brown', 'ground', 32, 32, 1, 2),
            wall:   this.map.addTilesetImage('jungle-wall-brown', 'wall', 32, 32, 1, 2),
            water:  this.map.addTilesetImage('jungle-water', 'water', 32, 32, 1, 2),
            plants: this.map.addTilesetImage('tile_jungle_plants_objects', 'plants'),
            bridge: this.map.addTilesetImage('jungle-bridge', 'bridge', 32, 32, 1, 2),
            sign:   this.map.addTilesetImage('sign', 'sign'),
        };
        // L'eau est en arrière plan
        this.water_layer = this.map.createLayer('water', this.ts.water);
        // Par dessus, le sol et le pont
        this.ground_layer = this.map.createLayer('ground', [this.ts.ground, this.ts.wall, this.ts.water]);
        this.bridge_layer = this.map.createLayer('bridge', this.ts.bridge);
        // Les décorations sont en avant-plan
        this.decoration_layer = this.map.createLayer('decoration', [this.ts.plants, this.ts.sign]);
        // La propriété "collides" est configurée dans Tiled
        // (Tiled est une app de création de tilemap)
        this.ground_layer.setCollisionByProperty({ collides: true });
        this.bridge_layer.setCollisionByProperty({ collides: true });
    }

    endInit(player) {
        // Player
        this.player = player;
        this.player.setSize(50,100).setOffset(15, 25).setOrigin(0);
        this.cameras.main.startFollow(this.player);

        // Foreground: doit être créé ici pour apparaître devant le joueur
        this.foreground_layer = this.map.createLayer('foreground', this.ts.bridge);

        // Camera
        LevelHelpers.setScreenBounds(this);
        // Contrôles clavier
        this.cursors = this.input.keyboard.createCursorKeys();
        // Petit texte de début
        LevelHelpers.addStartText(this, 'Niveau 1', 'colliders');

        // Le joueur gagne si il touche le sol, et le bord droit du niveau
        this.player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            const aboveGround = this.player.y < 250;
            if (right && aboveGround) this.win();
        });
    }

    endUpdate() {
        // Cette ligne est un raccourci pour les deux lignes suivantes:
        // const player = this.player;
        // const cursors = this.cursors;
	const { player, cursors } = this;

        // Aller à gauche
        if (cursors.left.isDown) {
            player.setFlipX(true).setVelocityX(-300);
            player.anims.play('right', true);
        }
        // Aller à droite
        else if (cursors.right.isDown) {
            player.setFlipX(false).setVelocityX(300);
            player.anims.play('right', true);
        }
        // Ni gauche ni droite
        else {
            player.setVelocityX(0);
            player.anims.play('idle', true)
        }
    }
}

// INDICES ////////////////////////////////////////////////////////////////////
//
// Il y a en gros trois lignes à écrire :
//
// - ajouter un collider entre le joueur et le sol
//
// - ajouter un collider entre le joueur et le pont
//
// - ajouter un collider entre le joueur et les bords du monde
//
///////////////////////////////////////////////////////////////////////////////
