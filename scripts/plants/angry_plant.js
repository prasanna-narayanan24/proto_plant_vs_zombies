class AngryPlant extends AnimatedPlant {

  constructor(params) {
    super({
      ...params,
      range: 0,
      attackSpeed: 300,
      damage: 150,
    });

    this.sprite = gameMaster.spriteController.angryPlantSprite;

    this.stemHeight = this.size;
    this.stemWidth = this.size / 2;

    const stemX = this.position.x - this.stemWidth / 2;
    const stemY = this.position.y;

    this.stemPosition = createVector(stemX, stemY);
    this.headPosition = createVector(-(stemX + this.size - this.stemWidth / 2), stemY - this.stemHeight / 2);

    this.leftLeafPosition = createVector(stemX - 8, stemY + this.stemHeight / 2);
    this.rightLeafPosition = createVector(stemX + this.stemWidth, stemY + this.stemHeight / 2);

    this.headVelocity = createVector(0, 0);

    this.headSprites = [this.sprite.idleHeadSprite, this.sprite.attackHeadSprite];
    this.showingHeadIndex = 0;
    this.headAnimationTimer = 0;

    this.decelerate = false;
  }

  drawPlant() {
    if(!this.hasTarget) {
      this.setAnimation(ObjectAction.idle);
    }

    image(this.sprite.stemSprite, this.stemPosition.x, this.stemPosition.y, this.stemWidth, this.stemHeight);

    push();
    scale(-1, 1);

    const showingHeadSprite = this.headSprites[this.showingHeadIndex];

    let headPosX = this.headPosition.x;
    if (this.currentAction === ObjectAction.attack) {
      headPosX -= 5;
    }
    image(showingHeadSprite, headPosX, this.headPosition.y, this.size, this.size);
    pop()
    image(this.sprite.leftLeafSprite, this.leftLeafPosition.x, this.leftLeafPosition.y, 10, 10);

    image(this.sprite.rightLeafSprite, this.rightLeafPosition.x, this.rightLeafPosition.y, 10, 10);

    this.animate();
  }


  shoot() {
    if (this.firstTarget) {
      this.setAnimation(ObjectAction.attack);
      this.attackEnemy(this.firstTarget);
      this.firstTarget = null;
    }
  }

  attackEnemy(target) {
    gameMaster.attack(this, target);
    this.firstTarget = null;
  }

  animate() {
    const force = this.animationSpeed;
    if (this.currentAction === ObjectAction.attack) {
      if (millis() >= 500 + this.headAnimationTimer) {
        this.showingHeadIndex = (this.showingHeadIndex + 1) % this.headSprites.length;
        this.headAnimationTimer = millis();
      }
    }

    if (this.currentAction === ObjectAction.idle) {
      this.showingHeadIndex = 0;
    }

    this.headVelocity.add(createVector(0, force * !this.decelerate ? -1 : 1));

    const upperCap = this.stemPosition.y - this.stemHeight / 2 - 10;
    const lowerCap = this.stemPosition.y - this.size + this.stemHeight / 2;

    if (!this.decelerate && this.headPosition.y < upperCap) {
      this.decelerate = true;
    }

    if (this.decelerate && this.headPosition.y > lowerCap) {
      this.decelerate = false;
    }

    this.headPosition.add(this.headVelocity);
    this.headVelocity.mult(0);
  }
}