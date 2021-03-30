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

function checkCityName(cityName, formNb = 0) {
    let errorArray = chooseErrorArray(formNb);

    if (cityName) {
        if (!cityName.match(/^[a-zA-Z]+( |-[a-zA-Z]+)*$/)) {
            errorArray.push('Le nom de ville doit être écrit en lettres, avec éventuellement des tirets ou des espaces');
        } else {
            return '&ville=' + cityName.toLowerCase();
        }        
    }
}

function chooseErrorArray(formNb) {
    if (formNb === 0) {
        return cityFormErrors;
    } else if (formNb === 1) {
        return departmentErrors;
    } else if (formNb === 2) {
        return dynamicErrors;
    }else if (formNb === 3) {
        return regionFormErrors;
    }
}

function checkPostcode(postcode, formNb = 0) {
    let errorArray = chooseErrorArray(formNb);

    if (postcode) {
        if (isNaN(postcode)) {
            errorArray.push('Le code postal doit être un nombre')
        } else if (postcode.length > 5) {
            errorArray.push('Le code postal ne peut pas faire plus de 5 chiffres')
        } else if (formNb === 2 || formNb === 3) {
            return postcode;
        } else {
            return '&cp=' + postcode;
        }
    }
}

function checkDepartmentNb(departmentNb, formNb = 0) {
    let errorArray = chooseErrorArray(formNb);
    
    if (departmentNb) {
        if (isNaN(departmentNb)) {
            errorArray.push('Le numéro de département doit être un nombre')
        } else if (departmentNb.length > 2) {
            errorArray.push('Le numéro de département ne peut pas faire plus de 5 chiffres')
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

async function searchCity(searchParams, formNb = 0) {
    await fetch('http://www.citysearch-api.com/fr/city?login=en-deplacement.fr&apikey=so80c85d87dd9158545e74ac49711a659f8f665568' + searchParams)
    .then(response => response.json())
    .then((json) => {
        if (formNb === 0) {
            json.results.forEach(element => cityArray.push({'nom': element.ville, 'code': element.cp}))
            displayResult(citysearchResult, cityArray);
            loadMoreCities.classList.remove('d-none');
        } else if (formNb === 2) {
            json.results.forEach(element => dynamicCityArray.push({'nom': element.ville, 'code': element.cp}))
            loadCityOptions('selectCity', dynamicCityArray);
        } else if (formNb === 3) {
            json.results.forEach(element => regionSearchCityArray.push({'nom': element.ville, 'code': element.cp}))
            loadCityOptions('regionSearch--selectCity', regionSearchCityArray);
        }
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

async function searchRegion(formNb = false) {
    regionArray = [];
    regionResult.innerHTML = '';

    await fetch('http://www.citysearch-api.com/fr/region?login=en-deplacement.fr&apikey=so80c85d87dd9158545e74ac49711a659f8f665568')
    .then(response => response.json())
    .then((json) => {
        json.results.forEach(element => regionArray.push({'nom': element.rg, 'code': element.code}))
        if (!formNb) {
            displayResult(regionResult, regionArray);
            loadMoreRegions.classList.remove('d-none');
        } else if (formNb === 3) {
            json.results.forEach(region => {
                searchDepartment('&rg=' + region.code, 3)
            })
        }
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

function checkDepartmentName(departmentName, formNb = 1) {
    let errorArray = chooseErrorArray(formNb);
    
    if (departmentName) {
        if (!departmentName.match(/^[a-zA-Z]+( |-[a-zA-Z]+)*$/)) {
            errorArray.push('Le nom de département doit être écrit en lettres, avec éventuellement des tirets ou des espaces');
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

async function searchDepartment(searchParams, formNb = 1) {
    // rg  (int) => code region
    // dp (string) => nom departement
    await fetch('http://www.citysearch-api.com/fr/departement?login=en-deplacement.fr&apikey=so80c85d87dd9158545e74ac49711a659f8f665568' + searchParams)
    .then(response => response.json())
    .then((json) => {
        if (formNb === 1) {
            json.results.forEach(element => departmentArray.push({'nom': element.dp, 'code': element.cp}))
            displayResult(departmentsearchResult, departmentArray);
            loadMoreDepartments.classList.remove('d-none');
        } else if (formNb === 2) {
            json.results.forEach(element => dynamicDepartmentArray.push({'nom': element.dp, 'code': element.cp}))
            loadDepartmentsOptions('selectDepartment', dynamicDepartmentArray);
        } else if (formNb === 3) {
            json.results.forEach(element => regionSearchDepartmentArray.push({'nom': element.dp, 'code': element.cp, 'rg': searchParams.slice(4)}))
            regionCount++;
            if (regionCount === 13) { // quand toutes les régions ont chargé leurs départements
                determineCityRegion();
            }
        }
    })
    .catch(error => console.log('Request Failed : ', error));
}

// ----------------
// Recherche Dynamique
// ----------------
const dynamicSearchForm = document.getElementById('dynamicSearch');
const dynamicsearchResult = document.getElementById('dynamicSearchResult');
const dynamicSubmit = document.getElementById('dynamicSubmit');
let dynamicDepartmentArray = [];
let dynamicCityArray = [];
let dynamicErrors = [];
dynamicSearchForm.addEventListener('submit', submitDynamicForm);

function submitDynamicForm (evt) {
    dynamicDepartmentArray = [];
    dynamicsearchResult.innerHTML = '';
    dynamicErrors = [];
    evt.preventDefault();
    
    let departmentParam = checkDepartmentName(document.getElementById('dynamicDepartmentName').value, 2);
    let departmentCode = checkDepartmentNb(document.getElementById('selectDepartment').value, 2);
    let postcode = checkPostcode(document.getElementById('selectCity').value, 2);

    if (dynamicErrors.length > 0) {
        dynamicErrors.forEach(error => {
            let newLi = document.createElement('li');
            newLi.classList.add('error');
            newLi.textContent = error;
            dynamicsearchResult.appendChild(newLi);
        })
    } else if (postcode) {
        let cityName = document.getElementById('selectCity').querySelector('option:checked').textContent;
        // afficher le code postal de la ville
        let newP = document.createElement('p');
        newP.textContent = 'Le code postal de ' + cityName + ' est : ' + postcode + '.'
        dynamicsearchResult.appendChild(newP);
    } else if (departmentCode) {
        searchCity(departmentCode, 2);
        dynamicSubmit.textContent = 'Obtenir le code postal';
    } else if (departmentParam) {
        searchDepartment(departmentParam, 2);
    }
    
}

function loadDepartmentsOptions (selectId, dataArray) {
    let selectDepartment = document.getElementById(selectId);
    selectDepartment.parentNode.classList.remove('d-none');
    dataArray.forEach(department => {
        let newOption = document.createElement('option');
        newOption.textContent =  department.nom + ' - ' + department.code;
        newOption.setAttribute('value', department.code)
        selectDepartment.appendChild(newOption);
    })
}

function loadCityOptions (selectId, dataArray) {
    let selectCity = document.getElementById(selectId);
    selectCity.parentNode.classList.remove('d-none');
    dataArray.forEach(ville => {
        let newOption = document.createElement('option');
        newOption.textContent =  ville.nom + ' - ' + ville.code;
        newOption.setAttribute('value', ville.code)
        selectCity.appendChild(newOption);
    })
}

// ----------------
// Recherche Dynamique 2
// ----------------
const regionSearchForm = document.getElementById('regionSearch');
const regionSearchResult = document.getElementById('regionSearchResult');
let regionSearchCityArray = [];
let regionSearchDepartmentArray = [];
let cityDepartment = {};
let cityData = {};
let regionFormErrors = [];
let regionCount = 0;
regionSearchForm.addEventListener('submit', submitRegionForm);

function submitRegionForm (evt) {
    regionSearchResult.innerHTML = '';
    regionFormErrors = [];
    evt.preventDefault();

    let cityParam = checkCityName(document.getElementById('regionSearch--cityName').value, 3);
    let postcode = checkPostcode(document.getElementById('regionSearch--selectCity').value, 3);

    if (regionFormErrors.length > 0) {
        regionFormErrors.forEach(error => {
            let newLi = document.createElement('li');
            newLi.classList.add('error');
            newLi.textContent = error;
            regionSearchResult.appendChild(newLi);
        })
    } else if (postcode) {
        cityData.cityName = document.getElementById('regionSearch--selectCity').querySelector('option:checked').textContent.split(' ')[0];
        cityData.postcode = postcode;
        searchRegion(3);
    } else if (cityParam) {
        searchCity(cityParam, 3);
    } 
}

function determineCityRegion () {
    // console.log(regionSearchDepartmentArray)
    // console.log(regionArray)

    let postcode = checkPostcode(document.getElementById('regionSearch--selectCity').value, 3);
    let department = regionSearchDepartmentArray.filter(item => item.code == postcode.slice(0, 2));
    cityData.departmentName = department[0].nom;
    cityData.departmentNb = department[0].code;
    cityData.regionNb = department[0].rg;

    cityData.regionName = regionArray.find(region => region.code == cityData.regionNb).nom;
    let newP = document.createElement('p');
    newP.innerHTML = '<strong>' + cityData.cityName + '</strong></br>Département : ' + cityData.departmentName + ' (' + cityData.departmentNb + ')</br>Région : ' + cityData.regionName + '.'
    regionSearchResult.appendChild(newP);
}
