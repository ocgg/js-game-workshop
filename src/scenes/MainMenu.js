import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.image(512, 150, 'logo');

        this.add.text(512, 300, 'BUG NINJA', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const levelEntryOptions = {
            fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        };

        this.levelEntries = [
            // this.add.text(512, 370, 'TEST', levelEntryOptions).setOrigin(0.5),
            this.add.text(512, 420, 'Niveau 1', levelEntryOptions).setOrigin(0.5),
            this.add.text(512, 470, 'Niveau 2', levelEntryOptions).setOrigin(0.5),
            this.add.text(512, 520, 'Niveau 3', levelEntryOptions).setOrigin(0.5),
            this.add.text(512, 570, 'Niveau 4', levelEntryOptions).setOrigin(0.5),
            this.add.text(512, 620, 'Niveau 5', levelEntryOptions).setOrigin(0.5),
        ];

        // Choix du niveau au clavier
        this.cursor = this.input.keyboard.createCursorKeys();
        this.selectedLevel = 0;

        this.selectLevel = () => {
            // if (this.selectedLevel === 0) this.scene.start('TestLevel');
            // else this.scene.start(`Level${this.selectedLevel}`);
            this.scene.start(`Level${this.selectedLevel + 1}`);
        };

        this.input.keyboard.on('keydown-UP', () => {
            if (this.selectedLevel > 0) this.selectedLevel--;
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            if (this.selectedLevel < this.levelEntries.length - 1) this.selectedLevel++;
        });
        this.input.keyboard.on('keydown-ENTER', this.selectLevel);
    }

    update() {
        this.levelEntries.forEach((entry, index) => {
            this.selectedLevel === index ? entry.setColor('#ff0') : entry.setColor('#fff');
        });
    }
}
