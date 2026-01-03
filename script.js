let apiKey = "da7de5a7576330bf50de9c06ae0255f5";
let units = "metric";

function getWeather(cityName = null) {
  const city = cityName || document.getElementById("city-input").value;
  if (!city) return;

  saveToHistory(city);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.cod !== 200) {
        alert("City not found.");
        return;
      }

      document.getElementById(
        "city-name"
      ).innerText = `${data.name}, ${data.sys.country}`;
      document.getElementById("temperature").innerText = `🌡 ${data.main.temp}°${
        units === "metric" ? "C" : "F"
      }`;
      document.getElementById(
        "description"
      ).innerText = `☁️ ${data.weather[0].description}`;
      document.getElementById(
        "humidity"
      ).innerText = `💧 Humidity: ${data.main.humidity}%`;
      document.getElementById("wind").innerText = `💨 Wind: ${
        data.wind.speed
      } ${units === "metric" ? "m/s" : "mph"}`;
      document.getElementById(
        "pressure"
      ).innerText = `🎯 Pressure: ${data.main.pressure} hPa`;
      document.getElementById("sunrise").innerText = `🌅 Sunrise: ${new Date(
        data.sys.sunrise * 1000
      ).toLocaleTimeString()}`;
      document.getElementById("sunset").innerText = `🌇 Sunset: ${new Date(
        data.sys.sunset * 1000
      ).toLocaleTimeString()}`;
      document.getElementById(
        "weather-icon"
      ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      fetchForecast(city);
    });
}

function fetchForecast(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`
  )
    .then((res) => res.json())
    .then((data) => {
      const forecastDiv = document.getElementById("forecast");
      forecastDiv.innerHTML = "<h3>5-Day Forecast</h3>";

      let displayedDates = [];
      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (
          !displayedDates.includes(date) &&
          item.dt_txt.includes("12:00:00")
        ) {
          displayedDates.push(date);
          forecastDiv.innerHTML += `
            <div class="forecast-day">
              <p>${date}</p>
              <img src="https://openweathermap.org/img/wn/${
                item.weather[0].icon
              }.png" />
              <p>${item.main.temp}°${units === "metric" ? "C" : "F"}</p>
            </div>`;
        }
      });
    });
}

function getLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`
    )
      .then((res) => res.json())
      .then((data) => {
        document.getElementById("city-input").value = data.name;
        getWeather(data.name);
      });
  });
}

function toggleUnits() {
  units = units === "metric" ? "imperial" : "metric";
  getWeather(document.getElementById("city-input").value);
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}

function saveToHistory(city) {
  let cities = JSON.parse(localStorage.getItem("history") || "[]");
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("history", JSON.stringify(cities));
    loadHistory();
  }
}

function loadHistory() {
  let historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";
  let cities = JSON.parse(localStorage.getItem("history") || "[]");
  cities.forEach((c) => {
    let btn = document.createElement("button");
    btn.innerText = c;
    btn.onclick = () => getWeather(c);
    historyDiv.appendChild(btn);
  });
}

setInterval(() => {
  document.getElementById(
    "time"
  ).innerText = `🕒 ${new Date().toLocaleTimeString()}`;
}, 1000);

window.onload = () => {
  document.body.classList.add("light");
  loadHistory();
};
