import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const searchQuery = e.target.value.trim();
  if (searchQuery === '') {
    clearMarkup();
    return;
  }
  fetchCountries(searchQuery)
    .then(handleError)
    .then(onFetch)
    .catch(fetchError);
}

function onFetch(data) {
  if (data.length >= 10) {
    Notify.info(
      'Too many matches found. Please enter a more specific name.',
      notificationOptions
    );
  }  else if (data.length > 1 && data.length < 10) {
    showFlag(data);
  } else if (data.length === 1) {
    showInfo(data);
  }
}

function handleError(data) {
  if (data.status === 404) {
    throw new Error(data.message);
  }
  return data;
}

function fetchError(error) {
  console.log(error.message);
  clearMarkup();
  Notify.failure(
    'Oops, there is no country with that name',
    notificationOptions
  );
}

function showFlag(countries) {
  clearMarkup();
  const markup = countries
    .map(
      country =>
        `<li class="country"><img src='${country.flags.svg}' width=30 height=20 alt="${country.flags.alt}"><p class="name">${country.name.common}</p></li>`
    )
    .join('');
  refs.countriesList.insertAdjacentHTML('afterbegin', markup);
}

function showInfo(country) {
  clearMarkup();
  const languages = [];
  Object.entries(country[0].languages).forEach(([key, value]) => {
    languages.push(value);
  });

  const markup = `<ul class="country-full">
        <li class="country"><img src='${
          country[0].flags.svg
        }' width=30 height=20 alt="${country[0].flags.alt}">
            <p class="name">${country[0].name.common}</p>
        </li>
        <li class="country"><span class="name">Capital:</span> ${
          country[0].capital
        }</li>
        <li class="country"><span class="name">Population:</span> ${
          country[0].population
        }</li>
        <li class="country"><span class="name">Languages:</span> ${languages.join(
          ', '
        )}</li>
    </ul>`;
  refs.countryData.innerHTML = markup;
}

function clearMarkup() {
  refs.countriesList.innerHTML = '';
  refs.countryData.innerHTML = '';
}