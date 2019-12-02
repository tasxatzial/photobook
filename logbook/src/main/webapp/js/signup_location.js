'use strict';

var signUpLocation = function () {
  var state = {
    xhr: null,
    xhrResponse: null,
    mapVisible: false,
    mapObj: null,
    mapButton: null,

    /* true if the map displays for the first time a location */
    newLocation: true
  };
  var nominatimAPI = {
    url: 'https://nominatim.openstreetmap.org/search',
    reverseUrl: 'https://nominatim.openstreetmap.org/reverse'
  };

  /* called by toggleMap() every time the visibility of the map is toggled.
  Assumes that a map object already exists */
  function toggleOldMap() {

    /* initialization when a location is about to be displayed
    for the first time */
    if (state.newLocation) {
      state.newLocation = false;

      /* zoom more if there is an address value */
      if (!address.value.trim()) {
        state.mapObj.setZoom(11);
      }
      else {
        state.mapObj.setZoom(15);
      }

      /* add the location to the map */
      state.mapObj.addLocation(state.xhrResponse);

      /* create the map button */
      state.mapButton = newElements.createMapButton();
      state.mapButton.addEventListener('click', toggleMap);
      formMsg.showElement(nominatimSearchMsg, state.mapButton);
    }

    /* add/remove map div to/from DOM */
    if (state.mapVisible) {
      state.mapButton.innerHTML = 'Show map';
      mapParent.removeChild(state.mapObj.getDiv());
      state.mapVisible = false;
    }
    else {
      state.mapButton.innerHTML = 'Hide map';
      mapParent.appendChild(state.mapObj.getDiv());
      state.mapVisible = true;
      state.mapObj.drawMap();
    }
  }

  /* called every time the visibility of the map is toggled.
  Creates a map object in case none exists and then calls toggleOldMap() */
  function toggleMap() {
    if (!state.mapObj) {
      var map = document.createElement('div');
      map.id = 'map';
      mapParent.appendChild(map);
      map.style.height = '20rem';
      state.mapObj = new OLMap('map');
    }
    toggleOldMap();
  }

  /* initialize map section. This can happen when:
  1) User inputs a country/city/address
  2) User is using geolocation search */
  function initMap() {
    if (state.mapVisible) {
      state.mapVisible = false;
      mapParent.removeChild(state.mapObj.getDiv());
    }
    if (state.mapObj) {
      state.mapObj.resetState();
    }
    state.newLocation = true;
  }

  /* check if city/country values permit a location search */
  function locationCheck() {
    formMsg.clear(nominatimSearchMsg);
    formMsg.clear(geolocSearchMsg);
    formButton.enable(geolocSearchButton);
    initMap();
    if (formLocationSearch.isSearchDataReady(city, country)) {
      formButton.enable(nominatimSearchButton);
    }
    else {
      formButton.disable(nominatimSearchButton);
    }
  }

  /* nominatim search, called when user clicks the search location button */
  function locationSearch() {

    /* ajax request success callback */
    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText)[0];
      if (state.xhrResponse) {
        toggleMap();
      }
      else {
        formMsg.showError(nominatimSearchMsg, 'Not found');
      }
      funcApply(formInput.enable, [country, city, address]);
      formButton.enable(geolocSearchButton);
    }

    /* ajax request fail callback */
    function failCallback() {
      formMsg.showError(nominatimSearchMsg, 'Error');
      funcApply(formInput.enable, [country, city, address]);
      funcApply(formButton.enable, [nominatimSearchButton, geolocSearchButton]);
    }

    /* initialize */
    var input = formLocationSearch.createInput(address, city, country);
    funcApply(formInput.disable, [country, city, address]);
    funcApply(formButton.disable, [nominatimSearchButton, geolocSearchButton]);
    formMsg.clear(geolocSearchMsg);
    var loader = newElements.createLoader('images/loader.gif');
    formMsg.showElement(nominatimSearchMsg, loader);
    state.xhr = ajaxRequest('GET', nominatimAPI.url + input, null, successCallback, failCallback);
  }

  /* geolocation detect + reverse nominatim search. called when user clicks
  the detect my location button */
  function geolocSearch() {

    /* reverse nominatim search success callback */
    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText);

      /* calculate country/city/address from the ajax response */
      var location = formLocationSearch.parseReverseSearch(state.xhrResponse);

      funcApply(formInput.enable, [country, city, address]);

      /* show error if 1) all country/city/address are empty
                      2) reverse nominatim search returns an unknown location */
      if (state.xhrResponse.error || !location) {
        formMsg.showError(geolocSearchMsg, 'Not found');
        if (formLocationSearch.isSearchDataReady(city, country)) {
          formButton.enable(nominatimSearchButton);
        }
      }
      else {
        /* else update country/city/address fields */
        country.value = location.country ? location.country : '';
        city.value = location.city ? location.city : '';
        address.value = location.address ? location.address : '';

        formMsg.showOK(geolocSearchMsg, 'Found');
        initMap();

        /* show map only if the returned country/city values permit search */
        if (formLocationSearch.isSearchDataReady(city, country)) {
          toggleMap();
        }
      }
    }

    /* geolocation search + reverse nominatim fail callback */
    function failCallback() {
      formMsg.showError(geolocSearchMsg, 'Error');
      funcApply(formInput.enable, [country, city, address]);
      formButton.enable(geolocSearchButton);
      if (formLocationSearch.isSearchDataReady(city, country)) {
        formButton.enable(nominatimSearchButton);
      }
    }

    /* geolocation search success callback */
    function successNavCallback(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var input = formLocationSearch.createLatLonInput(lat, lon);
      state.xhr = ajaxRequest('GET', nominatimAPI.reverseUrl + input, null, successCallback, failCallback);
    }

    /* initialize */
    funcApply(formInput.disable, [country, city, address]);
    funcApply(formButton.disable, [nominatimSearchButton, geolocSearchButton]);
    formMsg.clear(nominatimSearchMsg);
    var loader = newElements.createLoader('images/loader.gif');
    formMsg.showElement(geolocSearchMsg, loader);
    navigator.geolocation.getCurrentPosition(successNavCallback, failCallback);
  }

  var nominatimSearchButton = document.getElementById('signup-location-search-button');
  var nominatimSearchMsg = document.getElementById('signup-location-search-state');
  var geolocSearchButton = document.getElementById('signup-geolocation-search-button');
  var geolocSearchMsg = document.getElementById('signup-geolocation-search-state');
  var address = document.getElementById('signup-address');
  var country = document.getElementById('signup-country');
  var city = document.getElementById('signup-city');
  var mapParent = document.getElementById('signup-map-parent');

  nominatimSearchButton.addEventListener('click', locationSearch);
  geolocSearchButton.addEventListener('click', geolocSearch);
  country.addEventListener('input', locationCheck);
  city.addEventListener('input', locationCheck);
  address.addEventListener('input', locationCheck);

  /* check if geolocation is supported */
  if (navigator.geolocation) {
    formButton.enable(geolocSearchButton);
  }
  else {
    geolocSearchButton.innerHTML = 'Detection not supported';
  }

  /* enable/disable search location button based on current location values */
  if (formLocationSearch.isSearchDataReady(city, country)) {
    formButton.enable(nominatimSearchButton);
  }
};

var formLocationSearch = (function() {
  /* Return true if city/country permit a location search. Assumes that
  arguments are valid elements with a value attribute. City must also have
  a pattern attribute */
  function isSearchDataReady(city, country) {
    var cityRegex = new RegExp(city.pattern);
    return country.value && cityRegex.test(city.value);
  }

  /* return a string for an ajax request based on the location.
  Assumes that arguments are valid elements with a value attribute */
  function createInput(address, city, country) {
    var cityAddress = city.value;
    if (address.value.trim()) {
      cityAddress = city.value + ',' + address.value;
    }
    return '?q=' + cityAddress +
        '&countrycodes=' + country.value +
        '&format=json&limit=1';
  }

  /* create the string for a ajax reverse nomination search request.
  Assumes that arguments are strings or numbers */
  function createLatLonInput(latitude, longitude) {
    return '?lat=' + latitude +
        '&lon=' + longitude +
        '&format=json&zoom=16';
  }

  /* Parse a reverse nominatim search response and return an
  object with country,city,address keys. If null is returned,
  none of the country,city,address could be identified from the response */
  function parseReverseSearch(response) {
    var country = null;
    var city = null;
    var address = null;
    if (response.address) {
      /* country */
      if (response.address.country_code) {
        country = response.address.country_code.toUpperCase();
      }
      /* city */
      if (response.address.village) {
        city = response.address.village;
      }
      else if (response.address.town) {
        city = response.address.town;
      }
      else if (response.address.city) {
        city = response.address.city;
      }
      /* address */
      if (response.address.road) {
        address = response.address.road;
        if (response.address.house_number) {
          address += ' ' + response.address.house_number;
        }
      }
    }
    if (!country && !city && !address) {
      return null;
    }

    return {
      country: country,
      city: city,
      address: address
    };
  }

  return {
    isSearchDataReady: isSearchDataReady,
    createInput: createInput,
    createLatLonInput: createLatLonInput,
    parseReverseSearch: parseReverseSearch
  };
}());