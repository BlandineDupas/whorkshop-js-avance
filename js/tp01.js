console.log('01 - Fonctions');

// Définition d'une fonction
let nombre1 = 10;
let nombre2 = 20;

function additionner (nb1, nb2) {
    return nb1 + nb2;
}

let resultat1 = additionner(nombre1, nombre2);
console.log('resultat1 : ', resultat1);

// Variable de type fonction
let somme = additionner;
let resultat2 = somme(nombre1, nombre2);
console.log('resultat2 : ', resultat2);

let multiplication = function (nb1, nb2) {
    return nb1 * nb2;
}
let resultat3 = multiplication(nombre1, nombre2);
console.log('resultat3 : ', resultat3);

// Fonction comme élément du premier ordre
let afficherOperation = function (nomOperation, operation, nb1, nb2) {
    console.log(nomOperation + '(' + nb1 +', ' + nb2 + ') = ' + operation(nb1, nb2))
}
afficherOperation('Somme', somme, 20, 40);
afficherOperation('Multiplication', multiplication, 10, 20);
afficherOperation('Soustraction', (nb1, nb2) => nb1 - nb2, 15, 5);
