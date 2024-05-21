// import { this } from 'phaser';
import { Level } from '../../../modules/level';
import { LevelHelpers } from '../../../modules/level_helpers';


export class Level3 extends Level
{
    update() {
        if (this.dead || this.won) return;

        ///////////////////////////////////////////////////////////////////////
        // NIVEAU 3 ///////////////////////////////////////////////////////////
        //
        // OBJECTIF: on veut que notre personnage puisse sauter !
        //
        // Cette fois, on n'écris plus dans ma méthode "create()", mais dans
        // la méthode "update()".
        //
        // - create() sert à créer le niveau et ne s'exécute qu'une fois au
        //   début du niveau,
        //
        // - update() s'exécute en boucle et permet de mettre à jour les images
        //   et de gérer les évènements en temps réel.
        //
        // Attention donc: le code que vous écrivez ici s'exécutera plusieurs
        // fois par seconde, voire plusieurs dizaines !
        // 
        // Essayez de mettre un console.log() pour voir...
        //
        // Conseils sur la marche à suivre:
        //
        // Première etape: réagir à une touche
        //
        // - Commencez par essayer de faire réagir quelque chose à la touche
        //   "flèche du haut", par exemple un console.log().
        // - Il faut ensuite observer et s'inspirer du code existant qui gère
        //   les mouvements gauche/droite.
        // - Testez des choses, voyez comment ça réagit !
        //
        // Deuxième étape: ajout d'une animation
        //
        // - Il existe une animation "jump" pour le joueur (voir dans le
        //   fichier "Preloader.js" si vous voulez en savoir plus).
        //
        ///////////////////////////////////////////////////////////////////////


        // "this.cursors" contient des infos sur l'état des touches du clavier
        // "this.player" est toujours notre joueur


        // Aller à gauche
        if (this.cursors.left.isDown) {
            this.player.setFlipX(true).setVelocityX(-300);
            this.player.anims.play('right', true);
        }
        // Aller à droite
        else if (this.cursors.right.isDown) {
            this.player.setFlipX(false).setVelocityX(300);
            this.player.anims.play('right', true);
        }
        // S'arrêter
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true)
        }

        // VOTRE CODE ICI: ////////////////////////////////
        // NOTE : vous devrez peut-être aussi retoucher au code ci-dessus pour
        // ajuster quelques détails à la fin...



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
        super('Level3');
        this.nextLevelKey = 'Level4';
        this.won = false;
        this.dead = false;
    }

    create() {
        this.startInit();
        this.endInit('Niveau 3', 'Contrôles et animations');
        // Le joueur gagne si il atteint le bord droit du niveau
        this.player.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (right) this.win();
        });
    }

    startInit() {
        this.physics.world.gravity.y = 1000;

        LevelHelpers.setBackground(this);
        LevelHelpers.setTilemap(this, 'level3');

        // Player
        this.player = this.physics.add.sprite(50, 126, 'player_idle').setScale(0.66);
        this.player.setSize(50,100).setOffset(15, 25).setOrigin(0);
        this.cameras.main.startFollow(this.player);

        // Colliders pour le player
        this.physics.add.collider(this.player, [this.ground_layer, this.bridge_layer]);
        this.player.setCollideWorldBounds(true);
        // Foreground: doit être créé ici pour apparaître devant le joueur
        this.foreground_layer = this.map.createLayer('foreground', this.ts.bridge);

        this.physics.add.overlap(this.player, this.objects_layer, (player, tile) => {
            // La propriété "danger" est configurée dans Tiled
            if (tile.properties.danger) {
                this.dead = true;
                this.player.setVelocityX(0);
                this.player.anims.play('dead', true)
                this.lose();
            }
        })
    }
}

// INDICES ////////////////////////////////////////////////////////////////////
//
// Pour sauter "convenablement", il faut que:
//
// - La touche "flèche du haut" soit enfoncée ("isDown")
//
// - Le joueur soit sur le sol (indice: blocked.down)
//
//
// Pour que l'animation de saut soit correcte, il faut:
//
// - Qu'elle joue quand le joueur est en l'air (indice: onFloor())
//
// - Qu'elle ne joue pas si le joueur va à gauche ou à droite alors qu'il est
//   en l'air...
//   
///////////////////////////////////////////////////////////////////////////////
