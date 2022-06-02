import { Receipe } from "../models/receipe.js";
export class ReceipeFactory {
    constructor(data,type) {
        if (type ==="json") {
            return new Receipe(data);
        } else {
            console.log("La factory receipe ne connait pas le type" + type);
        }
    }
}

