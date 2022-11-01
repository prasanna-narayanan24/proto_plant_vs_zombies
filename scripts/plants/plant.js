class Plant {

  constructor({
    lane,
    range = 3,
    fireRate = 0.5, // 2 bullet per second
    health = 300,
    armour = 0,
    damage = 100,
    cost = 100, // can be ignored
    size = 50,
    attack,
  }) {
    this.lane = lane;

    this.position = Plant.computePlantPosition(lane, size);
    this.range = range;
    this.fireRate = fireRate * 1000;
    this.health = health;
    this.armour = armour;
    this, cost = cost;
    this.size = map(size, 0, lane.height, 0, lane.height - 32);
    
    if(attack) {
      this.attack = attack;
    } else {
      this.attack = new Attack({ damage })
    }

    /** @type {Bullet[]} */
    this.bullets = [];

    this.timer = 0;

    this.firstTarget;

    this.healthBar = new HealthBar({
      maxHealth: this.health,
      barHeight: 16,
      barWidth: this.size * 2,
    });
  }

  isDead() {
    return this.health <= 0;
  }

  /**
   * @param {Attack} otherAttack 
   */
  hurt(otherAttack) {
    let dealingDamage = otherAttack.damage - this.armour;
    if(otherAttack.isPureDamage) {
      dealingDamage = otherAttack.damage;
    }

    if(dealingDamage <= 0) {
      dealingDamage = otherAttack.baseDamage;
    }

    this.health = max(0, this.health - dealingDamage);
  }

  searchEnemy() {
    this.acquireTarget();

    if(this.hasTarget) {
      this.shoot();
    }
  }

  shoot() {
    if (millis() >= this.fireRate + this.timer) {
      this.bullets.push(new Bullet({
        plant: this,
        colorPalette: GameMaster.config.bulletColorPalette.fire,
      }));

      this.timer = millis();
    }
  }

  acquireTarget() {
    const { zombies } = gameMaster;
    if (zombies.length < 1) {
      this.hasTarget = false;
    }

    const someZombies = zombies.some(z => {
      if (z.isDying) {
        return false;
      }
      if (z.lane.id !== this.lane.id) {
        return false;
      }
      const d = dist(z.position.x, z.position.y, this.position.x, this.position.y)
      const range = (this.lane.width * this.range) + this.lane.width / 2;

      constrain(range, 0, dimensions.game.w);
      const inRange = d < range;

      if(inRange && !this.firstTarget) {
        this.firstTarget = z;
      }
      return inRange;
    })

    this.hasTarget = someZombies;
  }

  drawPlant() {
    fill('#01a3a4');
    stroke(0);
    ellipse(this.position.x, this.position.y, this.size, this.size);
    ellipse(this.position.x + this.size / 2, this.position.y, this.size / 2, this.size / 2);
  }

  render() {
    // this.healthBar.render({ target: this })
    this.drawPlant()
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].render();

      if (this.bullets[i].isDead()) {
        this.bullets.splice(i, 1);
      }
    }

    this.searchEnemy();
  }

  static computePlantPosition(lane) {
    const x = (lane.x * 2 + lane.width) / 2;
    const y = (lane.y + lane.height / 2);

    return createVector(x, y);
  }
}