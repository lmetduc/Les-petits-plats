import { RecipeFactory } from "../factories/recipeFactory.js";
import { RecipeCard } from "../templates/recipeCard.js";

//permet de sélectionner l'emplacement des recettes et de la barre de recherche sur la page

const recipesSection = document.querySelector(".card");
const searchBar = document.querySelector(".searchbar");

//permet de selectionner chaque filtre

const componentsFilterButton = document.querySelector(".components");
const toolsFilterButton = document.querySelector(".tools");
const setsFilterButton = document.querySelector(".sets");

const componentsFilterInput = document.querySelector("#components");
const toolsFilterInput = document.querySelector("#tools");
const setsFilterInput = document.querySelector("#sets");

let allRecipes = [];
let listIngredientTag = [];
let listToolTag = [];
let listSetTag = [];
let dataListValues = { components: [], sets: [], tools: [] };

/**
 * Récupération des données des recettes de recipes.json
 */

async function getRecipes() {
  let res = await fetch("data/recipes.json").then((response) =>
    response.json()
  );
  let recipes = res.recipes;

  let recipeList = [];

  recipes.forEach((recipe) => {
    const recipeModel = new RecipeFactory(recipe, "json");
    recipeList.push(recipeModel);
  });

  return recipeList;
}

/**
 *
 */
function sortRecipesByKeywords(recipes) {
  const results = [];

  const query = searchBar.value.toLowerCase();

  if (query.length < 3) {
    return recipes;
  }

  for (let i = 0; i < recipes.length; i++) {
    const { name, ingredients, description } = recipes[i];

    const includesInName = name.toLowerCase().includes(query);
    if (includesInName) {
      results.push(recipes[i]);
      continue;
    }

    const includesInDescription = description.toLowerCase().includes(query);
    if (includesInDescription) {
      results.push(recipes[i]);
      continue;
    }

    let includesInIngredients = false;
    for (let y = 0; y < ingredients.length; y++) {
      if (ingredients[y].ingredient.toLowerCase().includes(query)) {
        includesInIngredients = true;
      }
    }
    if (includesInIngredients) {
      results.push(recipes[i]);
    }
  }

  return results;
}

/**
 * Tri en fonction des filtres ingrédients
 */

function sortRecipesByIngredientsTags(recipes) {
  if (listIngredientTag.length === 0) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    let isValid = true;
    listIngredientTag.forEach((tag) => {
      let currentIngredientFound = false;
      recipe.ingredients.forEach((ingredient) => {
        if (ingredient.ingredient.includes(tag)) {
          currentIngredientFound = true;
        }
      });
      if (!currentIngredientFound) {
        isValid = false;
      }
    });
    return isValid;
  });

  // let results = [];

  // TODO : 1) Récupérer les tags qui sont dans filters.COMPONENTS_TAGS_LIST
  // TODO : 2) Si COMPONENTS_TAGS_LIST est vide on return recipes
  // TODO : 3) Sinon on cherche les recipes qui on des tags qui sont dans filters.COMPONENTS_TAGS_LIST

  // return results;
}

/**
 * Tri en fonction des filtres appareils
 */

function sortRecipesBySetTags(recipes) {
  if (listSetTag.length === 0) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    let isValid = true;
    listSetTag.forEach((tag) => {
      let currentSetFound = false;

      if (recipe.ustensils.includes(tag)) {
        currentSetFound = true;
      }
      if (!currentSetFound) {
        isValid = false;
      }
    });
    return isValid;
  });

  // TODO
  // TODO : 1) Récupérer les tags qui sont dans filters.SET_TAGS_LIST
  // TODO : 2) Si COMPONENTS_TAGS_LIST est vide on return recipes
  // TODO : 3) Sinon on cherche les recipes qui on des tags qui sont dans filters.COMPONENTS_TAGS_LIST

  //return results
}

/**
 * Tri en fonction des filtres ustensiles
 */

function sortRecipesByToolsTags(recipes) {
  if (listToolTag.length === 0) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    let isValid = true;
    listToolTag.forEach((tag) => {
      let currentToolFound = false;
      if (recipe.appliance.includes(tag)) {
        currentToolFound = true;
      }

      if (!currentToolFound) {
        isValid = false;
      }
    });
    return isValid;
  });

  // TODO
  // TODO : 1) Récupérer les tags qui sont dans filters.COMPONENTS_TAGS_LIST
  // TODO : 2) Si COMPONENTS_TAGS_LIST est vide on return recipes
  // TODO : 3) Sinon on cherche les recipes qui on des tags qui sont dans filters.COMPONENTS_TAGS_LIST
}

/**
 * Trie toutes les recettes
 */

function sortAll(allRecipes) {
  let recipes = sortRecipesByKeywords(allRecipes);
  recipes = sortRecipesByIngredientsTags(recipes);
  recipes = sortRecipesByToolsTags(recipes);
  recipes = sortRecipesBySetTags(recipes);

  dataListValues = dataList(recipes);

  displayFilters(recipes);
  updateDisplayRecipes(recipes);

  return recipes;
}

/**
 * Mettre à jour la liste des recettes
 */
function updateDisplayRecipes(recipesToDisplay) {
  removeDisplayRecipes();

  if (recipesToDisplay.length) {
    dislpayRecipes(recipesToDisplay);
  } else {
    recipesSection.innerHTML = "Aucune correspondance n'a été trouvée";
  }
}

/**
 * Afficher la liste des recettes
 */

function dislpayRecipes(recipesToDisplay) {
  recipesToDisplay.forEach((recipe) => {
    recipesSection.append(new RecipeCard(recipe).getUserCardDOM());
  });
}

/**
 *
 * TODO: check spec for keyup
 */
searchBar.addEventListener("keyup", async (e) => {
  let recipes = await getRecipes();
  sortAll(recipes);
});

/**
 * Supprimer l'affichage des recettes
 */
function removeDisplayRecipes() {
  recipesSection.innerHTML = "";
}

// permet de déclencher au clic differentes fonctions telles que l'ouverture du filtre, sa fermeture et celle des autres lorsque l'un d'eux est deja selectionné

componentsFilterButton.addEventListener("click", function () {
  triggerFilterOptions(componentsFilterButton);
  closeFilterOptions(toolsFilterButton);
  closeFilterOptions(setsFilterButton);
});
toolsFilterButton.addEventListener("click", function () {
  triggerFilterOptions(toolsFilterButton);
  closeFilterOptions(componentsFilterButton);
  closeFilterOptions(setsFilterButton);
});
setsFilterButton.addEventListener("click", function () {
  triggerFilterOptions(setsFilterButton);
  closeFilterOptions(toolsFilterButton);
  closeFilterOptions(componentsFilterButton);
});

// permet de mettre à jour les données du filtre appareil
function updateComponentFilter(componentOptions) {
  const componentFilterSection = document.querySelector(".components_filter");

  componentFilterSection.innerHTML = "";

  componentOptions.forEach((componentOption) => {
    const filterChoice = document.createElement("span");
    filterChoice.innerHTML = componentOption;
    componentFilterSection.appendChild(filterChoice);

    filterChoice.addEventListener("click", (e) => {
      // TODO : Sauvegarder les tags dans une list COMPONENTS_TAGS_LIST
      listIngredientTag.push(e.target.innerHTML);
      displayTag(e, "component");
      const filterOption = e.target;
      filterOption.remove();

      // TODO : Lancer le sortAll
      sortAll(allRecipes);
    });
  });
}

//permet de recuperer la valeur de la recherche et de la comparer
function componentFilterSearch(e) {
  const value = e.target.value;
  const componentOptions = dataListValues.components.filter((component) =>
    component.toLowerCase().includes(value.toLowerCase())
  );
  updateComponentFilter(componentOptions);
}

function updateToolFilter(toolOptions) {
  const toolFilterSection = document.querySelector(".tools_filter");

  toolFilterSection.innerHTML = "";

  toolOptions.forEach((toolOption) => {
    const filterChoice = document.createElement("span");
    filterChoice.innerHTML = toolOption;
    toolFilterSection.appendChild(filterChoice);

    filterChoice.addEventListener("click", (e) => {
      // TODO : Sauvegarder les tags dans une list COMPONENTS_TAGS_LIST
      listToolTag.push(e.target.innerHTML);
      displayTag(e, "tool");
      const filterOption = e.target;
      filterOption.remove();

      // TODO : Lancer le sortAll
      sortAll(allRecipes);
    });
  });
}

//permet de recuperer la valeur de la recherche et de la comparer
function toolFilterSearch(e) {
  const value = e.target.value;
  const toolOptions = tools.filter((tool) =>
    tool.toLowerCase().includes(value.toLowerCase())
  );
  updateToolFilter(toolOptions);
}

function updateSetFilter(setOptions) {
  const setFilterSection = document.querySelector(".sets_filter");

  setFilterSection.innerHTML = "";

  setOptions.forEach((setOption) => {
    const filterChoice = document.createElement("span");
    filterChoice.innerHTML = setOption;
    setFilterSection.appendChild(filterChoice);

    filterChoice.addEventListener("click", (e) => {
      listSetTag.push(e.target.innerHTML);
      displayTag(e, "set");
      const filterOption = e.target;
      filterOption.remove();

      // TODO : Lancer le sortAll
      sortAll(allRecipes);
    });
  });
}

function setFilterSearch(e) {
  const value = e.target.value;
  const setOptions = sets.filter((set) =>
    set.toLowerCase().includes(value.toLowerCase())
  );
  updateSetFilter(setOptions);
}

//permet de fermer les filtres
function closeFilterOptions(item) {
  item.classList.remove("opened");
  const filterLabel = item.querySelector(".filter-label");
  filterLabel.style.display = "flex";
  const filterSearch = item.querySelector(".filter-search");
  filterSearch.style.display = "none";
}

//permet d'ouvrir les filtres
function openFilterOptions(item) {
  item.classList.add("opened");

  const filterLabel = item.querySelector(".filter-label");
  filterLabel.style.display = "none";
  const filterSearch = item.querySelector(".filter-search");
  filterSearch.style.display = "flex";

  const filterInput = item.querySelector("input");
  filterInput.focus();
}

//permet d'ouvrir ou de fermer les filtres
function triggerFilterOptions(item) {
  if (item.classList.contains("opened")) {
    closeFilterOptions(item);
  } else {
    openFilterOptions(item);
  }
}

/**
 * Gestion de la recherche des filtres
 */
componentsFilterInput.addEventListener("keyup", function (e) {
  componentFilterSearch(e);
});

toolsFilterInput.addEventListener("keyup", function () {
  toolFilterSearch(toolsFilterInput);
});

setsFilterInput.addEventListener("keyup", function () {
  setFilterSearch(setsFilterInput);
});

/**
 * Affiche les filtres sans doublons et dans l'ordre alphabétique
 */

function unique(dataList) {
  // permet de supprimer les doublons
  const unique = dataList.filter((v, i, a) => a.indexOf(v) === i);
  // permet de trier par ordre alphabetique
  return unique.sort((a, b) => a.localeCompare(b));
}

/**
 * Récupération des données des filtres
 */

function dataList(recipes) {
  let componentsOption = [];
  let toolOption = [];
  let setOption = [];

  recipes.forEach((recipe) => {
    let ingredientNameList = [];
    // check for map or filter
    recipe.ingredients.forEach((ingredient) => {
      ingredientNameList.push(ingredient.ingredient);
    });
    componentsOption = componentsOption.concat(ingredientNameList);

    setOption = setOption.concat(recipe.ustensils);

    toolOption.push(recipe.appliance);
  });

  // retourne les trois tableaux
  return {
    components: unique(componentsOption),
    tools: unique(toolOption),
    sets: unique(setOption),
  };
}

// let dataListValues = {};

function displayFilters(recipes) {
  dataListValues = dataList(recipes);

  let { components, tools, sets } = dataListValues;

  updateComponentFilter(components);
  updateToolFilter(tools);
  updateSetFilter(sets);
}

/**
 * Supprimer les tags
 */
function removeTag(e, name) {
  const tagSection = e.currentTarget;
  tagSection.remove();

  // todo: en fonction du name: retirer du bon tableau (voir listToolTag...)
  // appeler sortall pour refaire tout le tri
  


  // const tagRemoval = document.querySelector(".tagsection")
  // tagRemoval.style.display= "none";
}

/**
 * Afficher les tags
 */
function displayTag(e, name) {
  const tag = document.querySelector(".tag");
  const tagSectionbis = document.createElement("div");
  const tagSection = document.createElement("div");
  const tagText = document.createElement("div");
  const icon = document.createElement("div");

  tagSectionbis.classList.add("tagsectionbis");
  tagSection.classList.add("tagsection");
  tagSection.classList.add(`tagsection-${name}`);

  tagText.classList.add("tagname");
  icon.classList.add("fa-times-circle");
  icon.classList.add("far");
  icon.classList.add("icon");

  tag.appendChild(tagSectionbis);
  tagSectionbis.appendChild(tagSection);
  tagSection.appendChild(tagText);
  tagText.innerHTML = e.target.innerHTML;
  tagSection.appendChild(icon);
  tagSection.addEventListener("click", (e) => removeTag(e, name));
}

/**
 * Initialisation
 */
async function init() {
  allRecipes = await getRecipes();
  updateDisplayRecipes(allRecipes);
  displayFilters(allRecipes);
}

init();
