import Compositor from "./Compositor.js";
import TileCollider from "./TileCollider.js";
import EntityCollider from "./EntityCollider.js";
import MusicController from "./MusicController.js";

export default class Level {
  constructor() {
    this.gravity = 1500;
    this.totalTime = 0;

    this.music = new MusicController();

    this.comp = new Compositor();
    this.entities = new Set();

    this.entityColllider = new EntityCollider(this.entities);
    this.tileCollider = new TileCollider();
  }

  update(gameContext) {
    this.entities.forEach((entity) => {
      entity.update(gameContext, this);
    });

    this.entities.forEach((entity) => {
      this.entityColllider.check(entity);
    });

    this.entities.forEach((entity) => {
      entity.finalize();
    });

    this.totalTime += gameContext.deltaTime;
  }
}
