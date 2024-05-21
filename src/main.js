import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { TestLevel } from './scenes/levels/TestLevel';
import { Level1 } from './scenes/levels/Level1';
import { Level2 } from './scenes/levels/Level2';
import { Level3 } from './scenes/levels/Level3';
import { Level4 } from './scenes/levels/Level4';
import { Level5 } from './scenes/levels/Level5';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1800 },
            tileBias: 64,
            // debug: true,
        }
    },
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        TestLevel,
        Level1,
        Level2,
        Level3,
        Level4,
        Level5,
    ]
};

export default new Phaser.Game(config);
