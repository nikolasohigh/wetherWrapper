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

const date = new Date();

$(document).ready(function(){
    $('.weather__carousel').slick({
       infinite: true,
       slidesToShow: 5,
       slidesToScroll: 1,
       arrows: false,
       autoplay: true,
       autoplaySpeed: 900,
       swipe: false,
       responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 2
          }
        }
       ]
    })

    $('.main').slick({
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
        showCity();
    } else {
        getGeoLocation();
    }
}

function timeUpdate() {
    setInterval(function() {
      document.querySelector(".weather__time").textContent = (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
      }, 1000);
}

function saveOptions() {
    console.log("saving");
    localStorage.setItem('data', JSON.stringify(options));
}

function getGeoLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          options.latitude = position.coords.latitude;
          options.longitude = position.coords.longitude;
          getCity(showCity);
          saveOptions();
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
}
  
function showCity() {
  console.log("building");
  document.querySelector('.weather__city').textContent = options.city;
}

function toCelcium(temperatureF) {
  return Math.round((temperatureF-32)*(5/9));
}

async function getTwelweHoursForecast() {
    try {
      const response = await fetch(`https://corsproxy.io/?https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/167753?apikey=${options.apiKeyWeather}&language=uk-ua`); 
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const data = await response.json();
  
      console.log(data);

    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
}

async function getCity(callback) {
  try {
    const response = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${options.apiKeyWeather}&q=${options.latitude},${options.longitude}`); 
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    options.locationKey = data.Key;
    options.city = data.LocalizedName;
    console.log(options.locationKey);
    console.log(options.city);
    console.log(data);
    callback();
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}