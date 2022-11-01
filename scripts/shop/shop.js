function subtractSeconds(date, seconds) {
  const dateCopy = new Date(date);
  dateCopy.setSeconds(date.getSeconds() - seconds);
  return dateCopy;
}

function addSeconds(date, seconds) {
  const dateCopy = new Date(date);
  dateCopy.setSeconds(date.getSeconds() + seconds);
  return dateCopy;
}

class ShopItem {
  constructor({
    cost,
    name,
    identifier,
    stockInTime,
  }) {

    this.cost = cost;
    this.name = name;
    this.identifier = identifier;
    this.stockInTime = stockInTime;

    /** @type {Date} */
    this.lastPurchasedAt = null;
  }


  isStocking() {
    if (this.lastPurchasedAt != null) {
      const nextEligibleTime = addSeconds(this.lastPurchasedAt, this.stockInTime);
      return nextEligibleTime <= new Date();
    }

    return false;
  }


  markPurchased() {
    this.lastPurchasedAt = new Date();
  }
}

class Shop {
  constructor() {
    this.items = [
      new ShopItem({
        name: 'Ranged Plant',
        cost: 50,
        identifier: GameMaster.config.plantTypes.ranged,
        stockInTime: 3
      }),
      new ShopItem({
        name: 'Armoured Plant',
        cost: 25,
        identifier: GameMaster.config.plantTypes.armoured,
        stockInTime: 5
      }),
      new ShopItem({
        name: 'Angry Plant',
        cost: 75,
        identifier: GameMaster.config.plantTypes.angry,
        stockInTime: 10,
      }),
      new ShopItem({
        name: 'Fierce Plant',
        cost: 150,
        identifier: GameMaster.config.plantTypes.normal,
        stockInTime: 10,
      }),
    ];

    /** @type {ShopItem} */
    this.selectedItem;
  }

  showMenu() {
    const balanceHeight = dimensions.shop.h * .1;
    const itemWidth = dimensions.shop.w / 2;
    const itemHeight = dimensions.shop.h / (this.items.length / 2) - balanceHeight;

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      const button = createButton(item.name);

      const isNewRow = !(i & 1);
      let itemX = 0, itemY = 0;

      if (isNewRow) {
        itemX = dimensions.shop.x;
        // itemY = (i / 2) * itemHeight;
      } else {
        itemX = dimensions.shop.x + itemWidth;
      }
      itemY = floor((i / 2)) * itemHeight;

      button.position(itemX, itemY);
      button.size(itemWidth, itemHeight);

      button.child(createDiv(`Cost: ${item.cost}`));

      if (!item.isStocking()) {
        button.mousePressed(() => this.selectItem(item));
      } else {
        button.child(createDiv().addClass('loader'));
      }

      if (gameMaster.plantType === item.identifier) {
        button.child(createDiv('< selected >'));
      }
    }
  }


  render() {
    fill('#0099ff');
    rect(dimensions.shop.x, dimensions.shop.y, dimensions.shop.w, dimensions.shop.h);

    fill(255);
    text(gameMaster.wallet.balance, dimensions.shop.x + 40, dimensions.shop.endY - 30, 30, 30);
  }

  /**
   * 
   * @param {ShopItem} item 
   */
  selectItem(item) {
    this.selectedItem = item;
  }
}