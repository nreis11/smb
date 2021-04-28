import SpriteSheet from "./SpriteSheet.js";
import { loadImage } from "./loaders.js";

export function loadMarioSprites() {
  return loadImage("/img/sprites.png").then((image) => {
    const sprites = new SpriteSheet(image, 16, 16);
    sprites.defineTile("idle", 0, 5.5);
    return sprites;
  });
}

export function loadBackgroundSprites() {
  return loadImage("/img/tiles.png").then((image) => {
    const sprites = new SpriteSheet(image, 16, 16);
    sprites.defineTile("ground", 0, 0);
    sprites.defineTile("sky", 10, 7);
    return sprites;
  });
}
