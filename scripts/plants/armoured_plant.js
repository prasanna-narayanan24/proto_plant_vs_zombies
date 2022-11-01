class ArmouredPlant extends Plant {
  constructor(params) {
    super({
      ...params,
      fireRate: 0,
      armour: 200,
      size: 120,
      health: 600,
    });

    const { width } = Lane.getLaneDimensions();

    this.healthBar = new HealthBar({
      maxHealth: 600,
      barWidth: width / 2,
      barHeight: 16,
    })
  }

  drawPlant() {
    push();

    scale(-1, 1)
    const height = this.size + random(0, 20) * .1;

    const drawPosX = this.position.x + (this.size / 2);
    const drawPosY = this.position.y - (height / 2);

    image(gameMaster.spriteController.fenceSprite, -drawPosX, drawPosY, this.size, height);

    pop();
    this.healthBar.render({ target: this });
  }

  searchEnemy() {
    return null;
  }
}