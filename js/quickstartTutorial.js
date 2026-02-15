//quickstart tutorial example from Leaflet

// set up map variable with coordinates and zoom level
// L.map creates, initizalizes, and manipulates the map; setView sets the geographical center and zoom level of the map
var map = L.map('map').setView([51.505, -0.09], 13);

// add tile layer and attribution using the tileLayer method and the addTo method. 
// .tileLayer loads/displays tile layers referenced by URL 
// .addTo adds features to the specified parameter (in this case, the map variable)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// add a marker, circle, and polygon to the map
// L.marker creates a marker, L.circle creates a circle, and L.polygon creates a polygon; addTo adds the features to the map variable
var marker = L.marker([51.5, -0.09]).addTo(map);

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

// add popups to the marker, circle, and polygon
// .bindPopup allows you to click on the feature and see the defined popup content 
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

// .popup adds a standalone popup to the map that opens (opensOn) when the map opens at the defined coords (setLatLng)
var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);

// add a click event to the map that opens a popup at the clicked location 
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

// map.on listens for the click event and calls the appropriate function
map.on('click', onMapClick);