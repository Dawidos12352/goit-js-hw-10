import './css/styles.css';
import {fetchCountries} from "./fetchCountries";
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const input = document.querySelector("input#search-box");
const countryList = document.querySelector("ul.country-list");
const countryInfo = document.querySelector("div.country-info");

function clearList() {
    countryList.innerHTML = "";
};

function clearInfo() {
    countryInfo.innerHTML = "";
};


function searchCountry(event) {
    const findCountry = event.target.value.trim();
    if (!findCountry) {
        clearList();
        clearInfo();
        return;
    };

    fetchCountries(findCountry).then(country => {
        if (country.length > 10) {
            Notiflix.Notify.info( "Too many matches found. Please enter a more specific name." );
            clearList();
            return;
        } else if ( ( country.length > 1 ) && ( country.length <= 10 ) ) {
            renderList(country);
            clearInfo();
        } else if ( country.length === 1 ) {
            renderInfo(country);
            clearList();
        };

    }).catch(error => {
        Notiflix.Notify.failure( "Oops, there is no country with that name" );
        clearInfo();
        clearList();
        return error;
    });

};


function renderList(country) {

    const listMarkup = country.map(({ name, flags }) => {
        return `<li> <img src="${flags.svg}" alt="${name.official}" width="30px" height="20px" /> ${name.official} </li>`
    }).join("");

    countryList.innerHTML = listMarkup;
};

function renderInfo(country) {

    const infoMarkup = country.map(({ name, capital, population, flags, languages }) => {
        return `<h1 class="countryName"> <img src="${flags.svg}" alt="${name.official}" width="100px" /> ${name.official} </h1>
        <p><b>Capital: </b> ${capital} </p>
        <p><b>Population: </b> ${population} </p>
        <p><b>Languages: </b> ${Object.values(languages)} </p>` 
    }).join("");

    countryInfo.innerHTML = infoMarkup;

};





input.addEventListener("input", debounce(searchCountry, DEBOUNCE_DELAY));