import { loadImage } from '../loaders.js';
import SpriteSheet from '../SpriteSheet.js';

const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

class Font {
    constructor(spritesheet, size) {
        this.spritesheet = spritesheet;
        this.size = size;
    }

    print(text, context, x, y) {
        [...text].forEach((char, index) => {
            this.spritesheet.draw(char, context, x + index * this.size, y);
        })
    }
}

export async function loadFont() {
    const image = await loadImage('./img/font.png');
    const fontSpriteSheet = new SpriteSheet(image);

    const size = 8;
    const rowLength = image.width;
    for (let [index, char] of [...CHARS].entries()) {
        const x = index * size % rowLength;
        const y = Math.floor(index * size / rowLength) * size;
        fontSpriteSheet.define(char, x, y, size, size);
    }

    return new Font(fontSpriteSheet, size);
}