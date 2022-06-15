//permet de selectionner chaque filtre

const componentsFilterButton = document.querySelector(".components");
const toolsFilterButton = document.querySelector(".tools");
const setsFilterButton = document.querySelector(".sets");

const componentsFilterInput = document.querySelector("input[id=components]");
const toolsFilterInput = document.querySelector("input[id=tools]");
const setsFilterInput = document.querySelector("input[id=sets]");

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

export class Filters {
  constructor(recipe) {
    this.recipe = recipe;
    const dataList = this.dataList(recipe);
    this.dataList = dataList;

    componentsFilterInput.addEventListener(
      "keyup",
      this.componentFilterSearch.bind(this)
    );
    toolsFilterInput.addEventListener(
      "keyup",
      this.toolFilterSearch.bind(this)
    );
    setsFilterInput.addEventListener("keyup", this.setFilterSearch.bind(this));
  }

  componentFilterSearch(e) {
    const value = e.target.value;
    const componentOptions = this.dataList.components.filter((component) =>
      component.toLowerCase().includes(value.toLowerCase())
    );
    this.updateComponentFilter(componentOptions);
  }

  toolFilterSearch(e) {
    const value = e.target.value;
    const toolOptions = this.dataList.tools.filter((tool) =>
      tool.toLowerCase().includes(value.toLowerCase())
    );
    this.updatetoolFilter(toolOptions);
  }

  setFilterSearch(e) {
    const value = e.target.value;
    const setOptions = this.dataList.sets.filter((set) =>
      set.toLowerCase().includes(value.toLowerCase())
    );
    this.updateSetFilter(setOptions);
  }

  // fonction permettant d'afficher les données à l'interieur du filtre
  displayFilters() {
    this.updateComponentFilter(this.dataList.components);
    this.updatetoolFilter(this.dataList.tools);
    this.updateSetFilter(this.dataList.sets);
  }

  updateComponentFilter(componentOptions) {
    const componentFilterSection = document.querySelector(".components_filter");
    componentFilterSection.innerHTML = "";
    componentOptions.forEach((componentOption) => {
      const filterChoice = document.createElement("span");
      filterChoice.innerHTML = componentOption;
      componentFilterSection.appendChild(filterChoice);
    });
  }

  updatetoolFilter(toolOptions) {
    const toolFilterSection = document.querySelector(".tools_filter");
    toolFilterSection.innerHTML = "";
    toolOptions.forEach((toolOption) => {
      const filterChoice = document.createElement("span");
      filterChoice.innerHTML = toolOption;
      toolFilterSection.appendChild(filterChoice);
    });
  }

  updateSetFilter(setOptions) {
    const setFilterSection = document.querySelector(".sets_filter");
    setFilterSection.innerHTML = "";
    setOptions.forEach((setOption) => {
      const filterChoice = document.createElement("span");
      filterChoice.innerHTML = setOption;
      setFilterSection.appendChild(filterChoice);
    });
  }

  // permet de creer trois tableaux avec toutes les données
  dataList(recipes) {
    let componentsOption = [];
    let toolOption = [];
    let setOption = [];

    recipes.forEach((recipe) => {
      let ingredientNameList = [];
      recipe.ingredients.forEach((ingredient) => {
        ingredientNameList.push(ingredient.ingredient);
      });
      componentsOption = componentsOption.concat(ingredientNameList);

      toolOption = toolOption.concat(recipe.ustensils);

      setOption.push(recipe.appliance);
    });

    // retourne les trois tableaux
    return {
      components: unique(componentsOption),
      tools: unique(toolOption),
      sets: unique(setOption),
    };
  }
}

function unique(dataList) {
  // permet de supprimer les doublons
  const unique = dataList.filter((v, i, a) => a.indexOf(v) === i);
  // permet de trier par ordre alphabêtique
  return unique.sort((a, b) => a.localeCompare(b));
}

// permet de fermer ou d'ouvrir les filtres
function triggerFilterOptions(element) {
  if (element.classList.contains("opened")) {
    closeFilterOptions(element);
  } else {
    openFilterOptions(element);
  }
}

function closeFilterOptions(element) {
  element.classList.remove("opened");

  const filterLabel = element.querySelector(".filter-label");
  filterLabel.style.display = "flex";
  const filterSearch = element.querySelector(".filter-search");
  filterSearch.style.display = "none";
}

function openFilterOptions(element) {
  element.classList.add("opened");

  const filterLabel = element.querySelector(".filter-label");
  filterLabel.style.display = "none";
  const filterSearch = element.querySelector(".filter-search");
  filterSearch.style.display = "flex";

  const filterInput = element.querySelector("input");
  filterInput.focus();
}
