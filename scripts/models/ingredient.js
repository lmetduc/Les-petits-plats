export class Ingredient {
  constructor(data) {
    this.ingredient = data.ingredient;
    this.quantity = data.quantity;
    this.unit = data.unit;
  }
  get ingredient() {
    return this._ingredient;
  }
  set ingredient(ingredient) {
    this._ingredient = ingredient;
  }

  get quantity() {
    return this._quantity;
  }
  set quantity(quantity) {
    this._quantity = quantity;
  }

  get unit() {
    return this._unit;
  }
  set unit(unit) {
    this._unit = unit;
  }
}