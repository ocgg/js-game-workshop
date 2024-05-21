// import { Scene } from 'phaser';
import { Level } from '../../../modules/level';


export class TestLevel extends Level
{
    constructor() {
        super('TestLevel');
    }

    create() {
        this.startInit();
        // VOTRE CODE ICI /////////////////////////////////


        ///////////////////////////////////////////////////
        this.endInit();
    }

    update() {
        if (this.player.dead || this.won) return;
        this.startUpdate()
        // VOTRE CODE ICI /////////////////////////////////


        ///////////////////////////////////////////////////
        this.endUpdate();
    }
}
