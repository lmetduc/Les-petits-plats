export class ReceipeCard {
    constructor(receipe) {
        this.receipe =receipe;
    }
    getUserCardDOM() {
        const article = document.createElement("article");
        article.classList.add("receipe-card");

        const receipeInfo = document.createElement("div");
        receipeInfo.classList.add("info_receipe");

        const receipeName = document.createElement("div");
        receipeName.classList.add("receipe_name");
        receipeName.textContent = this.receipe.name;
        receipeInfo.appendChild(receipeName);

        const receipeTime = document.createElement("div");
        receipeTime.classList.add("receipe_time");
        receipeTime.textContent = `${this.receipe.time} min`;
        receipeInfo.appendChild(receipeTime);

        const receipeIngredient = document.createElement("div");
        receipeIngredient.classList.add("receipe_ingredient");
        receipeIngredient.textContent = this.receipe.ingredients?.map(ingredient => ingredient.unit);
        receipeInfo.appendChild(receipeIngredient);
        console.log(this.receipe.ingredients);

        const receipeDescription = document.createElement("div");
        receipeDescription.classList.add("receipe_description");
        receipeDescription.textContent = this.receipe.description;
        receipeInfo.appendChild(receipeDescription);





        article.appendChild(receipeInfo);

        return article;

    }
}