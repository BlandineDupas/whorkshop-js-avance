/*
1 - Rechercher les communes et les Code Postaux selon les villes saisies (4 maxi)
2 - Rechercher les Pays : Afficher les villes du Pays
3 - Rechercher les Régions :
    Afficher les villes par rapport au Régions et de pouvoir cliquer sur une ville pour afficher les communes s'il y en a.

Utiliser des css et js pour que tout soit dynamque et fluide.
*/
const citySearchForm = document.getElementById('citySearch');
const citysearchResult = document.getElementById('citySearchResult');
const loadMoreCities = document.getElementById('loadMoreCities');
let cityArray = [];
let errors = [];

function checkForm (evt) {
    evt.preventDefault();
    let cityName = document.getElementById('cityName').value;
    let postcode = document.getElementById('postcode').value;
    let departmentNb = document.getElementById('departmentNb').value;
    let searchParams = '';

    if (cityName) {
        if (!cityName.match(/^[a-zA-Z]+( |-[a-zA-Z]+)*$/)) {
            errors.push('Le nom de ville doit être écrit en lettres, avec éventuellement des tirets ou des espaces');
        } else {
            searchParams += '&ville=' + cityName.toLowerCase();
        }
        console.log(cityName);
        
    }
    if (postcode) {
        if (isNaN(postcode)) {
            errors.push('Le code postal doit être un nombre')
        } else if (postcode.length > 5) {
            errors.push('Le code postal ne peut pas faire plus de 5 chiffres')
        } else {
            searchParams += '&cp=' + postcode;
        }
        console.log(postcode);
    }
    if (departmentNb) {
        if (isNaN(departmentNb)) {
            errors.push('Le numéro de département doit être un nombre')
        } else if (departmentNb.length > 2) {
            errors.push('Le numéro de département ne peut pas faire plus de 5 chiffres')
        } else {
            searchParams += '&dp=' + departmentNb;
        }
        console.log(departmentNb);
    }

    if (errors.length > 0) {
        errors.forEach(error => {
            let newLi = document.createElement('li');
            newLi.textContent = error;
            citysearchResult.appendChild(newLi);
        })
    } else {
        searchCity(searchParams);
    }

}

const displayResult = (start) => {
    for (let i = start; i < (start + 4); i++) {
        let newP = document.createElement('p');
        newP.textContent = cityArray[i].ville;
        citysearchResult.appendChild(newP)
    }
}

loadMoreCities.addEventListener('click', () => displayResult(citysearchResult.childElementCount) )
citySearchForm.addEventListener('submit', checkForm);

async function searchCity(searchParams) {

    await fetch('http://www.citysearch-api.com/fr/city?login=en-deplacement.fr&apikey=so80c85d87dd9158545e74ac49711a659f8f665568' + searchParams)
    .then(response => response.json())
    .then((json) => {
        cityArray = json.results;
        console.log(json);
        displayResult(0);
    })
    .catch(error => console.log('Request Failed : ', error));
}