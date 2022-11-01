class Lane {
  constructor({ x, y, width, height, laneId, suffix = 'idk', alternate }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.suffix = suffix;
    this.alternate = alternate;

    this.id = laneId;

    const { grassSprites } = gameMaster.spriteController;

    let randomIndex = floor(random(grassSprites.length / 2, grassSprites.length));
    if (alternate) {
      randomIndex = floor(random(0, grassSprites.length / 2))
    }
    this.spriteIndex = randomIndex;
  }

  clicked() {
    const isInRange = this.mouseInRange();
    if (isInRange) {
      this.placePlant();
    }
  }

  mouseInRange() {
    const tileWideRange = this.x + this.width;
    const tileHeightRange = this.y + this.height;

    const isInRange = mouseX > this.x && mouseX < tileWideRange && mouseY > this.y && mouseY < tileHeightRange;
    return isInRange;
  }

  render() {
    const isOccupied = this.isPlantPlaced();
    const isHovered = this.mouseInRange();

    // strokeWeight(2);
    // ellipse(this.x + this.width, this.y, 34);

    // this._logAttributes();

    // rect(this.x, this.y, this.width, this.height);

    const { grassSprites } = gameMaster.spriteController;
    image(grassSprites[this.spriteIndex], this.x, this.y, this.width, this.height);

    // strokeWeight(4);
    // stroke('#028460');
    // line(this.x, this.y + this.height, this.x + this.width, this.y + this.height);
    // line(this.x + this.width, this.y, this.x + this.width, this.y + this.height);

    noStroke();
    if (isHovered && !isOccupied) {
      fill('#ff6b6b');
    }
  }

  isPlantPlaced() {
    return gameMaster.plants.some(p => p.lane.suffix === this.suffix);
  }

  placePlant() {
    const isPlaced = this.isPlantPlaced()
    if (isPlaced) {
      return;
    }

    const plant = gameMaster.getPlantForType(this);

    if (!plant) {
      return;
    }
    gameMaster.plants.push(plant);
  }

  _logAttributes() {
    console.group("Lane");
    console.log(this.suffix + '_mouseX :>> ', mouseX);
    console.log(this.suffix + '_mouseY :>> ', mouseY);
    console.log(this.suffix + '_tileWideRange :>> ', tileWideRange);
    console.log(this.suffix + '_tileHeightRange :>> ', tileHeightRange);
    console.log(this.suffix + '_this.x :>> ', this.x);
    console.log(this.suffix + '_this.y :>> ', this.y);
    console.log(this.suffix + '_isHovered :>> ', isHovered);
    console.groupEnd("Lane");
  }


  static columnLanes = 5;

  static createLanes() {
    const lanes = [];
    const laneDimension = this.getLaneDimensions();
    const { width: laneWidth, height: laneHeight } = laneDimension;

    for (let i = 0; i < GameMaster.config.rowLanes; i++) {
      const rowLane = [];
      for (let j = 0; j < GameMaster.config.columnLanes; j++) {
        rowLane.push(
          new Lane({
            x: laneWidth * i + dimensions.game.x,
            y: laneHeight * j + + dimensions.game.y,
            width: laneWidth,
            height: laneHeight,
            laneId: j,
            alternate: (i + j) & 1,
            suffix: 'row_' + i + '_column_' + j,
          })
        )
      }

      lanes.push(rowLane);
    }

    gameMaster.lanes = lanes;
  }

  static getLaneDimensions() {
    const laneWidth = dimensions.game.w / GameMaster.config.rowLanes;
    const laneHeight = dimensions.game.h / GameMaster.config.columnLanes;

    return { width: laneWidth, height: laneHeight };
  }
}