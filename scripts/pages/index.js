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
  let response = await fetch("data/recipes.json");
  let res = await response.json();

  let recipes = res.recipes;

  let recipeList = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const recipeModel = new RecipeFactory(recipe, "json");
    recipeList.push(recipeModel);
  }

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
    //sucre syntaxique, destructuration
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

  let filterRecipes = [];

  for (let i = 0; i < recipes.length; i++) {
    let isValid = true;

    for (let j = 0; j < listIngredientTag.length; j++) {
      let currentIngredientFound = false;
      const tag = listIngredientTag[j];
      for (let k = 0; k < recipes[i].ingredients.length; k++) {
        if (recipes[i].ingredients[k].ingredient === tag) {
          currentIngredientFound = true;
        }
      }
      if (!currentIngredientFound) {
        isValid = false;
      }
    }

    if (isValid) {
      filterRecipes.push(recipes[i]);
    }
  }

  return filterRecipes;

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

  let filterRecipes = [];

  for (let i = 0; i < recipes.length; i++) {
    let isValid = true;

    for (let j = 0; j < listSetTag.length; j++) {
      let currentSetFound = false;
      const tag = listSetTag[j];

      for (let k = 0; k < recipes[i].ustensils.length; k++) {
        if (recipes[i].ustensils[k] === tag) {
          currentSetFound = true;
        }
      }
      if (!currentSetFound) {
        isValid = false;
      }
    }
    if (isValid) {
      filterRecipes.push(recipes[i]);
    }
  }
  return filterRecipes;

  //   return filterRecipes;
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
  let filterRecipes = [];

  for (let i = 0; i < recipes.length; i++) {
    let isValid = true;
    for (let j = 0; j < listToolTag.length; j++) {
      let currentToolFound = false;
      const tag = listToolTag[j];

      if (recipes[i].appliance === tag) {
        currentToolFound = true;
      }

      if (!currentToolFound) {
        isValid = false;
      }
    }
    if (isValid) {
      filterRecipes.push(recipes[i]);
    }
  }
  return filterRecipes;

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
  for (let i = 0; i < recipesToDisplay.length; i++) {
    recipesSection.append(new RecipeCard(recipesToDisplay[i]).getUserCardDOM());
  }
}

/**
 *
 */
searchBar.addEventListener("keyup", () => {
  sortAll(allRecipes);
});

/**
 * Supprimer l'affichage des recettes
 */
function removeDisplayRecipes() {
  recipesSection.innerHTML = "";
}

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

// permet de mettre à jour les données du filtre ingrêdient
function updateComponentFilter(componentOptions) {
  const componentFilterSection = document.querySelector(".components_filter");

  componentFilterSection.innerHTML = "";

  for (let i = 0; i < componentOptions.length; i++) {
    let isSelected = false;
    for (let j = 0; j < listIngredientTag.length; j++) {
      if (listIngredientTag[j] === componentOptions[i]) {
        isSelected = true;
      }
    }
    if (!isSelected) {
      const filterChoice = document.createElement("span");
      filterChoice.innerHTML = componentOptions[i];
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
    }
  }
}

//permet de recuperer la valeur de la recherche et de la comparer
function componentFilterSearch(e) {
  const value = e.target.value;
  let componentOptions = [];
  for (let i = 0; i < dataListValues.components.length; i++) {
    if (
      dataListValues.components[i].toLowerCase().includes(value.toLowerCase())
    ) {
      componentOptions.push(dataListValues.components[i]);
    }
  }

  updateComponentFilter(componentOptions);
}

function updateToolFilter(toolOptions) {
  const toolFilterSection = document.querySelector(".tools_filter");

  toolFilterSection.innerHTML = "";

  for (let i = 0; i < toolOptions.length; i++) {
    let isSelected = false;
    for (let j = 0; j < listToolTag.length; j++) {
      if (listToolTag[j] === toolOptions[i]) {
        isSelected = true;
      }
    }
    if (!isSelected) {
      const filterChoice = document.createElement("span");
      filterChoice.innerHTML = toolOptions[i];
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
    }
  }
}

//permet de recuperer la valeur de la recherche et de la comparer
function toolFilterSearch(e) {
  const value = e.target.value;
  let toolsOptions = [];
  for (let i = 0; i < dataListValues.tools.length; i++) {
    if (dataListValues.tools[i].toLowerCase().includes(value.toLowerCase())) {
      toolsOptions.push(dataListValues.tools[i]);
    }
  }
  updateToolFilter(toolsOptions);
}

function updateSetFilter(setOptions) {
  const setFilterSection = document.querySelector(".sets_filter");

  setFilterSection.innerHTML = "";

  for (let i = 0; i < setOptions.length; i++) {
    let isSelected = false;
    for (let j = 0; j < listSetTag.length; j++) {
      if (listSetTag[j] === setOptions[i]) {
        isSelected = true;
      }
    }
    if (!isSelected) {
      const filterChoice = document.createElement("span");
      filterChoice.innerHTML = setOptions[i];
      setFilterSection.appendChild(filterChoice);

      filterChoice.addEventListener("click", (e) => {
        listSetTag.push(e.target.innerHTML);
        displayTag(e, "set");
        const filterOption = e.target;
        filterOption.remove();

        // TODO : Lancer le sortAll
        sortAll(allRecipes);
      });
    }
  }
}

function setFilterSearch(e) {
  const value = e.target.value;
  let setOptions = [];
  for (let i = 0; i < dataListValues.sets.length; i++) {
    if (dataListValues.sets[i].includes(value.toLowerCase())) {
      setOptions.push(dataListValues.sets[i]);
    }
  }


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

toolsFilterInput.addEventListener("keyup", function (e) {
  toolFilterSearch(e);
});

setsFilterInput.addEventListener("keyup", function (e) {
  setFilterSearch(e);
});

/**
 * Affiche les filtres sans doublons et dans l'ordre alphabétique
 */

function unique(dataList) {
  // permet de supprimer les doublons
  let unique = [];
  for (let i = 0; i < dataList.length; i++) {
    const dataListElement = dataList[i];
    if (dataList.indexOf(dataListElement) === i) {
      unique.push(dataListElement);
    }
  }

  // const uniques = dataList.filter((v, i, a) => a.indexOf(v) === i);
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
  for (let i = 0; i < recipes.length; i++) {
    let ingredientNameList = [];

    for (let j = 0; j < recipes[i].ingredients.length; j++) {
      ingredientNameList.push(recipes[i].ingredients[j].ingredient);
    }
    componentsOption = componentsOption.concat(ingredientNameList);

    setOption = setOption.concat(recipes[i].ustensils);

    toolOption.push(recipes[i].appliance);
  }

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
function removeTag(e, name, tagValue) {
  const tagSection = e.currentTarget;
  tagSection.remove();

  // appeler sortall pour refaire tout le tri

  if (name === "tool") {
    // listToolTag est egale a lui-meme moins les élements qui ne respectent pas la conditions
    let listTag = [];
    for (let i = 0; i < listToolTag.length; i++) {
      if (listToolTag[i] !== tagValue) {
        listTag.push(listToolTag[i]);
      }
    }
    listToolTag = listTag;
  } else if (name === "component") {
    let listTag = [];
    for (let i = 0; i < listIngredientTag.length; i++) {
      if (listIngredientTag[i] !== tagValue) {
        listTag.push(listIngredientTag[i]);
      }
    }
    listIngredientTag = listTag;

  } else if (name === "set") {
    let listTag = [];
    for (let i = 0; i < listSetTag.length; i++) {
      if (listSetTag[i] !== tagValue) {
        listTag.push(listSetTag[i]);
      }
    }
    listSetTag = listTag;

  }

  sortAll(allRecipes);
}

/**
 * Afficher les tags
 */
function displayTag(e, name) {
  const tagValue = e.target.innerHTML;

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
  tagText.innerHTML = tagValue;
  tagSection.appendChild(icon);
  tagSection.addEventListener("click", (e) => removeTag(e, name, tagValue));
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
