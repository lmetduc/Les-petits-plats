/* eslint-disable max-len */
/* eslint-disable no-loop-func */
/* eslint-disable import/extensions */
import RecipeFactory from '../factories/recipeFactory.js';
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
 */

/**
 * Récupération des données des recettes de recipes.json
 * @returns La liste de toutes les recettes
 */

async function getRecipes() {
  const response = await fetch('data/recipes.json');
  const res = await response.json();

  const { recipes } = res;

  const recipeList = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const recipeModel = new RecipeFactory(recipe, 'json');
    recipeList.push(recipeModel);
  }

  return recipeList;
}

/**
 * Tri par mot clé, barre de recherche
 * @param {*} recipes

 * @returns La liste des recettes si il y a une correspondance avec le titre, la desc et ing
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
 * @param {*} recipes
 * @returns La liste des recettes si il y a une correspondance avec le ou le(s) tag(s) ingredient sélectionné(s)
 */
function sortRecipesByIngredientsTags(recipes) {
  if (listIngredientTag.length === 0) {
    return recipes;
  }

  const filterRecipes = [];

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
}

/**
 * @param {*} recipes
 * @returns La liste des recettes si il y a une correspondance avec le ou les tag(s) appareil(s) sélectionné(s)
 */
function sortRecipesBySetTags(recipes) {
  if (listSetTag.length === 0) {
    return recipes;
  }

  const filterRecipes = [];

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
}

/**
 * @param {*} recipes
 * @returns La liste des recettes si il y a une correspondance avec le ou les tag(s) ustensile sélectionné(s)
 */
function sortRecipesByToolsTags(recipes) {
  if (listToolTag.length === 0) {
    return recipes;
  }
  const filterRecipes = [];

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
}

/**
 * Afficher la liste des recettes grâce à RecipeCard dans recipesSection
 * @param {*} recipesToDisplay
 */

function dislpayRecipes(recipesToDisplay) {
  for (let i = 0; i < recipesToDisplay.length; i++) {
    recipesSection.append(new RecipeCard(recipesToDisplay[i]).getUserCardDOM());
  }
}

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
 *  Supprimer les tags
 * @param {*} e
 * @param {*} name
 * @param {*} tagValue
 */
function removeTag(e, name, tagValue) {
  const tagSection = e.currentTarget;
  tagSection.remove();

  if (name === 'tool') {
    // listToolTag est egale a lui-meme moins les élements qui ne respectent pas la conditions
    const listTag = [];
    for (let i = 0; i < listToolTag.length; i++) {
      if (listToolTag[i] !== tagValue) {
        listTag.push(listToolTag[i]);
      }
    }
    listToolTag = listTag;
  } else if (name === 'component') {
    const listTag = [];
    for (let i = 0; i < listIngredientTag.length; i++) {
      if (listIngredientTag[i] !== tagValue) {
        listTag.push(listIngredientTag[i]);
      }
    }
    listIngredientTag = listTag;
  } else if (name === 'set') {
    const listTag = [];
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
 * @param {*} e
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
 *  Met à jour les données du filtre ingrédient
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
  for (let i = 0; i < componentOptions.length; i++) {
    let isSelected = false;
    for (let j = 0; j < listIngredientTag.length; j++) {
      if (listIngredientTag[j] === componentOptions[i]) {
        isSelected = true;
      }
    }
    if (!isSelected) {
      const filterChoice = document.createElement('span');
      filterChoice.innerHTML = componentOptions[i];
      componentFilterSection.appendChild(filterChoice);

      filterChoice.addEventListener('click', (e) => {
        listIngredientTag.push(e.target.innerHTML);
        displayTag(e, 'component');
        const filterOption = e.target;
        filterOption.remove();
        sortAll(allRecipes);
      });
    }
  }
}

/**
 * Recherche les données du filtre ingrédient
 * @param {*} e
 */
function componentFilterSearch(e) {
  const { value } = e.target;
  const componentOptions = [];
  for (let i = 0; i < dataListValues.components.length; i++) {
    if (
      dataListValues.components[i].toLowerCase().includes(value.toLowerCase())
    ) {
      componentOptions.push(dataListValues.components[i]);
    }
  }

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

  for (let i = 0; i < toolOptions.length; i++) {
    let isSelected = false;
    for (let j = 0; j < listToolTag.length; j++) {
      if (listToolTag[j] === toolOptions[i]) {
        isSelected = true;
      }
    }
    if (!isSelected) {
      const filterChoice = document.createElement('span');
      filterChoice.innerHTML = toolOptions[i];
      toolFilterSection.appendChild(filterChoice);

      filterChoice.addEventListener('click', (e) => {
        // TODO : Sauvegarder les tags dans une list COMPONENTS_TAGS_LIST
        listToolTag.push(e.target.innerHTML);
        displayTag(e, 'tool');
        const filterOption = e.target;
        filterOption.remove();
        // TODO : Lancer le sortAll
        sortAll(allRecipes);
      });
    }
  }
}

/**
 * Recherche les données du filtre ustensile
 * @param {*} e
 */
function toolFilterSearch(e) {
  const { value } = e.target;
  const toolsOptions = [];
  for (let i = 0; i < dataListValues.tools.length; i++) {
    if (dataListValues.tools[i].toLowerCase().includes(value.toLowerCase())) {
      toolsOptions.push(dataListValues.tools[i]);
    }
  }
  updateToolFilter(toolsOptions);
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

  for (let i = 0; i < setOptions.length; i++) {
    let isSelected = false;
    for (let j = 0; j < listSetTag.length; j++) {
      if (listSetTag[j] === setOptions[i]) {
        isSelected = true;
      }
    }
    if (!isSelected) {
      const filterChoice = document.createElement('span');
      filterChoice.innerHTML = setOptions[i];
      setFilterSection.appendChild(filterChoice);

      filterChoice.addEventListener('click', (e) => {
        listSetTag.push(e.target.innerHTML);
        displayTag(e, 'set');
        const filterOption = e.target;
        filterOption.remove();

        // TODO : Lancer le sortAll
        sortAll(allRecipes);
      });
    }
  }
}

/**
 * Recherche les données du filtre appareil
 * @param {*} e
 */
function setFilterSearch(e) {
  const { value } = e.target;
  const setOptions = [];
  for (let i = 0; i < dataListValues.sets.length; i++) {
    if (dataListValues.sets[i].includes(value.toLowerCase())) {
      setOptions.push(dataListValues.sets[i]);
    }
  }

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
 * Gestion de la recherche des filtres
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
  const results = [];
  for (let i = 0; i < filterList.length; i++) {
    const dataListElement = filterList[i];
    if (filterList.indexOf(dataListElement) === i) {
      results.push(dataListElement);
    }
  }

  // const uniques = dataList.filter((v, i, a) => a.indexOf(v) === i);
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
  for (let i = 0; i < recipes.length; i++) {
    const ingredientNameList = [];

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
  Tri de la search au keyup
 */
searchBar.addEventListener('keyup', () => {
  sortAll(allRecipes);
});

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
