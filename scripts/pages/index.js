import { RecipeCard } from "../templates/recipeCard.js";
import { RecipeFactory } from "../factories/recipeFactory.js";

export async function getRecipes() {
  let { recipes } = await fetch("data/recipes.json")
    .then(response => response.json());
  
  let recipeList = [];
  recipes.forEach((recipe) => {
    const recipeModel = new RecipeFactory(recipe, "json");
    recipeList.push(recipeModel);
  });
  return recipeList;
}

function displayData(recipes) {
  const recipesSection = document.querySelector(".card");

  recipes.forEach((recipe) => {
    const recipeCard = new RecipeCard(recipe);
    const userCardDOM = recipeCard.getUserCardDOM();
    recipesSection.appendChild(userCardDOM);
  });
}

async function init() {
  const recipes = await getRecipes();
  displayData(recipes);
}

init();
