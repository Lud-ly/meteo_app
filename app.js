const weatherIcons = {
    "Rain": "wi wi-day-rain",
    "Clouds": "wi wi-day-cloudy",
    "Clear": "wi wi-day-sunny",
    "Snow": "wi wi-day-snow",
    "mist": "wi wi-day-fog",
    "Drizzle": "wi wi-day-sleet",
    "Fog": "wi wi-day-fog",
    "Smoke": "wi wi-day-cloudy-high",
    "Mist": "wi wi-day-fog",
}

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

async function main(withIp = true) {
    let ville;
    if (withIp) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const geoData = await geoResponse.json();
                ville = geoData.address.city || geoData.address.town || geoData.address.village;

                //3. Choper les infos météo grâce à la ville
                const meteo = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=09a596cd485babb2d5d77c644c1c2e81&lang=fr&units=metric`)
                    .then(resultat => resultat.json())
                    .then(json => json);
                console.log(meteo);
                //4. Appeler fonction viewWeatherInfos et Afficher les informations meteo sur la page
                viewWeatherInfos(meteo);
            }, (error) => {
                console.error('Erreur de géolocalisation :', error);
                alert('Impossible de récupérer la localisation.');
            });
        } else {
            alert('La géolocalisation n\'est pas supportée par ce navigateur.');
        }
    } else {
        ville = document.querySelector('#ville').textContent;
        const meteo = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=09a596cd485babb2d5d77c644c1c2e81&lang=fr&units=metric`)
            .then(resultat => resultat.json())
            .then(json => json);
        console.log(meteo);
        viewWeatherInfos(meteo);
    }
}

function viewWeatherInfos(data) {
    const name = data.name;
    const temperature = data.main.temp;
    const ressenti = data.main.feels_like;
    const conditions = data.weather[0].main;
    const description = data.weather[0].description;
    const humidite = data.main.humidity;
    const vent = data.wind.speed;

    document.querySelector('#ville').textContent = name;
    document.querySelector('#temperature').textContent = temperature;
    document.querySelector('#ressenti').textContent = Math.round(ressenti);
    document.querySelector('#conditions').textContent = capitalize(description);
    document.querySelector('#humidite').textContent = humidite;
    document.querySelector('#vent').textContent = vent;

    document.querySelector('i.wi').className = weatherIcons[conditions];
    document.body.className = conditions.toLowerCase();
}

document.addEventListener('DOMContentLoaded', (event) => {
    const ville = document.querySelector('#ville');

    ville.addEventListener('click', () => {
        ville.contentEditable = true;
    });

    ville.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            ville.contentEditable = false;
            main(false);
        }
    });

    main();
});
