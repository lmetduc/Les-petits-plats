// eslint-disable-next-line import/extensions, import/named
import Recipe from '../models/recipe.js';

class RecipeFactory {
  constructor(data, type) {
    if (type === 'json') {
      // eslint-disable-next-line no-constructor-return
      return new Recipe(data);
    }
    console.log(`La factory recipe ne connait pas le type${type}`);
  }
}
export default RecipeFactory;
