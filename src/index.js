import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),    
  countryInfo: document.querySelector('.country-info')
}

refs.input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onClearInput() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function onSearchCountry(e) {
  e.preventDefault();
  let inputValue = refs.input.value.trim();
  if (inputValue == "" ) {
    refs.countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(inputValue).then(createCountryMarkup).catch(onError);
}

function onError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function createCountryMarkup(data) {
  if (2 <= data.length && data.length <= 10) {
    getListOfCountries(data);
    return;
  } else if (data.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  addCountryMarkup(data);
}


function getListOfCountries(data) {
  onClearInput();
  const markup = data
    .map(({ name, flags }) => {
      return `<li class='country'>
      <h3><img width="35" height="25" src="${flags.svg}"</img>
      ${name.official}</h3>
        </li> `;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function addCountryMarkup(data) {
  onClearInput();
  const markup = data
    .map(({ name, flags, capital, population, languages }) => {
      return `
      <div class='country'>
      <h2><img width="35" height="25" src="${flags.svg}"</img>
      ${name.official}</h2>
      <div class='country__info'>
      <p>Capital: ${capital[0]}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages).toString()}</p></div>
      </div>
     `;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}


