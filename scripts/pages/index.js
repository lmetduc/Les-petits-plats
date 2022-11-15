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

//la fonction est asynchrone car elle doit lire le fichier json et cela peut prendre du temps donc le navigateur peut passer à la suite
// await = promesse de repondre mais on sait pas quand et await permet de dire attends, pas de await sans async

async function getRecipes() {
  let response = await fetch("data/recipes.json");
  let res = await response.json();

  // let res = await fetch("data/recipes.json").then((response) =>
  //   response.json()
  // );

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

  const query = searchBar.value.toLowerCase();

  if (query.length < 3) {
    return recipes;
  }

  return recipes.filter((recipe) => {
  const { name, ingredients, description } = recipe;
    const includesInName = name.toLowerCase().includes(query);
    const includesInDescription = description.toLowerCase().includes(query);
    const includesInIngredients = ingredients.find((ingredient) => 
      ingredient.ingredient.toLowerCase().includes(query)
    ) !==undefined;

    return includesInName || includesInDescription || includesInIngredients;
  })
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
        if (ingredient.ingredient === tag) {
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

      recipe.ustensils.forEach((set) => {
        if(set === tag) {
          currentSetFound = true;
        }
      });

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
      if (recipe.appliance === tag) {
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

// permet de déclencher au clic differentes fonctions telles 
// que l'ouverture du filtre, sa fermeture et celle des autres 
// lorsque l'un d'eux est deja selectionné

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

  componentOptions.forEach((componentOption) => {
    if (
      !listIngredientTag.find(
        (currentIngredientTag) => currentIngredientTag === componentOption
      )
    ) {
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
    }
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
    if (!listToolTag.find((currentToolTag) => currentToolTag === toolOption)) {
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
    }
  });
}

//permet de recuperer la valeur de la recherche et de la comparer
function toolFilterSearch(e) {
  const value = e.target.value;
  const toolOptions = dataListValues.tools.filter((tool) =>
    tool.toLowerCase().includes(value.toLowerCase())
  );
  updateToolFilter(toolOptions);
}

function updateSetFilter(setOptions) {
  const setFilterSection = document.querySelector(".sets_filter");

  setFilterSection.innerHTML = "";

  setOptions.forEach((setOption) => {
    if (!listSetTag.find((currentSetTag) => currentSetTag === setOption)) {
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
    }
  });
}

function setFilterSearch(e) {
  const value = e.target.value;
  const setOptions = dataListValues.sets.filter((set) =>
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
function removeTag(e, name, tagValue) {
  const tagSection = e.currentTarget;
  tagSection.remove();

  // appeler sortall pour refaire tout le tri

  // name = set | component | tool

  if (name === "tool") {
    // listToolTag est egale a lui-meme moins les élements qui ne respectent pas la conditions
    listToolTag = listToolTag.filter(
      (currentToolTag) => currentToolTag !== tagValue
    );
  } else if (name === "component") {
    listIngredientTag = listIngredientTag.filter(
      (currentIngredientTag) => currentIngredientTag !== tagValue
    );
  } else if (name === "set") {
    listSetTag = listSetTag.filter(
      (currentSetTag) => currentSetTag !== tagValue
    );
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
