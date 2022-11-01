class Attack {
  constructor({
    damage,
    baseDamage = 25,
    isPureDamage = false,
  }) {
    this.damage = damage;

    this.baseDamage = baseDamage;
    this.isPureDamage = isPureDamage;
  }
}