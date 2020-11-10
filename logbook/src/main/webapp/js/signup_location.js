'use strict';

/**
 * Functions related to the location search using the nominatim API and the browser geolocation feature.
 * @type {{init: init}}
 */
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

  /**
   * Initializations after the signup form has loaded.
   */
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

  /**
   * Called by toggleMap() every time the visibility of the map is toggled.
   Assumes that a map object already exists
   */
  function toggleOldMap() {

    /* initialization when a location is about to be displayed for the first time */
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

  /**
   * Called every time the visibility of the map is toggled.
   * Creates a map object in case none exists and then calls toggleOldMap()
   */
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

  /**
   * Initializes/resets the map section.
   */
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

  /**
   * Checks if city/country values permit a location search.
   */
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

  /**
   * Nominatim search, called when user clicks the search location button.
   */
  function locationSearch() {
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
      formButton.enable(el.nominatimSearchButton);
    }

    function failCallback() {
      formMsg.showError(el.nominatimSearchMsg, 'Error');
      formInput.enable(el.country);
      formInput.enable(el.city);
      formInput.enable(el.address);
      formButton.enable(el.nominatimSearchButton);
      formButton.enable(el.geolocSearchButton);
    }

    Requests.cancelExcept(null);

    /* initialize & do a nominatim search */
    initMap();
    var input = LocationSearch.createInput(el.address, el.city, el.country);
    formInput.disable(el.country);
    formInput.disable(el.city);
    formInput.disable(el.address);
    formButton.disable(el.nominatimSearchButton);
    formButton.disable(el.geolocSearchButton);
    formMsg.clear(el.geolocSearchMsg);
    formMsg.showElement(el.nominatimSearchMsg, Init.loader);
    var ID = Requests.add(ajaxRequest('GET', nominatimAPI.url + input, null, successCallback, failCallback));
  }

  /**
   * Geolocation detect + reverse nominatim search. Called when user clicks
   * the detect my location button.
   */
  function geolocSearch() {

    /* Geolocation detect was successful, now do a reverse nominatim search */
    function successCallback() {
      state.response = JSON.parse(Requests.get(ID).responseText);

      /* calculate country/city/address from the response */
      var location = LocationSearch.parseReverseSearch(state.response);

      formInput.enable(el.country);
      formInput.enable(el.city);
      formInput.enable(el.address);
      formButton.enable(el.geolocSearchButton);
      if (LocationSearch.isSearchDataReady(el.city, el.country)) {
        formButton.enable(el.nominatimSearchButton);
      }

      /* show error if 1) all country/city/address are empty
                      2) reverse nominatim search returns an unknown location */
      if (state.response.error || !location) {
        formMsg.showError(el.geolocSearchMsg, 'Not found');
      }
      else {
        var countryParent = document.getElementById('signup-country-parent');
        if (countryParent.children[0].children[2]) {
          countryParent.children[0].removeChild(countryParent.children[0].children[2]);
        }
        var cityParent = document.getElementById('signup-city-parent');
        if (cityParent.children[0].children[1]) {
          cityParent.children[0].removeChild(cityParent.children[0].children[1]);
        }

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

    /* common fail callback for geolocation detect & reverse nominatim search */
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

    /* geolocation detect success callback */
    function successNavCallback(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var input = LocationSearch.createLatLonInput(lat, lon);
      ID = Requests.add(ajaxRequest('GET', nominatimAPI.reverseUrl + input, null, successCallback, failCallback));
    }

    Requests.cancelExcept(null);
    var ID = null;

    /* initialize & do a geolocation detect */
    initMap();
    formInput.disable(el.country);
    formInput.disable(el.city);
    formInput.disable(el.address);
    formButton.disable(el.nominatimSearchButton);
    formButton.disable(el.geolocSearchButton);
    formMsg.clear(el.nominatimSearchMsg);
    formMsg.showElement(el.geolocSearchMsg, Init.loader);
    navigator.geolocation.getCurrentPosition(successNavCallback, failCallback);
  }

  /**
   * Creates the show map button.
   * @returns {HTMLButtonElement}
   */
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

/**
 * Helper functions for the location search functionality.
 * @type {{
 * createInput: (function(*=, *, *): string),
 * isValidLatLon: (function(*=, *=): boolean),
 * createLatLonInput: createLatLonInput,
 * parseReverseSearch: parseReverseSearch,
 * isSearchDataReady: (function(*, *): *|boolean)
 * }}
 */
var LocationSearch = (function() {

  /**
   * Returns true if city/country permit a location search. Assumes that
   * arguments are valid elements with a value attribute. City must also have a pattern attribute.
   * @param city
   * @param country
   * @returns {*|boolean}
   */
  function isSearchDataReady(city, country) {
    var cityRegex = new RegExp(city.pattern);
    return country.value && cityRegex.test(city.value);
  }

  /**
   * Returns a string for the ajax request URL of the nominatim search.
   * Assumes that arguments are valid elements with a value attribute.
   * @param address
   * @param city
   * @param country
   * @returns {string}
   */
  function createInput(address, city, country) {
    var cityAddress = city.value;
    if (address && address.value.trim()) {
      cityAddress = city.value + ',' + address.value;
    }
    return '?q=' + cityAddress +
        '&countrycodes=' + country.value +
        '&format=json&limit=1';
  }

  /**
   * Returns a string for the ajax request URL of the reverse nominatim search.
   * Assumes that the arguments are strings or numbers.
   * @param latitude
   * @param longitude
   * @returns {string|null}
   */
  function createLatLonInput(latitude, longitude) {
    if (!isValidLatLon(latitude, longitude)) {
      return null;
    }
    return '?lat=' + latitude +
        '&lon=' + longitude +
        '&format=json&zoom=16';
  }

  /**
   * Checks whether the specified latitude,longitude have valid values.
   * @param latitude
   * @param longitude
   * @returns {boolean}
   */
  function isValidLatLon(latitude, longitude) {
    return !(String(latitude).trim() === '' || String(longitude).trim() === '' ||
        isNaN(latitude) || isNaN(longitude) ||
        latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180);
  }

  /* Parses a reverse nominatim search response and returns an
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
    parseReverseSearch: parseReverseSearch,
    isValidLatLon: isValidLatLon
  };
}());