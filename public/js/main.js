import Timer from "./Timer.js";
import { makePlayer, createPlayerEnv, findPlayers } from "./player.js";
import { createLevelLoader } from "./loaders/level.js";
import { loadFont } from "./loaders/font.js";
import { loadEntities } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers/collision.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import SceneRunner from "./SceneRunner.js";
import { createPlayerProgressLayer } from "./layers/player-progress.js";
import TimedScene from "./TimedScene.js";
import { createColorLayer } from "./layers/color.js";
import { createTextLayer } from "./layers/text.js";
import Level from "./Level.js";
import Scene from "./Scene.js";

async function main(canvas) {
  const videoContext = canvas.getContext("2d");
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = await createLevelLoader(entityFactory);
  const sceneRunner = new SceneRunner();
  const mario = entityFactory.mario();
  makePlayer(mario, "MARIO");

  window.mario = mario;

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  async function runLevel(name) {
    const loadScreen = new Scene();
    loadScreen.comp.layers.push(createColorLayer("#000"));
    loadScreen.comp.layers.push(createTextLayer(font, `LOADING ${name}...`));
    sceneRunner.addScene(loadScreen);
    sceneRunner.runNext();

    const level = await loadLevel(name);

    level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
      if (spec.type === "goto") {
        for (const _ of findPlayers(touches)) {
          runLevel(spec.name);
          return;
        }
      }
    });

    const collisionLayer = createCollisionLayer(level);
    const dashboardLayer = createDashboardLayer(font, level);
    const playerProgressLayer = createPlayerProgressLayer(font, level);

    mario.pos.set(0, 0);
    level.entities.add(mario);

    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);

    const waitScreen = new TimedScene();
    waitScreen.countDown = 2;
    waitScreen.comp.layers.push(createColorLayer("#000"));
    waitScreen.comp.layers.push(dashboardLayer);
    waitScreen.comp.layers.push(playerProgressLayer);

    level.comp.layers.push(collisionLayer);
    level.comp.layers.push(dashboardLayer);

    sceneRunner.addScene(waitScreen);
    sceneRunner.addScene(level);

    sceneRunner.runNext();
  }

  const gameContext = {
    audioContext,
    videoContext,
    deltaTime: null,
    entityFactory,
  };

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  };

  timer.start();
  // USE UPPERCASE
  // runLevel("DEBUG-PROGRESSION");
  runLevel("1-1");
}

const start = () => {
  main(canvas);
};

const canvas = document.getElementById("screen");
window.addEventListener("click", start, { once: true });
