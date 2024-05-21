// import { this } from 'phaser';
import { Level } from '../../../modules/level';
import { LevelHelpers, UpdateLoop } from '../../../modules/level_helpers';


export class Level5 extends Level
{
    ///////////////////////////////////////////////////////////////////////
    // NIVEAU 5 ///////////////////////////////////////////////////////////
    //
    // OBJECTIF: Tuer le zombie !
    //
    // Cet exercice est bien plus complexe.
    //
    // Incorporez une logique de combat dans le jeu !
    //
    // Essayez déjà de faire en sorte que le joueur puisse attaquer,
    // et de gérer la logique de la portée du coup:
    //  Est-ce que le zombie est touché/qu'est-ce qui se passe alors...
    //
    // Faites déjà en sorte que le zombie meure en un coup, comme le joueur.
    //
    // - Il y a une animation disponible "attack" pour le joueur
    //
    // - Pour tuer le zombie, utilisez this.zombie.die()
    //
    // - Le zombie peut déjà attaquer le joueur - rien à faire à ce niveau !
    //
    //
    // DÉFI POUR LES FOUS DU JS:
    //
    // faites bouger le zombie ! Une animation "zombie_walk" est disponible,
    // et il faudra écrire dans le fichier modules/zombie.js.
    //
    ///////////////////////////////////////////////////////////////////////


    create() {
        this.startInit();
        
        // VOTRE CODE ICI: ////////////////////////////////
        

        // (fin de votre code)
        
        this.endInit('Niveau 5', 'Le boss de fin');
    }

    update() {
        if (this.dead || this.won) return;
        this.startUpdate();

        // VOTRE CODE ICI: ////////////////////////////////

        // Checker si le joueur est sur le sol
        const onGround = this.player.body.onFloor();

        // Aller à gauche
        if (this.cursors.left.isDown) {
            this.player.setFlipX(true).setVelocityX(-this.walkSpeed);
            // L'animation ne joue pas si le joueur n'est pas au sol
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

        // (fin de votre code)
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
        super('Level5');
        this.nextLevelKey = 'MainMenu';

        this.won = false;
        this.dead = false;

        this.walkSpeed = 500
        this.jumpVelocity = -600
    }

    startInit() {

        LevelHelpers.setBackground(this);
        LevelHelpers.setTilemap(this, 'level5');

        // Player
        // Zombie
        this.zombie = LevelHelpers.addZombie(this, 500, 310);
        this.player = this.physics.add.sprite(100, 270, 'player_idle').setScale(0.66);
        this.player.setSize(50,100).setOffset(15, 25).setOrigin(0);
        this.cameras.main.startFollow(this.player);

        // Colliders pour le player
        this.physics.add.collider(this.player, [
            this.ground_layer,
            this.bridge_layer,
            this.zombie
        ]);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.ground_layer, this.fallingSpikes);

        // Foreground: doit être créé ici pour apparaître devant le joueur
        this.foreground_layer = this.map.createLayer('foreground', this.ts.bridge);

        // Le joueur gagne si il atteint le bord droit du niveau,
        // et que le zombie est mort
        this.player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (right && this.zombie.dead) this.win();
        });
    }

    startUpdate() {
        this.zombie.update();
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
// Regardez le fichier modules/zombie.js pour voir comment la portée d'un coup
// est gérée (indice: hitbox).
//
// ...Mais si vous en êtes là c'est que vous avez plus trop besoin d'indice,
// si ?
