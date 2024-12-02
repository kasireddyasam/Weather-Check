// Using the Blockchain API to check the price of a cryptocurrency for the user.

import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

const API_URL = "https://api.openweathermap.org/data/2.5/weather";  // endpoint for current weather data
const apiKey = "bc8fcba16f783c2edfcefd88648c5c0a";

app.set('view engine', 'ejs'); // Set view engine to EJS
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission and render weather data
app.post("/", async (req, res) => {
    try {
        const city = req.body.city; // Get the city name from the form
        const response = await axios.get(`${API_URL}?q=${city}&appid=${apiKey}&units=metric`); // Fetch current weather data for the city

        // Check if the response contains the expected data structure
        if (response.data && response.data.main && response.data.weather && response.data.weather.length > 0) {
            // Extract relevant weather information from the API response
            const temperature = response.data.main.temp;
            const description = response.data.weather[0].description;
            const icon = response.data.weather[0].icon;
            const iconURL = `http://openweathermap.org/img/wn/${icon}.png`;

            // Render the index.ejs template with the weather information and send it to the client
            res.render("index.ejs", { city, temperature, description, iconURL });
        } else {
            // If the response does not contain the expected data, render an error message
            res.render("index.ejs", { error: "Failed to fetch weather information. Please try again later." });
        }
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", { error: "Failed to fetch weather information. Please try again later." });
    }
});

// Default route to render the form
app.get("/", (req, res) => {
    res.render("index.ejs"); // Render the form for entering city name
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
