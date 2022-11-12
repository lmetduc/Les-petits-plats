import { Ingredient } from "./ingredient.js";

//class comme une base de données

export class Recipe {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.servings = data.servings;
    let ingredients = [];
    data.ingredients.forEach((ingredientInfo) => {
      // une classe avec new = syntaxe
      const ingredient = new Ingredient(ingredientInfo);
      ingredients.push(ingredient);
    });
    this.ingredients = ingredients;

    this.time = data.time;
    this.description = data.description;
    this.appliance = data.appliance;
    this.ustensils = data.ustensils;
  }

  // get permet de récupérer les données
  // set permet de modifier les données
  // utile ? => non, 
  // pourquoi utiliser des getter et setter ? => permet de preformater les données pour les utiliser aprés dans le reste du code

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

