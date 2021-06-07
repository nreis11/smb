import Scene from "./Scene.js";

export default class TimedScene extends Scene {
  constructor() {
    super();
    this.countDown = 2;
  }

  draw(gameContext) {
    this.comp.draw(gameContext.videoContext);
  }

  update(gameContext) {
    const { deltaTime } = gameContext;
    this.countDown -= deltaTime;
    if (this.countDown <= 0) {
      this.events.emit(Scene.EVENT_COMPLETE);
    }
  }
}
