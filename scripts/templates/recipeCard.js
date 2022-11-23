class RecipeCard {
  constructor(recipe) {
    this.recipe = recipe;
  }

  getUserCardDOM() {
    const article = document.createElement('article');
    article.classList.add('recipe-card');

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('info_card');

    const recipeImage = document.createElement('div');
    recipeImage.classList.add('recipe_image');
    recipeCard.appendChild(recipeImage);

    const recipeInfo = document.createElement('div');
    recipeInfo.classList.add('info_recipe');

    const recipeTitle = document.createElement('div');
    recipeTitle.classList.add('info_title');
    recipeInfo.appendChild(recipeTitle);

    const recipeName = document.createElement('div');
    recipeName.classList.add('recipe_name');
    recipeName.textContent = this.recipe.name;
    recipeTitle.appendChild(recipeName);

    const recipeTitleTime = document.createElement('div');
    recipeTitleTime.classList.add('info_time');
    recipeTitle.appendChild(recipeTitleTime);

    const recipeTimeIcon = document.createElement('i');
    recipeTimeIcon.classList.add('recipe_time-icon');
    recipeTimeIcon.classList.add('far');
    recipeTimeIcon.classList.add('fa-clock');
    recipeTitleTime.appendChild(recipeTimeIcon);

    const recipeTime = document.createElement('div');
    recipeTime.classList.add('recipe_time');
    recipeTime.textContent = `${this.recipe.time} min`;
    recipeTitleTime.appendChild(recipeTime);

    const recipeInstruction = document.createElement('div');
    recipeInstruction.classList.add('info_instruction');
    recipeInfo.appendChild(recipeInstruction);

    const recipeIngredientList = document.createElement('div');
    recipeIngredientList.classList.add('info_ingredient');
    recipeInstruction.appendChild(recipeIngredientList);

    const recipeIngredient = document.createElement('div');
    recipeIngredient.classList.add('recipe_ingredient');
    this.recipe.ingredients?.forEach(
      (ingredientInfo) => {
        const recipeIngredientLine = document.createElement('div');
        recipeIngredientLine.classList.add('recipe_ingredient-line');
        const recipeIngredientName = document.createElement('span');
        recipeIngredientName.classList.add('recipe_ingredient-name');
        recipeIngredientName.textContent = ingredientInfo.ingredient;
        recipeIngredientLine.appendChild(recipeIngredientName);

        if (ingredientInfo.quantity) {
          recipeIngredientName.textContent += ' : ';
          const recipeIngredientQuantity = document.createElement('span');
          recipeIngredientQuantity.classList.add('recipe_quantity');
          recipeIngredientQuantity.textContent = `${ingredientInfo.quantity} `;
          recipeIngredientLine.appendChild(recipeIngredientQuantity);

          const recipeIngredientUnit = document.createElement('span');
          recipeIngredientUnit.classList.add('recipe_unit');
          recipeIngredientUnit.textContent = ingredientInfo.unit;
          recipeIngredientLine.appendChild(recipeIngredientUnit);
        }

        recipeIngredient.appendChild(recipeIngredientLine);
      },
    );
    recipeIngredientList.appendChild(recipeIngredient);

    const recipeDescription = document.createElement('div');
    recipeDescription.classList.add('recipe_description');
    recipeDescription.textContent = this.recipe.description;
    recipeInstruction.appendChild(recipeDescription);

    article.appendChild(recipeCard);
    article.appendChild(recipeInfo);

    return article;
  }
}
export default RecipeCard;
