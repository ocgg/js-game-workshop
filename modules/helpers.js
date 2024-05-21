export const createMenu = (x, y, options, scene) => {
    let selected = 0;
    options.forEach((option, index) => {
	const text = scene.add.text(0, y + index * 50, option).setOrigin(0.5);
	text.setInteractive();
	text.on('pointerover', () => {
	    selected = index;
	    text.setColor('#ff0');
	});
	text.on('pointerout', () => {
	    text.setColor('#fff');
	});
	text.on('pointerup', () => {
	    console.log(option);
	    // scene.scene.start(option);
	});
    });
    scene.input.keyboard.on('keydown', (event) => {
	if (event.key === 'ArrowUp') {
	    selected = Math.max(0, selected - 1);
	} else if (event.key === 'ArrowDown') {
	    selected = Math.min(options.length - 1, selected + 1);
	} else if (event.key === 'Enter') {
	    scene.scene.start(`Level0${selected + 1}`);
	}
	// menu.list.forEach((text, index) => {
	//     text.setColor(index === selected ? '#ff0' : '#fff');
	// });
    });
}
