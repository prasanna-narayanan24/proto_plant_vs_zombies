class Bullet {
  constructor({
    plant,
    speed = 10,
    size = 25,
    colorPalette = GameMaster.config.bulletColorPalette.normal,
  }) {
    this.position = plant.position.copy();
    this.attack = plant.attack;
    this.speed = speed;
    this.size = size;

    this.isExpired = false;

    /** @type {Bug[]} */
    this.bulletParticles = [];

    this.colorPalette = colorPalette;
  }

  isDead() {
    if (this.isExpired) {
      return true;
    }
    return this.position.x >= dimensions.game.endX;
  }

  hitObstacle(obstacles) {
    for (let i = 0; i < obstacles.length; i++) {
      const target = obstacles[i];
      if (target?.isDying) {
        continue;
      }

      const d = dist(this.position.x, this.position.y, target.position.x, target.position.y)
      if (d < target.size / 2) {
        this.isExpired = true;
        target.hurt(this.attack);
      }
    }
  }

  render() {
    // fill('#fff');
    // ellipse(this.position.x, this.position.y, this.size);

    for (let i = this.bulletParticles.length - 1; i >= 0; i--) {
      const bulletParticle = this.bulletParticles[i];
      bulletParticle.render({ position: this.position.copy(), size: this.size });

      if (bulletParticle.radius <= 0) {
        this.bulletParticles.splice(i, 1)
      }
    }

    this.position.add(this.speed, 0);
    this.hitObstacle(gameMaster.zombies);

    this.bulletParticles.push(new BulletParticle({
      radius: random(5, this.size),
      colorPalette: this.colorPalette,
    }));
  }
}


class BulletParticle {
  constructor({ position, radius, colorPalette }) {
    this.position = position;
    this.radius = radius;
    this.colorPalette = colorPalette || GameMaster.config.bulletColorPalette.normal;
  }

  render({ position, size }) {
    noStroke();

    const color = random(this.colorPalette);
    fill(color);

    position.x += random(-10, 2) + this.radius - random([-3, -1, 1, 3]);
    position.y -= random([-.3, -.1, .1, .3]) * (size - this.radius);

    ellipse(position.x, position.y, this.radius);
    this.shrink();
  }

  shrink() {
    // shrink size over time
    this.radius -= 0.4;
  }

}