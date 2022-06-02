export class Receipe {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.servings = data.servings;
        this.ingredients = data.ingredients.map(ingredient => new Ingredient(ingredient));
        this.time = data.time;
        this.description = data.description;
        this.appliance = data.appliance;
        this.ustensils = data.ustensils;

        console.log(data.ingredients);
    }


get id() {
    return this._id;
}
set id(id) {
    this._id = id;
}

get name() {
    return this._name;
}
set name(name) {
    this._name = name;
}

get servings() {
    return this._servings;
}
set servings(servings) {
    this._servings = servings;
}

get ingredients() {
    return this._ingredients;
}
set ingredients(ingredients) {
    this._ingredients = ingredients;
}
}

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