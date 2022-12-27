import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
let debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 500;
const INFORM_USER =
  'Too many matches found. Please enter a more specific name.';
const ERROR_MESSAGE = 'Oops, there is no country with that name';

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(onInputNameCountry, DEBOUNCE_DELAY)
);

function onInputNameCountry(e) {
  let nameCountry = e.target.value.trim();
  if (nameCountry) {
    fetchCountries(nameCountry)
      .then(response => {
        const lengthArrCountry = response.length;
        if (lengthArrCountry > 10) {
          Notiflix.Notify.info(INFORM_USER);
        } else if (lengthArrCountry < 10 && lengthArrCountry > 1) {
          if (refs.countryInfo.innerHTML) {
            refs.countryInfo.innerHTML = '';
          }
          refs.countryList.innerHTML += addsCountryList(response);
        } else if (lengthArrCountry === 1) {
          refs.countryList.innerHTML = '';
          if (refs.countryInfo.innerHTML) {
            refs.countryInfo.innerHTML = '';
          }
          refs.countryInfo.innerHTML += addsCountryInfoCard(response);
          // e.target.value = ''
        }
      })
      .catch(error => {
        clearListAndCard();
        Notiflix.Notify.failure(ERROR_MESSAGE);
      });
  } else if (nameCountry === '') {
    clearListAndCard();
  }
}

function addsCountryInfoCard(arrCountry) {
  return arrCountry.map(
    ({
      name: { official },
      capital,
      population,
      flags: { svg },
      languages,
    }) => {
      return `<div>
      <div class='country-titel'><img src="${svg}">
      <p class='titel'>${official}</p></div>
      <div>Capital: ${capital}</div>
      <div>Population: ${population}</div>
      <div>Languages: ${Object.values(languages)} </div>
      </div>`;
    }
  );
}

function addsCountryList(arrCountries) {
  return arrCountries
    .map(({ name: { common }, flags: { svg } }) => {
      return `<li class= 'country-item'>
    <img src="${svg}"width="30" height="15">
    <p class='titel'>${common}</p>
    </li>`;
    })
    .join('');
}

function clearListAndCard() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
