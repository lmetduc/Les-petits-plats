import { ReceipeCard } from "../templates/receipeCard.js";
import { ReceipeFactory } from "../factories/receipeFactory.js";

async function getReceipes() {
    const { receipes } = await fetch("data/receipe.json").then(
    (data) => data.json()
);

let receipeList = [];
receipes.forEach((receipe) => {
    const receipeModel = new ReceipeFactory(receipe, "json");
    receipeList.push(receipeModel);
});
    return receipeList;
}

async function displayData(receipes) {
    const receipesSection = document.querySelector(".card");

    receipes.forEach((receipe) => {
        const receipeCard = new ReceipeCard(receipe);
        const userCardDOM = receipeCard.getUserCardDOM();
        receipesSection.appendChild(userCardDOM);
    });
}

async function init() {
    const receipes = await getReceipes();
    displayData(receipes);
}

init();