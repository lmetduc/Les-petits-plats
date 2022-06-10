//permet de selectionner chaque filtre

const componentsFilterButton = document.querySelector(".components");
const toolsFilterButton = document.querySelector(".tools");
const setsFilterButton = document.querySelector(".sets");

// permet de déclencher au clic differentes fonctions telles que l'ouverture du filtre, sa fermeture et celle des autres lorsque l'un d'eux est deja selectionné

componentsFilterButton.addEventListener("click", function() {
    triggerFilterOptions(componentsFilterButton);
    closeFilterOptions(toolsFilterButton);
    closeFilterOptions(setsFilterButton);
});
toolsFilterButton.addEventListener("click", function() {
    triggerFilterOptions(toolsFilterButton);
    closeFilterOptions(componentsFilterButton);
    closeFilterOptions(setsFilterButton);
});
setsFilterButton.addEventListener("click", function() {
    triggerFilterOptions(setsFilterButton);
    closeFilterOptions(toolsFilterButton);
    closeFilterOptions(componentsFilterButton);
});


// fonction permettant d'afficher les données à l'interieur du filtre
export function displayFilters (recipes) {
    const componentFilterSection = document.querySelector(".components_filter");
    const toolFilterSection = document.querySelector(".tools_filter");
    const setFilterSection = document.querySelector(".sets_filter");
    const options = dataList(recipes);

    options.components.forEach((componentOption) => {
      const filterChoice = document.createElement("span");
      filterChoice.innerHTML = componentOption ;
      componentFilterSection.appendChild(filterChoice);
    });

    options.tools.forEach((toolOption) => {
      const filterChoice = document.createElement("span");
      filterChoice.innerHTML = toolOption ;
      toolFilterSection.appendChild(filterChoice);
    });

    options.sets.forEach((setOption) => {
      const filterChoice = document.createElement("span");
      filterChoice.innerHTML = setOption ;
      setFilterSection.appendChild(filterChoice);
    });
}

// permet de creer trois tableaux avec toutes les données
function dataList (recipes) {
    let componentsOption = [];
    let toolOption = [];
    let setOption = [];

    recipes.forEach(recipe => {
        let ingredientNameList = [];
        recipe.ingredients.forEach(ingredient => {
            ingredientNameList.push(ingredient.ingredient);
        })
        componentsOption = componentsOption.concat(ingredientNameList);
        
        toolOption = toolOption.concat(recipe.ustensils);

        setOption.push(recipe.appliance);
    });

    return {
        components: unique(componentsOption),
        tools: unique(toolOption),
        sets: unique(setOption)
    };
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
        element.classList.add("opened");
    }
}

function closeFilterOptions(element) {
    element.classList.remove("opened");
}
