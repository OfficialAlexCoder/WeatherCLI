#!/usr/bin/env node

require("dotenv").config();
const axios = require("axios");
const { Command } = require("commander");
const program = new Command();
const apiKey = process.env.WEATHER_API_KEY;

class WeatherEmoji {
  static get_weather_emoji(weather_id) {
    if (weather_id >= 200 && weather_id <= 232) {
      return "⛈️";
    } else if (weather_id >= 300 && weather_id <= 321) {
      return "🌦️";
    } else if (weather_id >= 500 && weather_id <= 531) {
      return "🌧️";
    } else if (weather_id >= 600 && weather_id <= 622) {
      return "❄️";
    } else if (weather_id >= 701 && weather_id <= 741) {
      return "🌫️";
    } else if (weather_id === 762) {
      return "🌋";
    } else if (weather_id === 771) {
      return "💨";
    } else if (weather_id === 781) {
      return "🌪️";
    } else if (weather_id === 800) {
      return "☀️";
    } else if (weather_id >= 801 && weather_id <= 804) {
      return "☁️";
    } else {
      return "🌍";
    }
  }
}

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.cod === 200) {
      displayWeather(data);
    } else {
      displayError(`Error: ${data.message}`);
    }
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          displayError(`Bad request: Please check your city input.`);
          break;
        case 401:
          displayError(`Unauthorized: Invalid API Key.`);
          break;
        case 403:
          displayError(`Forbidden: Access is denied.`);
          break;
        case 404:
          displayError(`Not found: City not found.`);
          break;
        case 500:
          displayError(`Internal Server Error: Please try again later.`);
          break;
        case 502:
          displayError(`Bad Gateway: Invalid response from the server.`);
          break;
        case 503:
          displayError(`Service Unavailable: Server is down.`);
          break;
        case 504:
          displayError(`Gateway Timeout: No response from the server.`);
          break;
        default:
          displayError(`HTTP error occurred: ${error.response.status}`);
          break;
      }
    } else {
      displayError("An unexpected error occurred.");
    }
  }
}

function displayError(message) {
  console.error(message);
}

function displayWeather(data) {
  const temperature_k = data["main"]["temp"];
  const temperature_c = temperature_k - 273.15;
  const temperature_f = (temperature_k * 9) / 5 - 459.67;
  const weather_id = data["weather"][0]["id"];
  const weather_description = data["weather"][0]["description"];

  console.log(`Weather in ${data.name}:`);
  console.log(`${Math.round(temperature_c)}°C`);
  console.log(`${weather_description}`);
  console.log(`${WeatherEmoji.get_weather_emoji(weather_id)}`);
}

program
  .version("1.0.0")
  .description("Get the current weather for a city")
  .argument("<city>", "City to get the weather for")
  .action((city) => {
    getWeather(city);
  });

program.parse(process.argv);
