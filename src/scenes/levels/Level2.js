// import { this } from 'phaser';
import { Level } from '../../../modules/level';
import { LevelHelpers } from '../../../modules/level_helpers';


export class Level2 extends Level
{
    create() {
        this.startInit();

        ///////////////////////////////////////////////////////////////////////
        // NIVEAU 2 ///////////////////////////////////////////////////////////
        //
        // OBJECTIF: que le joueur puisse marcher sur le sol !
        //
        // Pour gagner, le joueur doit percuter (pas juste traverser) le bord
        // droit du monde.
        //
        // En cas de difficulté, il y a des indices tout en bas de ce fichier !
        //
        ///////////////////////////////////////////////////////////////////////

        // Le joueur est contenu dans la variable "this.player"
        // On peut accéder à la "caméra" avec "this.cameras.main"
        // L'image de fond est accessible par "this.background"

        // VOTRE CODE ICI: ////////////////////////////////
        


        // (fin de votre code)

        this.endInit();
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
        super('Level2');
        this.nextLevelKey = 'Level3';
        this.won = false;
    }

    update() {
        if (this.player.dead || this.won) return;
        this.player.body.setSize(50, 100).setOffset((this.player.width - 50) / 2, 25);
        this.endUpdate();
    }

    startInit() {
        this.physics.world.gravity.y = 1000;

        LevelHelpers.setBackground(this);
        LevelHelpers.setTilemap(this, 'level2');

        // Player
        this.player = this.physics.add.sprite(150, 100, 'player_idle');
        this.player.setSize(50,100).setOffset(15, 25).setOrigin(0);

        // Colliders pour le player
        this.physics.add.collider(this.player, [this.ground_layer, this.bridge_layer]);
        this.player.setCollideWorldBounds(true);
        // Foreground: doit être créé ici pour apparaître devant le joueur
        this.foreground_layer = this.map.createLayer('foreground', this.ts.bridge);

        // Camera
        // Définit les limites du monde par rapport à la map du sol
        this.physics.world.bounds.width = this.ground_layer.width;
        this.physics.world.bounds.height = this.ground_layer.height;

        this.cameras.main.setBounds(0, 0, this.ground_layer.width, this.ground_layer.height);
    }

    endInit(player) {
        // Contrôles clavier
        this.cursors = this.input.keyboard.createCursorKeys();
        // Petit texte de début
        LevelHelpers.addStartText(this, 'Niveau 2', 'Échelles et camera');

        // Le joueur gagne si il bord droit du niveau,
        // Et que la caméra le suit !
        this.player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            const cameraAtRight = this.cameras.main.scrollX > this.ground_layer.width - this.sys.game.config.width;
            if (right && cameraAtRight) this.win();
        });
        // Ceci est un indice caché (il y a d'autres solutions et de meilleures)
        // Donne au background la largeur de l'écran de jeu
        // this.background.displayWidth = this.sys.game.config.width;
        // Donne au background la hauteur de la carte
        // this.background.displayHeight = this.ground_layer.height;
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
// Il y a encore trois choses à trouver :
//
// - Faire que la "caméra" suive le joueur
//
// - Régler la taille (échelle) du sprite du joueur pour passer sous l'obstacle
//
// - Trouver une solution pour ne pas voir au delà des limites du monde (que
//   le fond d'écran de dépasse pas)
//
// Indice pour ce 3eme point: this.cameras.main.setBounds....
//   
//
///////////////////////////////////////////////////////////////////////////////
