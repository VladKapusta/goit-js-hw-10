import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
let debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 500;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(onInputSearchCountri, DEBOUNCE_DELAY)
);

function onInputSearchCountri(e) {
  let nameCountri = e.target.value.trim();
  if (nameCountri) {
    fetchCountries(nameCountri)
      .then(response => {
        const lengthArrCountry = response.length;
        if (lengthArrCountry > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (lengthArrCountry < 10 && lengthArrCountry > 1) {
          if (refs.countryInfo.innerHTML) {
            refs.countryInfo.innerHTML = '';
          }
          addsCountryList(response);
        } else if (lengthArrCountry === 1) {
          refs.countryList.innerHTML = '';
          if (refs.countryInfo.innerHTML) {
            refs.countryInfo.innerHTML = '';
          }
          addsCountryInfoCard(response);
          // e.target.value = ''
        }
      })
      .catch(error =>
        Notiflix.Notify.failure('Oops, there is no country with that name')
      );
  } else if (nameCountri === '') {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
  }
}

function addsCountryInfoCard(arrCountry) {
  arrCountry.map(
    ({
      name: { official },
      capital,
      population,
      flags: { svg },
      languages,
    }) => {
      const cardCountry = `<div>
      <div class='country-titel'><img src="${svg}">
      <p class='titel'>${official}</p></div>
      <div>Capital: ${capital}</div>
      <div>Population: ${population}</div>
      <div>Languages: ${Object.values(languages)} </div>
      </div>`;
      refs.countryInfo.innerHTML += cardCountry;
    }
  );
}

function addsCountryList(arrCountries) {
  arrCountries.map(({ name: { common }, flags: { svg } }) => {
    const listCountry = `<li class= 'country-item'>
    <img src="${svg}"width="30" height="15">
    <p class='titel'>${common}</p>
    </li>`;
    refs.countryList.innerHTML += listCountry;
  });
}
