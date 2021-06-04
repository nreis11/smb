import Timer from "./Timer.js";
import { createPlayer, createPlayerEnv } from "./player.js";
import { createLevelLoader } from "./loaders/level.js";
import { loadFont } from "./loaders/font.js";
import { loadEntities } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers/collision.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import SceneRunner from "./SceneRunner.js";

async function main(canvas) {
  const videoContext = canvas.getContext("2d");
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = await createLevelLoader(entityFactory);

  const sceneRunner = new SceneRunner();

  const level = await loadLevel("1-2");
  const mario = createPlayer(entityFactory.mario());
  mario.player.name = "MARIO";

  level.entities.add(mario);

  const playerEnv = createPlayerEnv(mario);
  level.entities.add(playerEnv);

  level.comp.layers.push(createCollisionLayer(level));
  level.comp.layers.push(createDashboardLayer(font, level));

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  sceneRunner.addScene(level);

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
  sceneRunner.runNext();
}

const start = () => {
  window.removeEventListener("click", start);
  main(canvas);
};

const canvas = document.getElementById("screen");
window.addEventListener("click", start);
