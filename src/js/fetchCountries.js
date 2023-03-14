export { fetchCountries };

function fetchCountries(name) {
    fetch('https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages')
    .then(response => {
        return response.json();
        
}).catch(error => {
    console.log(error);
});
}