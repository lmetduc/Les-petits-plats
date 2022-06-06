import { displayData } from "../pages/index.js";
import { getRecipes } from "../pages/index.js";

const filterSelect = document.querySelectorall(".filter");
const filterSelectLabel = document.querySelector(".filter__select label");
const filterSelectChoice = document.querySelector(".filter_select_choice");

filterSelect.addEventListener("click", displayChoices);

function displayChoices() {
    filterSelectChoice.style.display = "block"
    filterSelectChoice.innerHTML = "";
    buildSelectBox();
    filterSelect.style.display = "none";
}

function closeOptions() {
    filterSelectOption.style.display = "none";
    filterSelect.style.display = "flex";
}

function updateValue(value) {
    filterSelectLabel.innerHTML = value;
  }

function sortMedias(sortType) {
    let mediasSorted = recipes.ingredient;
    mediasSorted = medias.sort((a, b) => b.likes - a.likes);
    displayData(mediasSorted);
}

function buildSelectBox() {
    let orderedSortOptions = [];
    sortOptions.forEach((s) => {
      if (s.value !== currentSort) {
        orderedSortOptions.push(s);
      }
    });
  
    // construit l'élément pour le tri actuellement sélectionné
    const currentSortSpan = document.createElement("span");
    currentSortSpan.classList.add(
      "select__option",
      "selected__option",
      currentSort
    );
    const currentSortLabel = document.createElement("label");
    currentSortLabel.innerHTML = currentSortName;
    const arrowIcon = document.createElement("i");
    arrowIcon.classList.add("filter__arrow", "fas", "fa-angle-up");
  
    currentSortSpan.appendChild(currentSortLabel);
    currentSortSpan.appendChild(arrowIcon);
    currentSortSpan.addEventListener("click", closeOptions);
    filterSelectOption.appendChild(currentSortSpan);
  
    // ajoute les autres tri possibles
    orderedSortOptions.forEach((o) => {
      const sortSpan = document.createElement("span");
      sortSpan.classList.add("select__option", o.value);
      sortSpan.innerHTML = o.name;
      sortSpan.addEventListener("click", function () {
        filterSelected(o.value, o.name);
      });
      filterSelectOption.appendChild(sortSpan);
    });
}

function filterSelected(sort, sortName) {
    sortMedias(sort);
    closeOptions();
    updateValue(sort);
}

