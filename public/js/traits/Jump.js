import { Trait, Sides } from "../Entity.js";

export default class Jump extends Trait {
  constructor() {
    super("jump");
    this.ready = 0;
    this.duration = 0.3;
    this.velocity = 200;
    this.engageTime = 0;
    this.requestTime = 0;
    this.gracePeriod = 0.1;
    this.speedBoost = 0.3;
  }

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  obstruct(entity, side) {
    if (side === Sides.BOTTOM) {
      this.ready = 1;
    } else if (side === Sides.TOP) {
      this.cancel();
    }
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  update(entity, gameContext, level) {
    const { deltaTime } = gameContext;
    if (this.requestTime > 0 && this.ready > 0) {
      this.sounds.add("jump");
      this.engageTime = this.duration;
      this.requestTime = 0;
    }

    this.requestTime -= deltaTime;

    if (this.engageTime > 0) {
      entity.vel.y = -(
        this.velocity +
        Math.abs(entity.vel.x) * this.speedBoost
      );
      this.engageTime -= deltaTime;
    }

    this.ready -= 1;
  }
}
