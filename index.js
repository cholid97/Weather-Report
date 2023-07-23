const express = require("express");
const axios = require("axios");
var geoip = require("geoip-lite");
const IP = require("ip");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY; // Replace with your actual API key

//Get Ip
app.set("trust proxy", true);

// Set up routes
app.get("/weather/", (req, res) => {
  const ip = IP.address();
  var geo = geoip.lookup(ip);
  const city = geo.city;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

  axios
    .get(apiUrl)
    .then((response) => {
      const weatherData = response.data;
      const temperature = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const city = weatherData.name;

      res.json({
        Coordinate: response.data.coord,
        Weather: response.data.weather[0],
        Temperature: response.data.main.temp - 273,
        Visibility: response.data.visibility,
        Wind: response.data.wind,
      });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch weather data" });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
