let now = new Date();
let mainDate = document.querySelector("#date");
let currentHours = now.getHours();
if (currentHours < 10) {
  currentHours = `0${currentHours}`;
}
let currentMinutes = now.getMinutes();
if (currentMinutes < 10) {
  currentMinutes = `0${currentMinutes}`;
}
let days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

let currentWeekday = days[now.getDay()];
mainDate.innerHTML = `${currentWeekday}, ${currentHours}:${currentMinutes}`;

function showTemperature(response) {
  document.querySelector("#main-city").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp;
  let temperature = Math.round(celsiusTemperature);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${temperature}`;
  let humidity = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${humidity}%`;
  let descriptionElement = document.querySelector(`#description`);
  descriptionElement.innerHTML = response.data.weather[0].main;
  let windSpeed = Math.round(response.data.wind.speed);
  let windSpeedElement = document.querySelector("#wind-speed");
  windSpeedElement.innerHTML = `Wind: ${windSpeed} km/h`;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    ` http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

function diplayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  temperatureElement.innerHTML = fahrenheitTemperature;
}

function diplayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function changeCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-form");
  if (cityInput.value) {
    let apiKey = "b48f214fdacd498623137e3a61d506e5";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(showTemperature);
  } else {
    alert(`Please enter a city!`);
  }
}

let cityForm = document.querySelector("#search-bar");
cityForm.addEventListener("submit", changeCity);

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function searchLocation(position) {
  let apiKey = "b48f214fdacd498623137e3a61d506e5";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

let currentLocationButton = document.querySelector("#geolocation-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusLink = document.querySelector("#celcius-link");
celsiusLink.addEventListener("click", diplayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", diplayFahrenheitTemperature);

let celsiusTemperature = null;
search("Milan");
