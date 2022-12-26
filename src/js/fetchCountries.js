export const fetchCountries = function fetchCountries(name) {
    const API = 'https://restcountries.com/v3.1/name/'
  return fetch(
    `${API}${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}