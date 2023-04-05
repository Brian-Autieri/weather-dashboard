// Global variables for the application
var searchBtn = document.querySelector('#searchBtn');
var historyBtn = document.querySelector('#historyBtn');
var inputEl = document.querySelector('input');
var displayWeather = document.querySelector('#display-weather');

var nameOfCity = [];
var apiKey = '9e40a158bd06f80d4e0451bd1f82ce04';

// Basic search function, takes input from the user and sends the input city name to the weather API to fetch weather information
function handleSearchSubmit() {
    if (!inputEl.value) {
        return;
    }
    var city = inputEl.value;
    searchWeather(city);
    inputEl.value = '';
}

// Search function that works with search history buttons and their associated cities
function handleHistorySubmit(e) {
    
    var city = e.target.innerHTML;
    searchWeather(city);
}

// Function to get weather information from the weather API, then calls functions to render current weather and get/render forecast weather, as well as the function to render the search history
function searchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}&units=imperial`)
        .then((response) => response.json())
        .then((data) => {
            showCurrentWeather(data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var name = data.name;
            var windSpeed = data.wind.speed;
            var cityTemp = data.main.temp;
            var cityHumidity = data.main.humidity;
            var forecastIcon = data.weather[0].icon;
            var dayJs = dayjs().format('dddd, MMMM D');
            // console.log(lat);
            // console.log(lon);
            // console.log(name);
            // console.log(windSpeed);
            // console.log(cityTemp);
            // console.log(cityHumidity);
            // console.log(forecastIcon);
            // console.log(dayJs);
            var forecastIcon = 'http://openweathermap.org/img/wn/' + forecastIcon + '@2x.png';
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data);
                    displayCurrentWeather(data);
                    displayHistory(data);
                })
        });
}

// Function that renders the current weather for the input city, uses the DOM API to dynamically create elements on the page
function showCurrentWeather(data) {
    document.getElementById('display-weather').innerHTML = "";

    var forecastItems = document.createElement('ul');
    document.getElementById('display-weather').appendChild(forecastItems);
    var dayJs = dayjs().format('MMMM D');
    var forecastInfo1 = document.createElement('li');
    forecastInfo1.textContent = dayJs;
    var forecastInfo2 = document.createElement('li');
    forecastInfo2.textContent = data.main.temp + '°F';
    var forecastInfo3 = document.createElement('li');
    forecastInfo3.textContent = data.wind.speed + ' MPH';
    var forecastInfo4 = document.createElement('li');
    forecastInfo4.textContent = data.main.humidity + '%';
    var img = document.createElement('img');
    img.src = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
    forecastItems.append(forecastInfo1, forecastInfo2, forecastInfo3, forecastInfo4, img);
}

// Function that renders forecast weather for five days in the future thanks to a for loop
function displayCurrentWeather(data) {
    document.getElementById('display-forecast').innerHTML = "";
    for (let i = 0; i < 40; i = i + 8) {
        var forecastTime = data.list[i].dt_txt;
        var forecastIcon = data.list[i].weather[0].icon;
        var forecastTemp = data.list[i].main.temp;
        var forecastWind = data.list[i].wind.speed;
        var forecastHumid = data.list[i].main.humidity;
        var dayJs = dayjs(forecastTime).format('MMMM D');
        // console.log(dayJs);
        var weatherData = document.createElement('p');
        weatherData.textContent = dayJs;

        // console.log(forecastTime);
        var forecastIcon = 'http://openweathermap.org/img/wn/' + forecastIcon + '@2x.png';
        // console.log(forecastIcon);
        // console.log(forecastTemp + '°F');
        // console.log(forecastWind + ' MPH');
        // console.log(forecastHumid + '%');

        var forecastItems = document.createElement('ul');
        document.getElementById('display-forecast').appendChild(forecastItems);
        var forecastInfo1 = document.createElement('li');
        forecastInfo1.textContent = dayJs;
        var forecastInfo2 = document.createElement('li');
        forecastInfo2.textContent = data.list[i].main.temp + '°F';
        var forecastInfo3 = document.createElement('li');
        forecastInfo3.textContent = data.list[i].wind.speed + ' MPH';
        var forecastInfo4 = document.createElement('li');
        forecastInfo4.textContent = data.list[i].main.humidity + '%';
        var img = document.createElement('img');
        img.src = forecastIcon;
        forecastItems.append(forecastInfo1, forecastInfo2, forecastInfo3, forecastInfo4, img);
    }
}

// Function to render the search history
function displayHistory(data) {
    // console.log(nameOfCity);
    var city = data.city.name;
    // console.log(city);

    var weatherButton = document.createElement('button');
    weatherButton.textContent = city;
    weatherButton.setAttribute("id", "#historyBtn");
    weatherButton.addEventListener('click', handleHistorySubmit);
    document.getElementById('search-history').appendChild(weatherButton);

    nameOfCity.push(city);
    var string = JSON.stringify(nameOfCity);
    localStorage.setItem("nameOfCity", string);

}

// Global event listener for the function's base search button
searchBtn.addEventListener('click', handleSearchSubmit);
