let canvasWidth = 800;
let canvasHeight = 400;
const dimensions = {
  game: {
    w: 400,
    h: 400,
    x: 100,
    y: 0,
    endX: 400,
    endY: 0,
  },

  shop: {
    w: 100,
    h: 400,
    x: 0,
    y: 0,
    endX: 100,
    endY: 400,
  }
}

let bgColor = '#ff00ff';


class ObjectAction {
  static idle = 'idle';

  static walk = 'walk';
  static attack = 'attack';

  static hurt = 'hurt';
  static die = 'die';

  static run = 'run';
}

function preload() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  dimensions.shop.w = canvasWidth * .2;
  dimensions.shop.h = canvasHeight;
  dimensions.shop.endX = dimensions.shop.w;
  dimensions.shop.endY = dimensions.shop.y + dimensions.shop.h;

  dimensions.game.w = canvasWidth * .8;
  dimensions.game.h = canvasHeight;
  dimensions.game.x = dimensions.shop.w;
  dimensions.game.endX = dimensions.game.x + dimensions.game.w;

  gameMaster.preload();
}

function keyPressed() {
  if (keyCode === 32) {
    noLoop();
  }

  if (keyCode === 65) {
    gameMaster.selectPlant(GameMaster.config.plantTypes.normal);
  }

  if (keyCode === 83) {
    gameMaster.selectPlant(GameMaster.config.plantTypes.ranged);
  }

  if (keyCode === 68) {
    gameMaster.selectPlant(GameMaster.config.plantTypes.armoured);
  }

  if (keyCode === 87) {
    gameMaster.selectPlant(GameMaster.config.plantTypes.angry);
  }
}

function mousePressed() {
  for (let i = 0; i < GameMaster.config.rowLanes; i++) {
    for (let j = 0; j < GameMaster.config.columnLanes; j++) {
      const colLane = gameMaster.lanes[i][j];
      colLane.clicked();
    }
  }
}

function setup() {
  createCanvas(canvasWidth, canvasHeight)
  gameMaster.load();

  gameMaster.shop.showMenu();
}

/** This function redraws the sketch multiple times a second. */
function draw() {
  gameMaster.runGameEngine();
  
  const { zombies, plants, lanes } = gameMaster;


  // draw lanes
  for (let i = 0; i < lanes.length; i++) {
    for (let j = 0; j < lanes[i].length; j++) {
      const lane = lanes[i][j];
      lane.render();
    }
  }

  // traversing backwards solves the flicker issue
  for (let i = zombies.length - 1; i > -1; i--) {
    const zombie = zombies[i];
    zombie.render();
    gameMaster.destroyZombie(i);
  }

  // define plant attributes
  for (let i = plants.length - 1; i >= 0; i--) {
    const plant = plants[i];
    plant.render();
    gameMaster.destroyPlant(i);
  }

  gameMaster.spawnZombieWave();

  fill(0)
  textSize(18);
  text(frameCount / millis() * 1000, canvasWidth - 60, 40);

  gameMaster.shop.render();

  // place plant

  // create bullets

  // define enemy attributes

  // place enemies

  // see enemy is hit by the bullets

  // tune the game logic
}
