let weatherData;
let search = 'london';
const searchButton = document.querySelector('#form-search');
const searchInput = document.querySelector('#search');

//Fetch data from api

async function getData(search) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=898ea4c6cd7081847d0967e6594eef75`;
    const response = await fetch(url, { mode: 'cors' });
    const data = await response.json();
    weatherData = {
      name: data.name,
      weather: data.weather[0].main,
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
}

getData(search);

searchButton.addEventListener('click', () => {
  search = searchInput.value;
  getData(search);
});
