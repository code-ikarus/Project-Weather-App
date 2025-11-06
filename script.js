const API_KEY = "TUNKX87B46YQ828TXTBZZ27G3"

async function getWeatherData(location) {
const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${API_KEY}&contentType=json`;

try {
  const response = await fetch(apiUrl);
  
  if (!response.ok){
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();

  console.log("API crude data:", data);
  return data;
} catch (error) {
  console.error("There was a problem fetching the data", error);
  alert("Error!-Connection error or location wasn't found.")
  return null
}
}

function processWeatherData(data) {
  const current = data.currentConditions;
  const location = data.resolvedAddress;

  const processedData = {
    location: location,
    condition: current.conditions,
    icon: current.icon,
    tempC: current.temp,
    feelsLikeC: current.feelslike,
    tempF: celsiusToFahrenheit(current.temp),
    feelsLikeF: celsiusToFahrenheit(current.feelslike),
    humidity: current.humidity,
    windSpeed: current.windspeed,
  }

  return processedData;
}

function celsiusToFahrenheit(celsius){
  return (celsius * 9/5) + 32;
}

const form = document.getElementById('weather-form');
const locationInput = document.getElementById('location-input');
const weatherDisplay = document.getElementById('weather-display');
const loader = document.getElementById('loader');
const toggleButton = document.getElementById('toggle-units');

let currentWeatherData = null;
let isCelsius = true;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const location = locationInput.value;
  loader.classList.remove('hidden');
  weatherDisplay.innerHTML= '';
  toggleButton.classList.add('hidden');
  const rawData = await getWeatherData(location);
  loader.classList.add('hidden');

  if (rawData) {
    currentWeatherData = processWeatherData(rawData);
    isCelsius = true;
    displayWeather();
    toggleButton.classList.remove('hidden');
    updateToggleButton();
  }
});

function displayWeather() {
  if (!currentWeatherData) return; 
  weatherDisplay.innerHTML = '';
  
  const temp = isCelsius ? `${currentWeatherData.tempC.toFixed(1)} °C` : `${currentWeatherData.tempF.toFixed(1)} °F`;
  const feelsLike = isCelsius ? `${currentWeatherData.feelsLikeC.toFixed(1)} °C` : `${currentWeatherData.feelsLikeF.toFixed(1)} °F`;
  
  const locationEl = document.createElement('h2');
  locationEl.textContent = currentWeatherData.location;
  
  const conditionEL = document.createElement('p');
  conditionEL.textContent = `Condition: ${currentWeatherData.condition}`;
  
  const tempEl = document.createElement('p');
  tempEl.textContent = `${temp}`
  tempEl.classList.add('weather-temp-main')
  const feelsLikeEl = document.createElement('p');
  feelsLikeEl.textContent = `Thermal sensation: ${feelsLike}`
  
  weatherDisplay.appendChild(locationEl);
  weatherDisplay.appendChild(conditionEL);
  weatherDisplay.appendChild(tempEl);
  weatherDisplay.appendChild(feelsLikeEl);
  changeBackground(currentWeatherData.icon)
}

toggleButton.addEventListener('click', () => {
  isCelsius = !isCelsius;
  displayWeather();
  updateToggleButton();
})

function updateToggleButton() {
  toggleButton.textContent = isCelsius ? 'Change to °F' : 'Change to °C'
}

function changeBackground(iconName){
  document.body.className= '';

  if (iconName.includes('rain')){
    document.body.classList.add('rainy');
  } else if (iconName.includes('cloudy'  || 'Partially cloudy')){
    document.body.classList.add('cloudy');
  } else if (iconName.includes('clear')){
    document.body.classList.add('clear');
  } else if (iconName.includes('snow')){
    document.body.classList.add('snowy');
  } else  {
    document.body.classList.add('default');
  }
}