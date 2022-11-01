const mediumHealthColor = '#FFFF00';
const goodHealthColor = '#00FF00';
const lowHealthColor = '#FF0000';

class HealthBar {
  constructor({
    maxHealth,
    barWidth = 100,
    barHeight = 20,
  }) {

    this.maxHealth = maxHealth;

    this.barWidth = barWidth;
    this.barHeight = barHeight - 4; // reducing the stroke width
  }

  render({ target }) {
    const position = HealthBar.computeFromTarget(target, this.barWidth);

    let fillColor = goodHealthColor;
    if(this.maxHealth * .25 >= target.health) {
      fillColor = lowHealthColor;
    } else if(this.maxHealth * .75 >= target.health) {
      fillColor = mediumHealthColor;
    }

    push();
    // outer bar
    stroke(0);
    strokeWeight(4);
    noFill();
    rect(position.x, position.y, this.barWidth, this.barHeight);

    // inner bar
    noStroke();
    fill(fillColor);
    rect(position.x, position.y, map(target.health, 0, this.maxHealth, 0, this.barWidth), this.barHeight)
    text(target.health.toString(), position.x, position.y)

    pop();
  }

  static computeFromTarget(target, barWidth) {
    const x = target.position.x - (barWidth / 2);
    const y = target.position.y + (target.size / 2);

    return createVector(x, y);
  }
}