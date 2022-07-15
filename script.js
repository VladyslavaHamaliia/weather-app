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
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let currentWeekday = days[now.getDay()];
mainDate.innerHTML = `${currentWeekday}, ${currentHours}:${currentMinutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecast = response.data.daily;

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col-sm-2">
                <div class="weather-tile">
                  <div class="days">${formatDay(forecastDay.dt)}</div>
                  <div class="date-bar"></div>
                  <div class="icon-bar">
                    <img
                      src="http://openweathermap.org/img/wn/${
                        forecastDay.weather[0].icon
                      }@2x.png"
                      alt="sunny"
                      width="65px"
                    />
                  </div>
                  <div class="temp-bar">
                    <span class="weather-max-temp">${Math.round(
                      forecastDay.temp.max
                    )}°</span>
                    <span class="weather-min-temp">${Math.round(
                      forecastDay.temp.min
                    )}°</span>
                  </div>
                </div>
              </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "b48f214fdacd498623137e3a61d506e5";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  document.querySelector("#main-city").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp;
  displayTemperature();

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
  getForecast(response.data.coord);
}

function diplayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  isSelectedUnitCelsius = false;
  displayTemperature();
}

function diplayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  isSelectedUnitCelsius = true;
  displayTemperature();
}

function displayTemperature() {
  let temperatureElement = document.querySelector("#temperature");
  if (isSelectedUnitCelsius === true) {
    temperatureElement.innerHTML = Math.round(celsiusTemperature);
  } else {
    temperatureElement.innerHTML = Math.round(
      (celsiusTemperature * 9) / 5 + 32
    );
  }
}

function changeCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-form");
  if (cityInput.value) {
    requestTemperature(cityInput.value);
  } else {
    alert(`Please enter a city!`);
  }
}

function requestTemperature(city) {
  let apiKey = "b48f214fdacd498623137e3a61d506e5";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
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
requestTemperature("Milan");

let isSelectedUnitCelsius = true;
