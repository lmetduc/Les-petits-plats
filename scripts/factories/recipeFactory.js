import { Recipe } from "../models/recipe.js";
export class RecipeFactory {
  constructor(data, type) {
    if (type === "json") {
      return new Recipe(data);
    } else {
      console.log("La factory recipe ne connait pas le type" + type);
    }
  }
}
