class AnimatedPlant extends Plant {
  constructor({
    animation,
    attackSpeed = 600,
    ...rest
  }) {
    const defaultPlantAnimation = {
      [ObjectAction.idle]: gameMaster.spriteController.peaIdleAnimation,
      [ObjectAction.attack]: gameMaster.spriteController.peaAttackAnimation,
    };

    super(rest);

    this.animation = animation || defaultPlantAnimation;

    this.animationSpeed = .02;
    this.animatingIndex = 0;

    this.currentAction = ObjectAction.idle;

    this.attackSpeed = attackSpeed || 600;
    this.attackTimer = 0;
  }

  drawPlant() {
    push();

    const drawPosX = this.position.x;
    const drawPosY = this.position.y;

    const drawPlantX = drawPosX - (this.size / 2);
    const drawPlantY = drawPosY - (this.size / 2);

    fill('#1dd1a1');
    noStroke();
    arc(drawPosX - 8, drawPlantY + this.size / 1.3, this.size, this.size, 0, PI);

    noFill();
    const wAnime = this.animation[this.currentAction];

    this.animatingIndex += this.animationSpeed * 4;
    const animationIndex = floor(this.animatingIndex) % wAnime.length;

    if (this.currentAction === ObjectAction.attack && animationIndex >= wAnime.length - 2) {
      this.launchBullet();
    }

    image(wAnime[animationIndex], drawPlantX, drawPlantY, this.size, this.size);
    pop();
  }

  launchBullet() {
    if (millis() >= this.fireRate + this.timer) {
      this.setAnimation(ObjectAction.idle);
      if (!this.hasTarget) {
        return;
      }
      this.bullets.push(new Bullet({
        plant: this,
      }));

      this.timer = millis();
    }
  }

  shoot() {
    if (millis() >= this.fireRate + this.timer) {
      this.setAnimation(ObjectAction.attack);
    }
  }

  setAnimation(action) {
    if (this.currentAction === action) {
      return;
    }
    this.currentAction = action;
  }
}