// ES 5
function Personne (nom, prenom, pseudo) {
    this.nom = nom;
    this.prenom = prenom;
    this.pseudo = pseudo;

    this.getNomComplet = () => {
        return this.nom + ' ' + this.prenom + ' ' + this.pseudo;
    }

    this.getInitiales = () => {
        return this.prenom.charAt(0) + this.nom.charAt(0);
    }
}
// ES 6
/*class Personne {
    constructor (nom, prenom, pseudo) {
        this.nom = nom;
        this.prenom = prenom;
        this.pseudo = pseudo;
    }

    getNomComplet () {
        return this.nom + ' ' + this.prenom + ' ' + this.pseudo;
    }

    getInitiales() {
        return this.prenom.charAt(0) + this.nom.charAt(0);
    }
}*/

let jules = new Personne('LEMAIRE', 'Jules', 'jules77');
let paul = new Personne('LEMAIRE', 'Paul', 'paul44');

console.log('----------')
console.log(jules.nom);
console.log(jules.prenom);
console.log(jules.pseudo);
console.log(jules.getNomComplet());

console.log('----------AFFICHER PERSONNE')
function afficherPersonne(obj) {
    console.log(obj.nom);
    console.log(obj.prenom);
    console.log(obj.pseudo);
    console.log(obj.getNomComplet()); 
}

afficherPersonne(paul);

// Modifier un objet
console.log('----------Modifier un objet')
jules.pseudo = 'jules44';
console.log(jules.getNomComplet());

// Ajouter une propriété à Personne
console.log('----------Ajouter une propriété à Personne')
console.log(jules.age);
Personne.prototype.age = 'NON RENSEIGNE'
console.log(jules.age);
jules.age = 30
console.log(jules.age);

// Ajouter une méthode à Personne
console.log('----------Ajouter une méthode à Personne')
// /!\ Ne fonctionne pas avec prototype...
// Personne.prototype.getInitiales = () => {
//     return Personne.prototype.prenom.charAt(0) + Personne.prototype.nom.charAt(0);
// }
console.log(jules.getInitiales());

// Objet sans fonction constructeur
console.log('----------Objet sans fonction constructeur')
let robert = {
    prenom: 'Robert',
    nom: 'LEPREFET',
    pseudo: 'robert77',
    
    getNomComplet: () => {
        return robert.nom + ' ' + robert.prenom + ' ' + robert.pseudo;
    }
}

afficherPersonne(robert);

// Héritage via une fonction constructeur
console.log('----------Héritage via une fonction constructeur')

// ES 5
function Client (numeroClient, nom, prenom, pseudo) {
    Personne.call(this, nom, prenom, pseudo); // Ne pas oublier le this
    this.numeroClient = numeroClient;

    this.getInfos = () => {
        return this.numeroClient + ' ' + this.nom + ' ' + this.prenom;
    }
}
// ES 6
/*class Client extends Personne {
    constructor (numeroClient, nom, prenom, pseudo) {
        Personne.call(nom, prenom, pseudo);
        this.numeroClient = numeroClient;
    }

    getInfos () {
        return this.numeroClient + this.nom + this.prenom;
    }
}*/

let steve = new Client('A01', 'LUCAS', 'Steve', 'steve44');
afficherPersonne(steve);
console.log(steve.numeroClient);
console.log(steve.getInfos());