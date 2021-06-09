import Entity from "./Entity.js";
import Player from "./traits/Player.js";
import PlayerController from "./traits/PlayerController.js";

export function* findPlayers(entities) {
  for (const entity of entities) {
    if (entity.hasTrait(Player)) {
      yield entity;
    }
  }
}

export function makePlayer(entity, name) {
  const player = new Player();
  player.name = name;

  entity.addTrait(player);
}

export function createPlayerEnv(playerEntity) {
  const playerEnv = new Entity();
  const playerControl = new PlayerController();
  playerControl.checkpoint.set(64, 64);
  playerControl.setPlayer(playerEntity);
  playerEnv.addTrait(playerControl);
  return playerEnv;
}
