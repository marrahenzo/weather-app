let weatherData = {
  name: 'Unknown',
  weather: 'Unknown',
  weatherDescription: 'Unknown',
  icon: 'Unknown',
  temp: {
    temp: 'Unknown',
    temp_max: 'Unknown',
    temp_min: 'Unknown',
    feels_like: 'Unknown',
    humidity: 'Unknown'
  },
  wind: {
    speed: 'Unknown'
  },
  sunrise: 'Unknown',
  sunset: 'Unknown'
};
let search;
let currentUnit = 'C';

//DOM element references

const body = document.querySelector('body');
const form = document.querySelector('form');
const searchInput = document.querySelector('#search-input');
const regionText = document.querySelector('#location');
const descriptionText = document.querySelector('#description');
const temperatureNumber = document.querySelector('#temperature-number');
const temperatureUnit = document.querySelector('#temperature-unit');
const weatherIcon = document.querySelector('#weather');
const feelsLikeText = document.querySelector('#feels-like');
const maxTempText = document.querySelector('#max-temp');
const minTempText = document.querySelector('#min-temp');
const windText = document.querySelector('#wind');
const humidityText = document.querySelector('#humidity');
const loadScreen = document.querySelector('#loading-screen');
const tempSwitch = document.querySelector('#temp-switch');

//If a search was done, gather info from url

const queryString = window.location.search;
const params = new URLSearchParams(queryString).get('search');
if (params !== '') search = params;

//Fetch data from api

async function getData(search) {
  tempSwitch.textContent = 'Switch to Fahrenheit';
  currentUnit = 'C';
  loadScreen.classList.remove('inactive');
  search = searchInput.value;
  if (search === '') search = 'London';
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=898ea4c6cd7081847d0967e6594eef75&units=metric`;
    const response = await fetch(url, { mode: 'cors' });
    const data = await response.json();
    weatherData = {
      name: data.name,
      weather: data.weather[0].main,
      weatherDescription: data.weather[0].description,
      icon: data.weather[0].icon,
      temp: data.main,
      wind: data.wind
    };
  } catch {
    for (const key in weatherData) {
      weatherData.key = 'Unknown';
    }
  }
  updateDOM(weatherData);
}

//Put api data into DOM elements

function updateDOM(data) {
  regionText.textContent = data.name;
  descriptionText.textContent =
    data.weatherDescription.charAt(0).toUpperCase() +
    data.weatherDescription.slice(1);
  if (descriptionText.textContent.includes('Clear')) body.className = 'clear';
  else if (descriptionText.textContent.includes('clouds'))
    body.className = 'cloud';
  else if (descriptionText.textContent.includes('rain'))
    body.className = 'rain';
  else if (descriptionText.textContent.includes('thunderstorm'))
    body.className = 'thunder';
  else if (descriptionText.textContent.includes('snow'))
    body.className = 'snow';
  else if (descriptionText.textContent.includes('mist'))
    body.className = 'mist';
  temperatureNumber.textContent = data.temp.temp;
  temperatureUnit.textContent = `°${currentUnit}`;
  if (data.icon !== 'Unknown')
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.icon}@4x.png`;
  feelsLikeText.textContent = `Feels like: ${data.temp.feels_like}°${currentUnit}`;
  maxTempText.textContent = `Max: ${data.temp.temp_max}°${currentUnit}`;
  minTempText.textContent = `Min: ${data.temp.temp_min}°${currentUnit}`;
  windText.textContent = `Wind: ${data.wind.speed} km/h`;
  humidityText.textContent = `Humidity: ${data.temp.humidity}%`;
  searchInput.placeholder = data.name;
  searchInput.value = '';
  loadScreen.classList.add('inactive');
}

function celsiusToFahrenheit(deg) {
  return ((deg * 9) / 5 + 32).toFixed(2);
}

function fahrenheitToCelsius(deg) {
  return (((deg - 32) * 5) / 9).toFixed(2);
}

getData(search);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  getData();
});

tempSwitch.addEventListener('click', function () {
  if (currentUnit === 'C') {
    currentUnit = 'F';
    weatherData.temp.temp = celsiusToFahrenheit(weatherData.temp.temp);
    weatherData.temp.feels_like = celsiusToFahrenheit(
      weatherData.temp.feels_like
    );
    weatherData.temp.temp_max = celsiusToFahrenheit(weatherData.temp.temp_max);
    weatherData.temp.temp_min = celsiusToFahrenheit(weatherData.temp.temp_min);
    this.textContent = 'Switch to Celsius';
  } else {
    currentUnit = 'C';
    weatherData.temp.temp = fahrenheitToCelsius(weatherData.temp.temp);
    weatherData.temp.feels_like = fahrenheitToCelsius(
      weatherData.temp.feels_like
    );
    weatherData.temp.temp_max = fahrenheitToCelsius(weatherData.temp.temp_max);
    weatherData.temp.temp_min = fahrenheitToCelsius(weatherData.temp.temp_min);
    this.textContent = 'Switch to Fahrenheit';
  }
  updateDOM(weatherData);
});
