class LongRangedPlant extends AnimatedPlant {
  constructor(params) {
    const customSize = 75;
    const customFireRate = 3;

    super({
      ...params,
      fireRate: customFireRate,
      range: GameMaster.config.rowLanes,
      size: customSize,
    });

    this.fireRate = customFireRate * 1000;
  }

  // drawPlant() {
  //   push();

  //   const drawPosX = this.position.x;
  //   const drawPosY = this.position.y;

  //   const drawPlantX = drawPosX - (this.size / 2);
  //   const drawPlantY = drawPosY - (this.size / 2);

  //   fill('#1dd1a1');
  //   noStroke();
  //   arc(drawPosX - 8, drawPlantY + this.size / 1.3, this.size, this.size, 0, PI);

  //   noFill();
  //   let wAnime;
  //   switch (this.currentAnimation) {
  //     case ObjectAction.idle:
  //       wAnime = gameMaster.peaIdleAnimation;
  //       break;
  //     case ObjectAction.attack:
  //       wAnime = gameMaster.peaAttackAnimation;
  //       break
  //     default:
  //       wAnime = gameMaster.peaIdleAnimation;
  //   }

  //   this.animatingIndex += this.animationSpeed * 4;
  //   const animationIndex = floor(this.animatingIndex) % wAnime.length;

  //   if (this.currentAnimation === ObjectAction.attack && animationIndex >= wAnime.length - 2) {
  //     this.launchBullet();
  //   }

  //   image(wAnime[animationIndex], drawPlantX, drawPlantY, this.size, this.size);
  //   pop();
  // }
}