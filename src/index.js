import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const country = refs.input.value.trim();
  if (!country) {
    clearMarkup();
    return;
  }

  fetchCountries(country)
    .then(data => {
      if (data.length >= 10) {
        clearMarkup();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length >= 2 && data.length <= 10) {
        clearMarkup();
        createCountryName(data);
      }
      if (data.length === 1) {
        clearMarkup();
        createCountryData(data);
        createCountryName(data);
      }
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function createCountryName(arrayCountryName) {
  const countryCardMarkup = arrayCountryName
    .map(({ name, flags }) => {
      return `<li class = "country-list__item"><img src="${flags.svg}" alt="${name.common}" ><span class = "country-list__name">${name.official}</span></li>`;
    })
    .join('');
  refs.countryList.innerHTML = countryCardMarkup;
}

function createCountryData(countryName) {
  const countryCardMarkup = countryName.map(
    ({ capital, population, languages }) => {
      return `<p class = "country-info__data"><b>Capital:</b> ${capital}</p>
      <p class = "country-info__data"><b>Population:</b> ${population}</p>
      <p class = "country-info__data"><b>Languages:</b> ${Object.values(
        languages
      ).join(', ')}</p>`;
    }
  );
  refs.countryInfo.innerHTML = countryCardMarkup;
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
