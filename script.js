let weatherData;
let search = 'london';
let currentUnit = 'C';

//DOM element references

const searchButton = document.querySelector('#form-search');
const searchInput = document.querySelector('#search');
const regionText = document.querySelector('#location');
const temperatureNumber = document.querySelector('#temperature-number');
const temperatureUnit = document.querySelector('#temperature-unit');
const feelsLikeText = document.querySelector('#feels-like');
const maxTempText = document.querySelector('#max-temp');
const minTempText = document.querySelector('#min-temp');
const windText = document.querySelector('#wind');
const humidityText = document.querySelector('#humidity');

//If a search was done, gather info from url

const queryString = window.location.search;
const params = new URLSearchParams(queryString).get('search');
if (params !== '') search = params;

//Fetch data from api

async function getData(search) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=898ea4c6cd7081847d0967e6594eef75&units=metric `;
    const response = await fetch(url, { mode: 'cors' });
    const data = await response.json();
    weatherData = {
      name: data.name,
      weather: data.weather[0].main,
      weatherDescription: data.weather[0].description,
      temp: data.main,
      wind: data.wind,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset
    };
  } catch {
    for (const key in weatherData) {
      weatherData[key] = 'Unknown';
    }
  }
  console.log(weatherData);
  updateDOM(weatherData);
}

//Put api data into DOM elements

function updateDOM(data) {
  regionText.textContent = data.name;
  temperatureNumber.textContent = data.temp.temp;
  temperatureUnit.textContent = `°${currentUnit}`;
  feelsLikeText.textContent = `Feels like: ${data.temp.feels_like}°${currentUnit}`;
  maxTempText.textContent = `Max: ${data.temp.temp_max}`;
  minTempText.textContent = `Min: ${data.temp.temp_min}`;
  windText.textContent = `Wind: ${data.wind.speed} km/h`;
  humidityText.textContent = `Humidity: ${data.temp.humidity}%`;
}

getData(search);

searchButton.addEventListener('click', () => {
  search = searchInput.value;
  getData(search);
});
