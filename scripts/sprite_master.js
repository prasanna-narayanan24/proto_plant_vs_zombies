class AngryPlantSprite {
  constructor({
    idleHeadSprite,
    attackHeadSprite,

    leftLeafSprite,
    rightLeafSprite,

    stemSprite,

  }) {
    this.currentAnimation = 'idle';

    this.idleHeadSprite = idleHeadSprite;
    this.attackHeadSprite = attackHeadSprite;

    this.leftLeafSprite = leftLeafSprite;
    this.rightLeafSprite = rightLeafSprite;

    this.stemSprite = stemSprite;
  }

  setIdleHeadSprite(sprite) {
    this.idleHeadSprite = sprite;
  }

  setAttackHeadSprite(sprite) {
    this.attackHeadSprite = sprite;
  }

  setLeftLeafSprite(sprite) {
    this.leftLeafSprite = sprite;
  }

  setRightLeafSprite(sprite) {
    this.rightLeafSprite = sprite;
  }

  setStemSprite(sprite) {
    this.stemSprite = sprite;
  }
}

class SpriteMaster {
  constructor() {
    /** -- ANIMATIONS -- */

    // Zombies
    this.zombieWalkAnimations = [];
    this.zombieAttackAnimations = [];
    this.zombieDieAnimations = [];

    this.oldZombieWalkAnimations = [];
    this.oldZombieAttackAnimations = [];
    this.oldZombieDieAnimations = [];
    this.oldZombieRunAnimations = [];

    // plants
    this.peaIdleAnimation = [];
    this.peaAttackAnimation = [];

    this.angryPlantSprite = new AngryPlantSprite({});

    // grass
    this.grassSprites = [];

    // fence
    this.fenceSprite = null;
  }

  load() {
    // load zombie animations
    this.loadZombieAnimations();

    // load plant animations
    this.loadPlantAnimations();

    // load grass
    this.loadGrassSprites();

    // load fence
    this.loadFence();
  }

  loadFence() {
    loadImage('assets/plants/fence.png', sprite => {
      this.fenceSprite = sprite;
    });
  }

  loadGrassSprites() {
    loadImage("assets/grass/grass_tile.png", sprite => {
      const spriteDividend = 210;
      const totalRows = floor(sprite.width / spriteDividend);
      const totalCols = floor(sprite.height / spriteDividend);

      for (let i = 0; i < totalRows; i++) {
        this.grassSprites.push(sprite.get(i * spriteDividend, 0, spriteDividend, spriteDividend));
      }

      for (let i = 0; i < totalCols; i++) {
        this.grassSprites.push(sprite.get(0, i * spriteDividend, spriteDividend, spriteDividend));
      }
    })
  }

  loadPlantAnimations() {
    loadImage("assets/plants/plant_sprite_2.png", sprite => {

      for (let i = 0; i < 8; i++) {
        const { x, y, w, h } = idleJson[i];
        this.peaIdleAnimation.push(sprite.get(x, y, w, h));
      }

      for (let i = 0; i < 8; i++) {
        const { x, y, w, h } = attackAnimationJson[i];
        this.peaAttackAnimation.push(sprite.get(x, y, w, h));
      }
    });


    loadImage("assets/plants/zombie_plants/idle_head.png", sprite => {
      this.angryPlantSprite.setIdleHeadSprite(sprite);
    });

    loadImage("assets/plants/zombie_plants/attack_head.png", sprite => {
      this.angryPlantSprite.setAttackHeadSprite(sprite);
    });

    loadImage("assets/plants/zombie_plants/plant_stem.png", sprite => {
      this.angryPlantSprite.setStemSprite(sprite);
    });

    loadImage("assets/plants/zombie_plants/left_leaf.png", sprite => {
      this.angryPlantSprite.setLeftLeafSprite(sprite);
    });
    
    loadImage("assets/plants/zombie_plants/right_leaf.png", sprite => {
      this.angryPlantSprite.setRightLeafSprite(sprite);
    });
  }

  loadZombieAnimations() {
    for (let i = 0; i <= 7; i++) {
      this.zombieWalkAnimations.push(loadImage(`assets/zombies/child_zombie/walk/Zombie01_Walk_00${i}.png`));
    }

    for (let i = 0; i <= 11; i++) {
      const fileNumber = padInt(i);
      this.zombieAttackAnimations.push(loadImage(`assets/zombies/child_zombie/attack/Zombie01_Attack_0${fileNumber}.png`));
    }

    for (let i = 0; i <= 7; i++) {
      const fileNumber = padInt(i);
      this.zombieDieAnimations.push(loadImage(`assets/zombies/child_zombie/die/Zombie01_Die_0${fileNumber}.png`));
    }


    // old zombie
    for(let i = 1; i <= 6; i++) {
      this.oldZombieAttackAnimations.push(loadImage(`assets/zombies/old_zombie/attack/Attack${i}.png`))
    }

    for(let i = 1; i <= 6; i++) {
      this.oldZombieWalkAnimations.push(loadImage(`assets/zombies/old_zombie/walk/Walk${i}.png`))
    }

    for(let i = 1; i <= 8; i++) {
      this.oldZombieDieAnimations.push(loadImage(`assets/zombies/old_zombie/die/Dead${i}.png`))
    }

    for(let i = 1; i <= 10; i++) {
      this.oldZombieRunAnimations.push(loadImage(`assets/zombies/old_zombie/run/Run${i}.png`))
    }
  }
}