let zombieTimer, zombieInterval;

class ZombieType {
  static Melee = 'Melee';
  static Ranged = 'Ranged';
}

class Zombie {
  constructor({
    lane,
    type = ZombieType.Melee,
    health = floor(GameMaster.config.basic.zombie.health / 1.5),
    range = 0,
    armour = floor(GameMaster.config.basic.zombie.armour / 1.5),
    movementSpeed = GameMaster.config.basic.zombie.movementSpeed * 2,
    attackSpeed = GameMaster.config.basic.zombie.attackSpeed * 2,
    size = floor(GameMaster.config.basic.zombie.size / 1.3),
    attack,
    damage = GameMaster.config.basic.zombie.damage / 1.5,

    animations,
  }) {
    this.lane = lane
    this.position = Zombie.computeZombiePosition(lane, 40);
    this.size = map(size, 0, lane.height, 0, lane.height);

    this.health = health;

    if (attack) {
      this.attack = attack;
    } else {
      this.attack = new Attack({ damage })
    }

    if (type === ZombieType.Melee) {
      this.range = 0;
    } else {
      this.range = range;
    }
    this.armour = armour;

    this.movementSpeed = movementSpeed;
    this.target;

    this.attackSpeed = attackSpeed;
    this.attackTimer = 0;

    this.animatingIndex = 0;
    this.animationSpeed = movementSpeed / 100;

    this.healthBar = new HealthBar({
      maxHealth: health,
      targetPosition: this.position,
      barWidth: this.size * 1.5,
      barHeight: 12,
    });

    this.currentAnimation = ObjectAction.walk;
    this.isDying = false;

    if (!animations) {
      this.animations = {
        [ObjectAction.walk]: gameMaster.spriteController.zombieWalkAnimations,
        [ObjectAction.attack]: gameMaster.spriteController.zombieAttackAnimations,
        [ObjectAction.die]: gameMaster.spriteController.zombieDieAnimations,
      }
    } else {
      this.animations = animations;
    }
  }

  show() {
    // push();
    // translate(this.position.x, this.position.y);

    push();
    scale(-1, 1)

    let wAnime = this.animations[this.currentAnimation] || gameMaster.spriteController.zombieWalkAnimations;
    // switch (this.currentAnimation) {
    //   case ObjectAction.attack:
    //     wAnime = gameMaster.spriteController.zombieAttackAnimations;
    //     break;
    //   case ObjectAction.die:
    //     wAnime = gameMaster.spriteController.zombieDieAnimations;
    //     break;
    //   default:
    //     wAnime = gameMaster.spriteController.zombieWalkAnimations;
    // }

    const drawPosX = this.position.x + (this.size / 2);
    const drawPosY = this.position.y - (this.size / 2);

    this.animatingIndex += this.animationSpeed * 15;
    const animationIndex = floor(this.animatingIndex) % wAnime.length;

    if (this.currentAnimation === ObjectAction.attack && animationIndex === 0) {
      this.hit();
    }

    if (this.currentAnimation === ObjectAction.die && animationIndex >= wAnime.length - 1) {
      this.isDying = false;
    }

    image(wAnime[animationIndex], -drawPosX, drawPosY, this.size, this.size);
    pop();
  }

  render() {
    if (this.target && this.target.isDead()) {
      this.target = null;
    }

    this.show();
    // actions and accelerations
    if (this.isDying || this.currentAnimation === ObjectAction.die) {
      return;
    }

    this.searchObstacle(gameMaster.plants)
    this.healthBar.render({
      target: this,
    });

    if (!this.target) {
      this.position.sub(this.movementSpeed, 0);

      if (this.currentAnimation !== ObjectAction.walk) {
        this.setAnimation(ObjectAction.walk);
      }
    } else {
      this.attackTarget()
    }
  }

  /**
   * @param {Attack} otherAttack 
   */
  hurt(otherAttack) {
    let dealingDamage = otherAttack.damage - this.armour;
    if (otherAttack.isPureDamage) {
      dealingDamage = otherAttack.damage;
    }

    if (dealingDamage < 0) {
      dealingDamage = otherAttack.baseDamage;
    }

    this.health = max(0, this.health - dealingDamage);
  }

  hit() {
    if (millis() >= this.attackSpeed + this.attackTimer) {
      this.attackTimer = millis();
      this.target.hurt(this.attack);
    }
  }

  attackTarget() {
    this.setAnimation(ObjectAction.attack);
    // gameMaster.attack(this, this.target);
  }

  isDead() {
    if(this.isDying) {
      return false;
    }

    if (this.health <= 0) {
      if (this.currentAnimation !== ObjectAction.die) {
        this.isDying = true;
        this.setAnimation(ObjectAction.die);
        return false;
      }
      return true;
    }

    return this.position.x <= dimensions.game.x;
  }

  setAnimation(action) {
    this.currentAnimation = action;
    // if (millis() >= 500 + this.attackTimer) {
    // }
  }

  searchObstacle(obstacles) {
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obstacle = obstacles[i];
      if (!obstacle) {
        continue;
      }

      if (!obstacle.position) {
        continue;
      }


      const d = dist(this.position.x, this.position.y, obstacle.position.x, obstacle.position.y)
      if (d <= this.range + this.size) {
        this.target = obstacle;
        // break;
      }
    }
  }

  static computeZombiePosition(lane) {
    const x = canvasWidth - 50;
    const y = lane.y + (lane.height / 2);

    return createVector(x, y);
  }

  static spawnZombieWave() {
    const lanes = gameMaster.lanes[0].length;

    const allTypesOfZombies = Object.values(GameMaster.config.zombieTypes);
    const zombieType = random(allTypesOfZombies);

    const spawningLane = gameMaster.lanes[0][floor(random(lanes))];

    let nextZombie;
    switch (zombieType) {
      case GameMaster.config.zombieTypes.old:
        nextZombie = new OldZombie({ lane: spawningLane })
        break
      default:
        nextZombie = new Zombie({ lane: spawningLane })
        break;
    }

    gameMaster.zombies.push(nextZombie);
  }
}