class OldZombie extends Zombie {
  constructor(params) {
    super({
      ...params,
      damage: GameMaster.config.basic.zombie.damage,
      health: GameMaster.config.basic.zombie.health,
      armour: GameMaster.config.basic.zombie.armour,
      movementSpeed: GameMaster.config.basic.zombie.movementSpeed,
      attackSpeed: GameMaster.config.basic.zombie.attackSpeed,
      size: GameMaster.config.basic.zombie.size,
      animations: {
        [ObjectAction.walk]: gameMaster.spriteController.oldZombieWalkAnimations,
        [ObjectAction.attack]: gameMaster.spriteController.oldZombieAttackAnimations,
        [ObjectAction.die]: gameMaster.spriteController.oldZombieDieAnimations,
      }
    })
    this.currentAnimation = ObjectAction.walk;

    this.isRaged = false;
  }

  render() {
    super.render();

    if(!this.isRaged && this.health < 900) {
      this.animations[ObjectAction.walk] = gameMaster.spriteController.oldZombieRunAnimations;
      this.movementSpeed += 2;
      this.attackSpeed *= 2;

      this.isRaged = true;
    }
  }
}