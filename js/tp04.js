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
let cityFormErrors = [];
citySearchForm.addEventListener('submit', submitCityForm);
loadMoreCities.addEventListener('click', () => displayResult(citysearchResult, cityArray, citysearchResult.childElementCount))

function submitCityForm (evt) {
    cityArray = [];
    citysearchResult.innerHTML = '';
    cityFormErrors = [];
    evt.preventDefault();
    let searchParams = '';
    
    let cityParam = checkCityName(document.getElementById('cityName').value);
    let postcodeParam = checkPostcode(document.getElementById('postcode').value);
    let departmentNbParam = checkDepartmentNb(document.getElementById('departmentNb').value);
    
    searchParams += cityParam ? cityParam : '' ;
    searchParams += postcodeParam ? postcodeParam : '';
    searchParams += departmentNbParam ? departmentNbParam : '';
    
    if (cityFormErrors.length > 0) {
        cityFormErrors.forEach(error => {
            let newLi = document.createElement('li');
            newLi.classList.add('error');
            newLi.textContent = error;
            citysearchResult.appendChild(newLi);
        })
    } else {
        searchCity(searchParams);
    }

}

function checkCityName(cityName) {
    if (cityName) {
        if (!cityName.match(/^[a-zA-Z]+( |-[a-zA-Z]+)*$/)) {
            cityFormErrors.push('Le nom de ville doit être écrit en lettres, avec éventuellement des tirets ou des espaces');
        } else {
            return '&ville=' + cityName.toLowerCase();
        }        
    }
}

function checkPostcode(postcode) {
    if (postcode) {
        if (isNaN(postcode)) {
            cityFormErrors.push('Le code postal doit être un nombre')
        } else if (postcode.length > 5) {
            cityFormErrors.push('Le code postal ne peut pas faire plus de 5 chiffres')
        } else {
            return '&cp=' + postcode;
        }
    }
}

function checkDepartmentNb(departmentNb) {
    if (departmentNb) {
        if (isNaN(departmentNb)) {
            cityFormErrors.push('Le numéro de département doit être un nombre')
        } else if (departmentNb.length > 2) {
            cityFormErrors.push('Le numéro de département ne peut pas faire plus de 5 chiffres')
        } else {
            return '&dp=' + departmentNb;
        }
    }

}

/**
 * 
 * @param {node} DOMTarget DOM node where to display results
 * @param {array} dataArray array from fetch results
 * @param {int} start 
 */
const displayResult = (DOMTarget, dataArray, start = 0) => {
    for (let i = start; i < (start + 4) && i < dataArray.length; i++) {
        let newP = document.createElement('p');
        newP.textContent = dataArray[i].nom;
        DOMTarget.appendChild(newP);
    }
}

async function searchCity(searchParams) {
    await fetch('http://www.citysearch-api.com/fr/city?login=en-deplacement.fr&apikey=so80c85d87dd9158545e74ac49711a659f8f665568' + searchParams)
    .then(response => response.json())
    .then((json) => {
        json.results.forEach(element => cityArray.push({'nom': element.ville, 'code': element.cp}))
        displayResult(citysearchResult, cityArray);
        loadMoreCities.classList.remove('d-none');
    })
    .catch(error => console.log('Request Failed : ', error));
}

// ----------------
// PAYS
// ----------------
const launchCountrySearch = document.getElementById('countryList');
const countryResult = document.getElementById('countryListResult');
const loadMoreCountries = document.getElementById('loadMoreCountries');
let countryArray = [];
launchCountrySearch.addEventListener('click', searchCountry);
loadMoreCountries.addEventListener('click', () => displayResult(countryResult, countryArray, countryResult.childElementCount))

async function searchCountry() {
    countryArray = [];
    countryResult.innerHTML = '';

    await fetch('http://www.citysearch-api.com/fr/pays?login=en-deplacement.fr&apikey=so80c85d87dd9158545e74ac49711a659f8f665568')
    .then(response => response.json())
    .then((json) => {
        json.results.forEach(element => countryArray.push({'nom': element.pays, 'code': element.code}))
        displayResult(countryResult, countryArray);
        loadMoreCountries.classList.remove('d-none');
    })
    .catch(error => console.log('Request Failed : ', error));
}

// ----------------
// REGION
// ----------------
const launchRegionSearch = document.getElementById('regionList');
const regionResult = document.getElementById('regionListResult');
const loadMoreRegions = document.getElementById('loadMoreRegions');
let regionArray = [];
launchRegionSearch.addEventListener('click', searchRegion);
loadMoreRegions.addEventListener('click', () => displayResult(regionResult, regionArray, regionResult.childElementCount))

async function searchRegion() {
    regionArray = [];
    regionResult.innerHTML = '';

    await fetch('http://www.citysearch-api.com/fr/region?login=en-deplacement.fr&apikey=so80c85d87dd9158545e74ac49711a659f8f665568')
    .then(response => response.json())
    .then((json) => {
        json.results.forEach(element => regionArray.push({'nom': element.rg, 'code': element.code}))
        displayResult(regionResult, regionArray);
        loadMoreRegions.classList.remove('d-none');
    })
    .catch(error => console.log('Request Failed : ', error));
}

// ----------------
// DEPARTEMENT
// ----------------
const departmentSearchForm = document.getElementById('departmentSearch');
const departmentsearchResult = document.getElementById('departmentSearchResult');
const loadMoreDepartments = document.getElementById('loadMoreDepartments');
let departmentArray = [];
let departmentErrors = [];
departmentSearchForm.addEventListener('submit', submitDepartmentForm);
loadMoreDepartments.addEventListener('click', () => displayResult(departmentsearchResult, departmentArray, departmentsearchResult.childElementCount))

function submitDepartmentForm (evt) {
    departmentArray = [];
    departmentsearchResult.innerHTML = '';
    departmentErrors = [];
    evt.preventDefault();
    let searchParams = '';
    
    let departmentParam = checkDepartmentName(document.getElementById('departmentName').value);
    let regionCodeParam = checkRegionCode(document.getElementById('regionCode').value);
    
    searchParams += departmentParam ? departmentParam : '' ;
    searchParams += regionCodeParam ? regionCodeParam : '';
    
    if (departmentErrors.length > 0) {
        departmentErrors.forEach(error => {
            let newLi = document.createElement('li');
            newLi.classList.add('error');
            newLi.textContent = error;
            departmentsearchResult.appendChild(newLi);
        })
    } else {
        searchDepartment(searchParams);
    }

}

function checkDepartmentName(departmentName) {
    if (departmentName) {
        if (!departmentName.match(/^[a-zA-Z]+( |-[a-zA-Z]+)*$/)) {
            departmentErrors.push('Le nom de département doit être écrit en lettres, avec éventuellement des tirets ou des espaces');
        } else {
            return '&dp=' + departmentName.toLowerCase();
        }        
    }
}

function checkRegionCode(regionCode) {
    if (regionCode) {
        if (isNaN(regionCode)) {
            departmentErrors.push('Le code région doit être un nombre')
        } else if (regionCode.length > 2) {
            departmentErrors.push('Le code région ne peut pas faire plus de 2 chiffres')
        } else {
            return '&rg=' + regionCode;
        }
    }
}

async function searchDepartment(searchParams) {
    // rg  (int) => code region
    // dp (string) => nom departement
    await fetch('http://www.citysearch-api.com/fr/departement?login=en-deplacement.fr&apikey=so80c85d87dd9158545e74ac49711a659f8f665568' + searchParams)
    .then(response => response.json())
    .then((json) => {
        json.results.forEach(element => departmentArray.push({'nom': element.dp, 'code': element.cp}))
        displayResult(departmentsearchResult, departmentArray);
        loadMoreDepartments.classList.remove('d-none');
    })
    .catch(error => console.log('Request Failed : ', error));
}