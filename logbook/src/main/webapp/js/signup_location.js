'use strict';

var SignUpLocation = (function () {
  var state = {
    response: null,
    mapVisible: false,
    mapObj: null,

    /* true if the map displays a location for the first time */
    newLocation: true
  };

  var el = {
    nominatimSearchButton: null,
    nominatimSearchMsg: null,
    geolocSearchButton: null,
    geolocSearchMsg: null,
    address: null,
    country: null,
    city: null,
    mapParent: null,
    mapButton: null
  };

  var nominatimAPI = {
    url: 'https://nominatim.openstreetmap.org/search',
    reverseUrl: 'https://nominatim.openstreetmap.org/reverse'
  };

  function init() {
    state.response = null;
    state.mapVisible = false;
    state.map = null;
    state.newLocation = true;

    el.nominatimSearchButton = document.getElementsByClassName('signup-location-search-button')[0];
    el.nominatimSearchMsg = document.getElementById('signup-location-search-state');
    el.geolocSearchButton = document.getElementsByClassName('signup-geolocation-search-button')[0];
    el.geolocSearchMsg = document.getElementById('signup-geolocation-search-state');
    el.address = document.getElementById('signup-address');
    el.country = document.getElementById('signup-country');
    el.city = document.getElementById('signup-city');
    el.mapParent = document.getElementById('signup-map-parent');

    el.mapButton = null;
    formMsg.clear(el.nominatimSearchMsg);
    formMsg.clear(el.geolocSearchMsg);

    el.nominatimSearchButton.addEventListener('click', locationSearch);
    el.geolocSearchButton.addEventListener('click', geolocSearch);
    el.country.addEventListener('input', locationCheck);
    el.city.addEventListener('input', locationCheck);
    el.address.addEventListener('input', locationCheck);

    /* check if geolocation is supported */
    if (navigator.geolocation) {
      formButton.enable(el.geolocSearchButton);
    }
    else {
      el.geolocSearchButton.innerHTML = 'Detection not supported';
    }

    /* enable/disable search location button based on current location values */
    if (LocationSearch.isSearchDataReady(el.city, el.country)) {
      formButton.enable(el.nominatimSearchButton);
    }
  }
  
  /* called by toggleMap() every time the visibility of the map is toggled.
  Assumes that a map object already exists */
  function toggleOldMap() {

    /* initialization when a location is about to be displayed
    for the first time */
    if (state.newLocation) {
      state.newLocation = false;

      /* zoom more if there is an address value */
      if (!el.address.value.trim()) {
        state.map.setZoom(11);
      }
      else {
        state.map.setZoom(15);
      }

      /* add the location to the map */
      state.map.addLocation(state.response);

      /* create the map button */
      el.mapButton = createMapButton();
      el.mapButton.addEventListener('click', toggleMap);
      formMsg.showElement(el.nominatimSearchMsg, el.mapButton);
    }

    /* add/remove map div to/from DOM */
    if (state.mapVisible) {
      el.mapButton.innerHTML = 'Show map';
      el.mapParent.removeChild(state.map.getDiv());
      state.mapVisible = false;
    }
    else {
      el.mapButton.innerHTML = 'Hide map';
      el.mapParent.appendChild(state.map.getDiv());
      state.mapVisible = true;
      state.map.drawMap();
    }
  }

  /* called every time the visibility of the map is toggled.
  Creates a map object in case none exists and then calls toggleOldMap() */
  function toggleMap() {
    if (!state.map) {
      var mapDiv = document.createElement('div');
      mapDiv.id = 'map';
      el.mapParent.appendChild(mapDiv);
      mapDiv.style.height = '20rem';
      state.map = new OLMap(mapDiv.id);
    }
    toggleOldMap();
  }

  /* initialize map section. This can happen when:
  1) User inputs a country/city/address
  2) User is using geolocation search */
  function initMap() {
    if (state.mapVisible) {
      state.mapVisible = false;
      el.mapParent.removeChild(state.map.getDiv());
    }
    if (state.map) {
      state.map.resetState();
    }
    state.newLocation = true;
  }

  /* check if city/country values permit a location search */
  function locationCheck() {
    formMsg.clear(el.nominatimSearchMsg);
    formMsg.clear(el.geolocSearchMsg);
    formButton.enable(el.geolocSearchButton);
    initMap();
    if (LocationSearch.isSearchDataReady(el.city, el.country)) {
      formButton.enable(el.nominatimSearchButton);
    }
    else {
      formButton.disable(el.nominatimSearchButton);
    }
  }

  /* nominatim search, called when user clicks the search location button */
  function locationSearch() {

    /* ajax request success callback */
    function successCallback() {
      state.response = JSON.parse(Requests.get(ID).responseText)[0];
      if (state.response) {
        toggleMap();
      }
      else {
        formMsg.showError(el.nominatimSearchMsg, 'Not found');
      }
      formInput.enable(el.country);
      formInput.enable(el.city);
      formInput.enable(el.address);
      formButton.enable(el.geolocSearchButton);
    }

    /* ajax request fail callback */
    function failCallback() {
      formMsg.showError(el.nominatimSearchMsg, 'Error');
      formInput.enable(el.country);
      formInput.enable(el.city);
      formInput.enable(el.address);
      formButton.enable(el.nominatimSearchButton);
      formButton.enable(el.geolocSearchButton);
    }

    Requests.cancelAll();

    /* initialize */
    var input = LocationSearch.createInput(el.address, el.city, el.country);
    formInput.disable(el.country);
    formInput.disable(el.city);
    formInput.disable(el.address);
    formButton.disable(el.nominatimSearchButton);
    formButton.disable(el.geolocSearchButton);
    formMsg.clear(el.geolocSearchMsg);
    var loader = newElements.createLoader('images/loader.gif');
    formMsg.showElement(el.nominatimSearchMsg, loader);
    var ID = Requests.add(ajaxRequest('GET', nominatimAPI.url + input, null, successCallback, failCallback));
  }

  /* geolocation detect + reverse nominatim search. called when user clicks
  the detect my location button */
  function geolocSearch() {

    /* reverse nominatim search success callback */
    function successCallback() {
      state.response = JSON.parse(Requests.get(ID).responseText);

      /* calculate country/city/address from the ajax response */
      var location = LocationSearch.parseReverseSearch(state.response);

      formInput.enable(el.country);
      formInput.enable(el.city);
      formInput.enable(el.address);

      /* show error if 1) all country/city/address are empty
                      2) reverse nominatim search returns an unknown location */
      if (state.response.error || !location) {
        formMsg.showError(el.geolocSearchMsg, 'Not found');
        if (LocationSearch.isSearchDataReady(el.city, el.country)) {
          formButton.enable(el.nominatimSearchButton);
        }
      }
      else {
        /* else update country/city/address fields */
        el.country.value = location.country_code ? location.country_code : '';
        el.city.value = location.city ? location.city : '';
        el.address.value = location.address ? location.address : '';

        formMsg.showOK(el.geolocSearchMsg, 'Found');
        initMap();

        /* show map only if the returned country/city values permit search */
        if (LocationSearch.isSearchDataReady(el.city, el.country)) {
          toggleMap();
        }
      }
    }

    /* geolocation search + reverse nominatim fail callback */
    function failCallback() {
      formMsg.showError(el.geolocSearchMsg, 'Error');
      formInput.enable(el.country);
      formInput.enable(el.city);
      formInput.enable(el.address);
      formButton.enable(el.geolocSearchButton);
      if (LocationSearch.isSearchDataReady(el.city, el.country)) {
        formButton.enable(el.nominatimSearchButton);
      }
    }

    /* geolocation search success callback */
    function successNavCallback(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var input = LocationSearch.createLatLonInput(lat, lon);
      ID = Requests.add(ajaxRequest('GET', nominatimAPI.reverseUrl + input, null, successCallback, failCallback));
    }

    Requests.cancelAll();
    var ID = null;

    /* initialize */
    formInput.disable(el.country);
    formInput.disable(el.city);
    formInput.disable(el.address);
    formButton.disable(el.nominatimSearchButton);
    formButton.disable(el.geolocSearchButton);
    formMsg.clear(el.nominatimSearchMsg);
    var loader = newElements.createLoader('images/loader.gif');
    formMsg.showElement(el.geolocSearchMsg, loader);
    navigator.geolocation.getCurrentPosition(successNavCallback, failCallback);
  }

  function createMapButton() {
    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'signup-show-map-button';
    button.innerHTML = 'Show map';
    button.className = 'sign-internal-button';

    return button;
  }

  return {
    init: init
  };
}());

var LocationSearch = (function() {
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
    if (address && address.value.trim()) {
      cityAddress = city.value + ',' + address.value;
    }
    return '?q=' + cityAddress +
        '&countrycodes=' + country.value +
        '&format=json&limit=1';
  }

  /* create the string for a ajax reverse nomination search request.
  Assumes that arguments are strings or numbers */
  function createLatLonInput(latitude, longitude) {
    if (String(latitude).trim() === '' || String(longitude).trim() === '' || isNaN(latitude) || isNaN(longitude)) {
      return null;
    }
    return '?lat=' + latitude +
        '&lon=' + longitude +
        '&format=json&zoom=16';
  }

  /* Parse a reverse nominatim search response and return an
  object with country,city,address keys. If null is returned,
  none of the country,city,address could be identified from the response */
  function parseReverseSearch(response) {
    var country_code = null;
    var country = null;
    var city = null;
    var address = null;

    if (response.address) {
      /* country */
      if (response.address.country_code) {
        country_code = response.address.country_code.toUpperCase();
        country = response.address.country;
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
    if (!country_code && !country && !city && !address) {
      return null;
    }

    return {
      country: country,
      country_code: country_code,
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