let options = {
    isDownloaded: false,
    urlMQTT: 'https://corsproxy.io/?https://dev.rightech.io/api/v1/objects/mqtt-kolya_bondar_yt-3f68k5',
    apiKeyMQTT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NTg1MzFlOTk2YmE1ZjY2ZTBhNDk0NTAiLCJzdWIiOiI2NTgwY2YzYmE2OWI2MTJmNmE1YjUzNGIiLCJncnAiOiI2NTgwY2YzYmE2OWI2MTJmNmE1YjUzNGEiLCJvcmciOiI2NTgwY2YzYmE2OWI2MTJmNmE1YjUzNGEiLCJsaWMiOiI1ZDNiNWZmMDBhMGE3ZjMwYjY5NWFmZTMiLCJ1c2ciOiJhcGkiLCJmdWxsIjpmYWxzZSwicmlnaHRzIjoxLjUsImlhdCI6MTcwMzIyNzg4MSwiZXhwIjoyMjEwNzEzMjAwfQ.TwTeKWAZtS9LEvo0N8ESuh6AXeoVayiWLG6QmGnXhVM',
    apiKeyWeather: 'GCS3qGbShGtrGN3opAK1SfaIdob7awdI',
    locationKey: null,
    city: null,
    longitude: 1,
    latitude: 1
  }

$(document).ready(function(){
    $('.weather__carousel').slick({
       infinite: false,
       slidesToShow: 5,
       slidesToScroll: 5,
       arrows: false,
       autoplay: true,
       autoplaySpeed: 10000
    });
});

loadOptions();
let city = setTimeout (function(){
    document.querySelector('.weather__city').textContent = options.city;
},1000);

let time = setInterval(function() {
    let date = new Date();
    document.querySelector(".weather__time").textContent = (date.getHours() + ":" + date.getMinutes());
  }, 1000);
  
  function saveOptions() {
    localStorage.setItem('data', JSON.stringify(options));
  }

  function loadOptions() {
    if (localStorage.getItem('data') != null || localStorage.getItem('data') != undefined) {
        options = JSON.parse(localStorage.getItem('data'));
        options.isDownloaded = true;
    } else {
        getGeoLocation();
    }
  }

  function getGeoLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          
          options.latitude = position.coords.latitude;
          options.longitude = position.coords.longitude;
    
          console.log('Широта:', options.latitude);
          console.log('Долгота:', options.longitude);
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
      );
      } else {
        console.error('Geolocation не поддерживается в вашем браузере');
      }

      setTimeout(function(){
        fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${options.apiKeyWeather}&q=${options.latitude}%2C%20${options.longitude}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            options.locationKey = data.Key;
            options.city = data.LocalizedName;
            console.log(options.locationKey);
            console.log(options.city);
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        })
    },500);
}
  
 