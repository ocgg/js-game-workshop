// import { this } from 'phaser';
import { Level } from '../../../modules/level';
import { LevelHelpers, UpdateLoop } from '../../../modules/level_helpers';


export class Level4 extends Level
{
    ///////////////////////////////////////////////////////////////////////
    // NIVEAU 4 ///////////////////////////////////////////////////////////
    //
    // OBJECTIF: Finir le niveau en évitant les pièges !
    //
    // Il faudra ajuster la vitesse de déplacement, la hauteur de saut,
    // régler leur équilibre avec la valeur de gravité et observer leur
    // influence sur le gameplay !
    //
    // Le code de create() et update() a été simplifié pour régler ces valeurs
    // plus facilement.
    //
    ///////////////////////////////////////////////////////////////////////


    create() {
        this.startInit();
        
        // VOTRE CODE ICI: ////////////////////////////////
        
        this.physics.world.gravity.y = 1800;

        // (fin de votre code)
        
        this.endInit('Niveau 4', 'Maintenant, on JOUE');
    }

    update() {
        if (this.dead || this.won) return;

        // VOTRE CODE ICI: ////////////////////////////////

        // this.walkspeed est la vitesse de déplacement du joueur
        this.walkSpeed = 500
        // this.jumpVelocity donne la hauteur du saut (l'impulsion)
        // La vitesse de "descente" est influencée par la gravité
        // Vous pouvez changer la valeur de gravité dans create(), ci-dessus
        this.jumpVelocity = -600

        // (fin de votre code)

        this.endUpdate();
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
        super('Level4');
        this.nextLevelKey = 'Level5';
        this.won = false;
        this.dead = false;
    }

    startInit() {

        LevelHelpers.setBackground(this);
        LevelHelpers.setTilemap(this, 'level4');

        // Player
        // Zombie
        this.zombie = LevelHelpers.addZombie(this, 700, 760).setFlipX(false);
        this.player = this.physics.add.sprite(100, 600, 'player_idle').setScale(0.66);
        this.player.setSize(50,100).setOffset(15, 25).setOrigin(0);
        this.cameras.main.startFollow(this.player);
        // Falling spikes
        this.fallingSpikes = LevelHelpers.addFallingSpikes(this, 624, 1082, 175);
        this.fallingSpikes.push(...LevelHelpers.addFallingSpikes(this, 1424, 1456, 400));

        // Colliders pour le player
        this.physics.add.collider(this.player, [this.ground_layer, this.bridge_layer]);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.ground_layer, this.fallingSpikes);
        // Colliders pour les spikes
        this.fallingSpikeCl = this.physics.add.overlap(this.player,
            this.fallingSpikes,
            () => this.die(this.fallingSpikeCl));
        this.staticSpikesCl = this.physics.add.overlap(this.player, this.objects_layer, (player, tile) => {
            // La propriété "danger" est configurée dans Tiled
            tile.properties.danger && this.die(this.staticSpikesCl);
        })

        // Foreground: doit être créé ici pour apparaître devant le joueur
        this.foreground_layer = this.map.createLayer('foreground', this.ts.bridge);

        // Le joueur gagne si il atteint le bord droit du niveau,
        this.player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (right) this.win();
        });
    }
    
    endUpdate() {
        const onGround = this.player.body.onFloor();
        // Aller à gauche
        if (this.cursors.left.isDown) {
            this.player.setFlipX(true).setVelocityX(-this.walkSpeed);
            onGround && this.player.anims.play('right', true);
        }
        // Aller à droite
        else if (this.cursors.right.isDown) {
            this.player.setFlipX(false).setVelocityX(this.walkSpeed);
            onGround && this.player.anims.play('right', true);
        }
        // S'arrêter
        else {
            this.player.setVelocityX(0);
            onGround && this.player.anims.play('idle', true)
        }
        // Sauter
        if (this.cursors.up.isDown && onGround) {
            this.player.setVelocityY(this.jumpVelocity);
        }
        // Animation de saut si le joueur est en l'air
        !onGround && this.player.anims.play('jump', true);

        UpdateLoop.checkFallingSpikes(this.fallingSpikes, this.player);
    }

    die(collider = null) {
        this.dead = true;
        this.player.setVelocityX(0);
        this.player.anims.play('dead', true)
        // empêche l'animation de mort de se répéter
        collider && this.physics.world.removeCollider(collider)
        this.lose();
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
// - Trouver une solution pour ne pas voir au delà des limites du monde
//   (indice : utiliser this.cameras ...)
//   
///////////////////////////////////////////////////////////////////////////////
