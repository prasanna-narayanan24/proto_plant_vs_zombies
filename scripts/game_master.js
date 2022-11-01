function padInt(n) {
  if (n > 9) {
    return `${n}`;
  }

  return `0${n}`;
}

class GameMaster {

  static config = {
    rowLanes: 8,
    columnLanes: 5,

    basic: {
      zombie: {
        health: 900,
        armour: 10,
        movementSpeed: .3,
        attackSpeed: 200,
        size: 60,
        damage: 200,
      },
      plant: {},
      bullet: {},
    },

    plantTypes: {
      normal: 'Normal',
      ranged: 'p_Ranged',
      armoured: 'Armoured',
      angry: 'p_Angry',
      bomb: 'p_Bomb',
    },

    zombieTypes: {
      child: 'child',
      old: 'old',
    },

    bulletColorPalette: {
      water: ['#55DFB8', '#55C1DF', '#55DF73'],
      fire: ['#FBB741', '#E2FB41', '#FB5A41'],
      normal: ['#D4C964', '#A7D464', '#7FD464'],
    }
  }

  constructor() {
    /** @type {Zombie[]} */
    this.zombies = [];


    /** @type {Lane[][]} */
    this.lanes = [];

    /** @type {Plant[]} */
    this.plants = [];

    this.plantType = GameMaster.config.plantTypes.angry;

    /** @type {SpriteMaster} */
    this.spriteController = new SpriteMaster();

    this.zombieSpawnTimer = 0;

    this.shop = new Shop();
    this.wallet = new Wallet();

    this.walletCreditTimer = 0;
  }

  preload() {
    this.spriteController.load();
  }

  load() {
    Lane.createLanes();
    Zombie.spawnZombieWave();
  }

  runGameEngine() {
    if(millis() > 2000 + this.walletCreditTimer) {
      this.walletCreditTimer = millis();
      this.wallet.deposit(5 * this.zombies.length);
    }
  }

  destroyPlant(index) {
    const plant = this.plants[index];

    if (!plant.isDead()) {
      return;
    }
    this.plants.splice(index, 1)
  }

  destroyZombie(index) {
    const zombie = this.zombies[index];
    if (!zombie.isDead()) {
      return;
    }

    if (zombie.isDying) {
      return;
    }

    this.zombies.splice(index, 1)
  }

  attack(sourceA, sourceB) {
    if (millis() >= sourceA.attackSpeed + sourceA.attackTimer) {
      sourceB.hurt(sourceA.attack);
      sourceA.attackTimer = millis();
    }
  }

  selectPlant(plant) {
    this.plantType = plant;
  }

  getPlantForType(lane) {
    if(!this.purchaseItem()) {
      // failed
      return;
    }

    switch (this.plantType) {
      case GameMaster.config.plantTypes.normal:
        return new Plant({ lane: lane });
      case GameMaster.config.plantTypes.armoured:
        return new ArmouredPlant({ lane: lane });
      case GameMaster.config.plantTypes.ranged:
        return new LongRangedPlant({ lane: lane });
      case GameMaster.config.plantTypes.angry:
        return new AngryPlant({ lane: lane });
      default:
        return new Plant({ lane: lane });
    }
  }

  // shop logic

  purchaseItem() {
    const shopItem = this.shop.selectedItem;
    if(!shopItem) {
      return;
    }

    const isPurchased = this.wallet.withdraw(shopItem.cost);
    if(!isPurchased) {
      console.log("Not enough credits");
      // play sound
      return false;
    }

    shopItem.markPurchased();
    this.selectPlant(shopItem.identifier);

    return true;
  }

  // spawner logic
  spawnZombieWave() {
    if(millis() > 5000 + this.zombieSpawnTimer) {
      this.zombieSpawnTimer = millis();
      const zombieCount = floor(random(1, 2));
      for(let i = 0; i < 1; i++) {
        Zombie.spawnZombieWave();
      }
    }
  }
};

const gameMaster = new GameMaster();
