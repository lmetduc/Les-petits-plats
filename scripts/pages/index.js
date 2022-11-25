/* eslint-disable max-len */
// eslint-disable-next-line import/extensions
import RecipeFactory from '../factories/recipeFactory.js';
// eslint-disable-next-line import/extensions, import/named
import RecipeCard from '../templates/recipeCard.js';

// permet de sélectionner l'emplacement des recettes et de la barre de recherche sur la page

const recipesSection = document.querySelector('.card');
const searchBar = document.querySelector('.searchbar');

// permet de selectionner chaque filtre

const componentsFilterButton = document.querySelector('.components');
const toolsFilterButton = document.querySelector('.tools');
const setsFilterButton = document.querySelector('.sets');

const componentsFilterInput = document.querySelector('#components');
const toolsFilterInput = document.querySelector('#tools');
const setsFilterInput = document.querySelector('#sets');

let allRecipes = [];
let listIngredientTag = [];
let listToolTag = [];
let listSetTag = [];
let dataListValues = {};

/**
 * Récupération des données des recettes de recipes.json
 * @returns La liste de toutes les recettes
 */
async function getRecipes() {
  const response = await fetch('data/recipes.json');
  const res = await response.json();

  const { recipes } = res;

  const recipeList = [];

  recipes.forEach((recipe) => {
    const recipeModel = new RecipeFactory(recipe, 'json');
    recipeList.push(recipeModel);
  });

  return recipeList;
}

/**
 * Tri par mot clé, barre de recherche
 * @param {*} recipes
 * @returns La liste des recettes si il y a une correspondance avec le titre, la description ou les ingredients
 */
function sortRecipesByKeywords(recipes) {
  const query = searchBar.value.toLowerCase();

  if (query.length < 3) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    const { name } = recipe;
    const { ingredients } = recipe;
    const { description } = recipe;
    const includesInName = name.toLowerCase().includes(query);
    const includesInDescription = description.toLowerCase().includes(query);
    const includesInIngredients = ingredients.find((ingredient) => ingredient.ingredient.toLowerCase().includes(query));

    return includesInName || includesInDescription || includesInIngredients;
  });
}

/**
 * @param {*} recipes
 * @returns La liste des recettes si il y a une correspondance avec le ou le(s) tag(s) ingredient sélectionné(s)
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
}

/**
 * Tri en fonction des filtres appareils
 */

/**
 * @param {*} recipes
 * @returns La liste des recettes si il y a une correspondance avec le ou les tag(s) appareil(s) sélectionné(s)
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
        if (set === tag) {
          currentSetFound = true;
        }
      });

      if (!currentSetFound) {
        isValid = false;
      }
    });
    return isValid;
  });
}

/**
 * Tri en fonction des filtres ustensiles
 */
/**
 * @param {*} recipes
 * @returns La liste des recettes si il y a une correspondance avec le ou les tag(s) ustensile sélectionné(s)
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
}

/**
 * Afficher la liste des recettes grâce à RecipeCard dans recipesSection
 * @param {*} recipesToDisplay
 */

function dislpayRecipes(recipesToDisplay) {
  recipesToDisplay.forEach((recipe) => {
    recipesSection.append(new RecipeCard(recipe).getUserCardDOM());
  });
}

/**
 * Trie toutes les recettes
 */
/**
 * @param {*} allRecipesToFilter
 * @returns Toutes les recettes triées en fonction des quatre tris, affiche les filtres et mets à jour les recettes
 */

function sortAll(allRecipesToFilter) {
  let recipes = sortRecipesByKeywords(allRecipesToFilter);
  recipes = sortRecipesByIngredientsTags(recipes);
  recipes = sortRecipesByToolsTags(recipes);
  recipes = sortRecipesBySetTags(recipes);

  // eslint-disable-next-line no-use-before-define
  displayFilters(recipes);
  // eslint-disable-next-line no-use-before-define
  updateDisplayRecipes(recipes);

  return recipes;
}

/**
 * Supprimer les tags
 * @param {*} e
 * @param {*} name
 * @param {*} tagValue
 */

function removeTag(e, name, tagValue) {
  const tagSection = e.currentTarget;
  tagSection.remove();

  if (name === 'tool') {
    // listToolTag est egale a lui-meme moins les élements qui ne respectent pas la conditions
    listToolTag = listToolTag.filter(
      (currentToolTag) => currentToolTag !== tagValue,
    );
  } else if (name === 'component') {
    listIngredientTag = listIngredientTag.filter(
      (currentIngredientTag) => currentIngredientTag !== tagValue,
    );
  } else if (name === 'set') {
    listSetTag = listSetTag.filter(
      (currentSetTag) => currentSetTag !== tagValue,
    );
  }

  sortAll(allRecipes);
}

/**
 * Afficher les tags
 * @param {} e
 * @param {*} name
 */

function displayTag(e, name) {
  const tagValue = e.target.innerHTML;

  const tag = document.querySelector('.tag');
  const tagSectionbis = document.createElement('div');
  const tagSection = document.createElement('div');
  const tagText = document.createElement('div');
  const icon = document.createElement('div');

  tagSectionbis.classList.add('tagsectionbis');
  tagSection.classList.add('tagsection');
  tagSection.classList.add(`tagsection-${name}`);

  tagText.classList.add('tagname');
  icon.classList.add('fa-times-circle');
  icon.classList.add('far');
  icon.classList.add('icon');

  tag.appendChild(tagSectionbis);
  tagSectionbis.appendChild(tagSection);
  tagSection.appendChild(tagText);
  tagText.innerHTML = tagValue;
  tagSection.appendChild(icon);
  tagSection.addEventListener('click', (event) => removeTag(event, name, tagValue));
}

/**
 * Met à jour les données du filtre ingrédient
 * @param {*} componentOptions
 */

function updateComponentFilter(componentOptions) {
  const componentFilterSection = document.querySelector('.components_filter');

  componentFilterSection.innerHTML = '';

  if (componentOptions.length === 0) {
    const filterEmptyMessage = document.createElement('span');
    filterEmptyMessage.innerHTML = "Aucune correspondance n'a été trouvée";
    filterEmptyMessage.classList.add('filter_unit');
    componentFilterSection.appendChild(filterEmptyMessage);
  }
  componentOptions.forEach((componentOption) => {
    if (
      !listIngredientTag.find(
        (currentIngredientTag) => currentIngredientTag === componentOption,
      )
    ) {
      const filterChoice = document.createElement('span');
      filterChoice.innerHTML = componentOption;
      componentFilterSection.appendChild(filterChoice);

      filterChoice.addEventListener('click', (e) => {
        listIngredientTag.push(e.target.innerHTML);
        displayTag(e, 'component');
        const filterOption = e.target;
        filterOption.remove();

        sortAll(allRecipes);
      });
    }
  });
}

/**
 * Recherche les données du filtre ingrédient
 * @param {*} e
 */
function componentFilterSearch(e) {
  const { value } = e.target;
  const componentOptions = dataListValues.components.filter((component) => component.toLowerCase().includes(value.toLowerCase()));
  updateComponentFilter(componentOptions);
}

/**
 * Met à jour les données du filtre ustensile
 * @param {*} toolOptions
 */

function updateToolFilter(toolOptions) {
  const toolFilterSection = document.querySelector('.tools_filter');

  toolFilterSection.innerHTML = '';

  if (toolOptions.length === 0) {
    const filterEmptyMessage = document.createElement('span');
    filterEmptyMessage.innerHTML = "Aucune correspondance n'a été trouvée";
    filterEmptyMessage.classList.add('filter_unit');
    toolFilterSection.appendChild(filterEmptyMessage);
  }
  toolOptions.forEach((toolOption) => {
    if (!listToolTag.find((currentToolTag) => currentToolTag === toolOption)) {
      const filterChoice = document.createElement('span');
      filterChoice.innerHTML = toolOption;
      toolFilterSection.appendChild(filterChoice);

      filterChoice.addEventListener('click', (e) => {
        listToolTag.push(e.target.innerHTML);
        displayTag(e, 'tool');
        const filterOption = e.target;
        filterOption.remove();

        sortAll(allRecipes);
      });
    }
  });
}

/**
 * Recherche les données du filtre ustensile
 * @param {*} e
 */
function toolFilterSearch(e) {
  const { value } = e.target;
  const toolOptions = dataListValues.tools.filter((tool) => tool.toLowerCase().includes(value.toLowerCase()));
  updateToolFilter(toolOptions);
}

/**
 * Met à jour les données du filtre appareil
 * @param {*} setOptions
 */
function updateSetFilter(setOptions) {
  const setFilterSection = document.querySelector('.sets_filter');

  setFilterSection.innerHTML = '';

  if (setOptions.length === 0) {
    const filterEmptyMessage = document.createElement('span');
    filterEmptyMessage.innerHTML = "Aucune correspondance n'a été trouvée";
    filterEmptyMessage.classList.add('filter_unit');
    setFilterSection.appendChild(filterEmptyMessage);
  }
  setOptions.forEach((setOption) => {
    if (!listSetTag.find((currentSetTag) => currentSetTag === setOption)) {
      const filterChoice = document.createElement('span');
      filterChoice.innerHTML = setOption;
      setFilterSection.appendChild(filterChoice);

      filterChoice.addEventListener('click', (e) => {
        listSetTag.push(e.target.innerHTML);
        displayTag(e, 'set');
        const filterOption = e.target;
        filterOption.remove();

        sortAll(allRecipes);
      });
    }
  });
}

/**
 * Recherche les données du filtre appareil
 * @param {*} e
 */
function setFilterSearch(e) {
  const { value } = e.target;
  const setOptions = dataListValues.sets.filter((set) => set.toLowerCase().includes(value.toLowerCase()));
  updateSetFilter(setOptions);
}

/**
 * permet de fermer les filtres
 * @param {*} item
 */
function closeFilterOptions(item) {
  item.classList.remove('opened');
  const filterLabel = item.querySelector('.filter-label');
  filterLabel.style.display = 'flex';
  const filterSearch = item.querySelector('.filter-search');
  filterSearch.style.display = 'none';
}

/**
 * permet d'ouvrir les filtres
 * @param {*} item
 */
function openFilterOptions(item) {
  item.classList.add('opened');

  const filterLabel = item.querySelector('.filter-label');
  filterLabel.style.display = 'none';
  const filterSearch = item.querySelector('.filter-search');
  filterSearch.style.display = 'flex';

  const filterInput = item.querySelector('input');
  filterInput.focus();
}

/**
 * permet d'ouvrir ou de fermer les filtres
 * @param {*} item
 */
function triggerFilterOptions(item) {
  if (item.classList.contains('opened')) {
    closeFilterOptions(item);
  } else {
    openFilterOptions(item);
  }
}

/**
 * Supprimer l'affichage des recettes
 */
function removeDisplayRecipes() {
  recipesSection.innerHTML = '';
}

/**
 * permet de déclencher au clic differentes fonctions telles que l'ouverture du filtre, sa fermeture et celle des autres lorsque l'un d'eux est deja selectionné
 */
componentsFilterButton.addEventListener('click', () => {
  triggerFilterOptions(componentsFilterButton);
  closeFilterOptions(toolsFilterButton);
  closeFilterOptions(setsFilterButton);
});
toolsFilterButton.addEventListener('click', () => {
  triggerFilterOptions(toolsFilterButton);
  closeFilterOptions(componentsFilterButton);
  closeFilterOptions(setsFilterButton);
});
setsFilterButton.addEventListener('click', () => {
  triggerFilterOptions(setsFilterButton);
  closeFilterOptions(toolsFilterButton);
  closeFilterOptions(componentsFilterButton);
});

/**
 * Gestion de la recherche des filtres au keyup
 */
componentsFilterInput.addEventListener('keyup', (e) => {
  componentFilterSearch(e);
});

toolsFilterInput.addEventListener('keyup', (e) => {
  toolFilterSearch(e);
});

setsFilterInput.addEventListener('keyup', (e) => {
  setFilterSearch(e);
});

/**
 * Affiche les filtres sans doublons et dans l'ordre alphabétique
 * @param {*} filterList
 * @returns La liste d'un filtre sans doublon et trié
 */
function unique(filterList) {
  // permet de supprimer les doublons
  const results = filterList.filter((v, i, a) => a.indexOf(v) === i);
  // permet de trier par ordre alphabetique
  return results.sort((a, b) => a.localeCompare(b));
}

/**
 * Récupération des données des filtres
 * @param {*} recipes
 * @returns La liste des ingredients && ustensile && appareil sans doublon
 */

function dataList(recipes) {
  let componentsOption = [];
  const toolOption = [];
  let setOption = [];

  recipes.forEach((recipe) => {
    const ingredientNameList = [];
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

/**
 * Mettre à jour la liste des recettes
 * @param {*} recipesToDisplay
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
 * Recherche au keyup sur la searchBar
 */
searchBar.addEventListener('keyup', () => {
  sortAll(allRecipes);
});

/**
 * Mise à jour des filtres entre eux
 * @param {*} recipes
 */
function displayFilters(recipes) {
  dataListValues = dataList(recipes);

  const { components } = dataListValues;
  const { tools } = dataListValues;
  const { sets } = dataListValues;

  updateComponentFilter(components);
  updateToolFilter(tools);
  updateSetFilter(sets);
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
