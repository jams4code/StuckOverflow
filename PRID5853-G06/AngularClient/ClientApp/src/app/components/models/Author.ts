
export class Author {
    id : number;
    pseudo: string;
    reputation: number;


    

    constructor(id = null, pseudo = "", reputation = 0) {
        this.id = id;
        this.pseudo = pseudo;
        this.reputation = reputation
    }
}