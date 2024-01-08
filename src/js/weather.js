let options = {
    isDownloaded: false,
    urlMQTT: 'https://corsproxy.io/?https://dev.rightech.io/api/v1/objects/mqtt-kolya_bondar_yt-3f68k5',
    apiKeyMQTT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NTg1MzFlOTk2YmE1ZjY2ZTBhNDk0NTAiLCJzdWIiOiI2NTgwY2YzYmE2OWI2MTJmNmE1YjUzNGIiLCJncnAiOiI2NTgwY2YzYmE2OWI2MTJmNmE1YjUzNGEiLCJvcmciOiI2NTgwY2YzYmE2OWI2MTJmNmE1YjUzNGEiLCJsaWMiOiI1ZDNiNWZmMDBhMGE3ZjMwYjY5NWFmZTMiLCJ1c2ciOiJhcGkiLCJmdWxsIjpmYWxzZSwicmlnaHRzIjoxLjUsImlhdCI6MTcwMzIyNzg4MSwiZXhwIjoyMjEwNzEzMjAwfQ.TwTeKWAZtS9LEvo0N8ESuh6AXeoVayiWLG6QmGnXhVM',
    apiKeyWeather: 'GCS3qGbShGtrGN3opAK1SfaIdob7awdI',
    locationKey: null,
    city: null,
    longitude: null,
    latitude: null
  }

//wrappers
// const weatherWrapper    = document.createElement('div'),
//       statbarWrapper    = document.createElement('div'),
//       forecastWrapper   = document.createElement('div'),
//       forecastList      = document.createElement('div'),
//       carouselWrapper   = document.createElement('div');
//text elements
// const weatherTime       = document.createElement('div'),
//       weatherCity       = document.createElement('div'),
//       weatherState      = document.createElement('div'),
//       weatherMomentTemp = document.createElement('div'),
//       carouselItem      = document.createElement('div'),
//         carouselItemTime         = document.createElement('div'),
//         carouselItemIcoWrapper   = document.createElement('div'),
//         carouselItemIcoImg       = document.createElement('img'),
//         carouselItemTemperature  = document.createElement('div'),
//       forecastHeader    = document.createElement('div'),
//       forecastImg       = document.createElement('img');

// weatherWrapper.classList.add('weather__wrapper');
// statbarWrapper.classList.add('weather__statusbar');
// forecastWrapper.classList.add('forecast');
// carouselWrapper.classList.add('weather__carousel');

// weatherTime.classList.add('weather__time');
// weatherCity.classList.add('weather__city');
// weatherState.classList.add('weather__state');
// weatherMomentTemp.classList.add('weather__temperature');
// carouselItem.classList.add('weather__carousel-item');
//     carouselItemTime.classList.add('weather__carousel-item__time');
//     carouselItemIcoWrapper.classList.add('weather__carousel-item__ico');
//     carouselItemIcoImg.classList.add('weather__carousel-item__ico-img');
//     carouselItemTemperature.classList.add('weather__carousel-item__temperature');
// forecastHeader.classList.add('forecast__header');
// forecastImg.classList.add('forecast__header-img');

let menu, slick;

$(document).ready(function(){
    $('.weather__carousel').slick({
       infinite: true,
       slidesToShow: 3,
       slidesToScroll: 1,
       arrows: false,
       autoplay: true,
       autoplaySpeed: 900,
       swipe: false,
    })

    menu = $('.main').slick({
       infinite: false,
       slidesToShow: 1,
       slidesToScroll: 1,
       arrows: false,
    });

    
});




startApp();

function startApp() {
    timeUpdate();
    if (localStorage.getItem('data') != null || localStorage.getItem('data') != undefined) {
        options = JSON.parse(localStorage.getItem('data'));
        options.isDownloaded = true;
        buildWeather();
    } else {
        getGeoLocation();
    }
}

function timeUpdate() {
    setInterval(function() {
        let date = new Date();
        document.querySelector(".weather__time").textContent = date.getHours() >= 10 ? (date.getHours() + ":") : ('0') + date.getHours() + (':') + (date.getMinutes() >= 10 ? '' : '0') + date.getMinutes();
      }, 1000);
}

function saveOptions() {
    localStorage.setItem('data', JSON.stringify(options));
}

function getGeoLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          options.latitude = position.coords.latitude;
          options.longitude = position.coords.longitude;
        },
        function(error) {
          switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error('Пользователь отказал в доступе к местоположению');
            break;
          case error.POSITION_UNAVAILABLE:
            console.error('Информация о местоположении недоступна');
            break;
          case error.TIMEOUT:
            console.error('Время ожидания запроса истекло');
            break;
          case error.UNKNOWN_ERROR:
            console.error('Произошла неизвестная ошибка');
            break;
          }
        }
      )
      } else {
        console.error('Geolocation не поддерживается в вашем браузере');
      }

      setTimeout(function(){
        fetch(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${options.apiKeyWeather}&q=${options.latitude}%2C%20${options.longitude}`)
        .then(response => response.json())
        .then(data => {
            options.locationKey = data.Key;
            options.city = data.LocalizedName;
            console.log(data);
            console.log(options.locationKey);
            console.log(options.city);
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        })
    },1000);
    
    setTimeout(function(){
        saveOptions();
        buildWeather();
    },4000)
}
  
function buildWeather() {
    document.querySelector('.weather__city').textContent = options.city;
}

function toCelcium(temperatureF) {
  return Math.round((temperatureF-32)*(5/9));
}