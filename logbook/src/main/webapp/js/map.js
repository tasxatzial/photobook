'use strict';

/**
 * The methods of the object returned by this function are all related to the Openlayers map.
 * @param divId
 * @returns {{getDiv: (function(): *), setZoom: setZoom, resetState: resetState, addLocation: addLocation, drawMap: drawMap}}
 * @constructor
 */
function OLMap(divId) {
  var state = {

    /* the map element, this is the child of the element with id = divId */
    obj: null,

    /* the markers for the locations */
    markers: null,

    /* each location is {lat: value, lon: value, draw: {0|1}}
    if draw = 1, the location is already drawn on the map */
    locations: [],

    /* zoom level when the map is shown first time */
    initZoom: 0,

    /* custom zoom level set by user */
    customInitZoom: 0,
  
    /* the projections that are needed for converting coordinates */
    projection: null,
    projection4326: null
  };

  (function init() {
    state.obj = new OpenLayers.Map(divId);
    state.obj.addLayer(new OpenLayers.Layer.OSM());
    state.projection = state.obj.getProjectionObject();
    state.projection4326 = new OpenLayers.Projection('EPSG:4326');
  }());

  /**
   * Returns the div element that contains the map element. This is the element with id = 'divId'.
   * @returns {*}
   */
  function getDiv() {
    return state.obj.div;
  }

  /**
   * Resets the state of this object to its initial state.
   */
  function resetState() {
    state.customInitZoom = null;
    state.initZoom = 0;
    state.initCenter = {lon: 0, lat: 0};
    state.locations = [];
    if (state.markers) {
      state.markers.clearMarkers();
    }
  }

  /**
   * Returns the zoom level and center of the map.
   * @returns {{center: {lon: number, lat: number}, zoom: number}}
   */
  function findZoomCenter() {
    var zoom = 1;
    var center = {lon: 0, lat: 0};

    /* custom zoom level overrides the zoom lvl of the map */
    if (state.customInitZoom) {
      zoom = state.customInitZoom;

      /* center on the first location, this will change in future revisions */
      if (state.locations.length) {
        var locY = state.locations[0].lat;
        var locX = state.locations[0].lon;
        center = new OpenLayers.LonLat(locX, locY).transform(state.projection4326, state.projection);
      }
    }

    return {
      zoom: zoom,
      center: center
    };
  }

  /**
   * Puts a marker on the map for the specified location.
   * @param location
   */
  function drawLocation(location) {
    var locY = location.lat;
    var locX = location.lon;
    var lonLat = new OpenLayers.LonLat(locX, locY).transform(state.projection4326, state.projection);

    /* add a layer marker if none is present */
    if (!state.markers) {
      state.markers = new OpenLayers.Layer.Markers('Markers');
      state.obj.addLayer(state.markers);
    }
    state.markers.addMarker(new OpenLayers.Marker(lonLat));
  }

  /**
   * Draws the map and all the marked locations.
   */
  function drawMap() {

    /* calculate zoom level and center only when the map is shown for the first time */
    if (!state.initZoom) {

      var zoomCenter = findZoomCenter();
      state.initZoom = zoomCenter.zoom;
      state.obj.setCenter(zoomCenter.center, zoomCenter.zoom);
    }

    /* draw only locations that have their draw property equal to 0 */
    for (var i = 0; i < state.locations.length; i++) {
      if (!state.locations[i].draw) {
        state.locations[i].draw = 1;
        drawLocation(state.locations[i]);
      }
    }
  }

  /**
   * Adds one more location to the map.
   * @param location
   */
  function addLocation(location) {
    location.draw = 0;
    state.locations.push(location);
  }

  /**
   * Sets the zoom level of the map.
   * @param lvl
   */
  function setZoom(lvl) {
    state.customInitZoom = lvl;
  }

  return {
    getDiv: getDiv,
    drawMap: drawMap,
    setZoom: setZoom,
    addLocation: addLocation,
    resetState: resetState
  };
}