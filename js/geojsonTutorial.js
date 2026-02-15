//geojson Tutorial  example from Leaflet

// set up map variable with coordinates and zoom level
// L.map creates, initizalizes, and manipulates the map; setView sets the geographical center and zoom level of the map
var map = L.map('map').setView([45.58, -103.46], 3);

// add tile layer and attribution
// tileLayer loads/displays tile layers referenced by URL 
// addTo adds features to the specified parameter (in this case, the map variable)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// create a variable myLayer which holds and adds a geojson layer to the map
var myLayer = L.geoJSON().addTo(map);

// create a geojson feature with properties and geometry
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
// addData adds the variable in parentheses to the first variable (myLayer);in this case, myLayer is the geojson layer and geojsonFeature is the feature being added to the layer
myLayer.addData(geojsonFeature);

// define a linestring feature collection with multiple features and then create a style for the linestring features
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

// .geoJSON creates a geojson layer; in this case, we use it to turn myLines into a geojson layer and apply the style from myStyle; addTo adds the layer to the map
L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);


// create a polygon feature collection with multiple features and properties
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];
// add the polygon features to the map as a geojson with different styles based on the properties
L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map);

// create a circle marker style
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
// pointToLayer spawns a marker from a point feature, in this case returning the style defined above as a circle marker for geojsonFeature
L.geoJSON(geojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);


// create a geojson feature collection, define propery 'show_on_map'
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

// add someFeatures to the map with the filter function which determines whether to show a feature or not depending on if it is defined as true or false
L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);

// define function onEachFeature to bind a popup to each feature with the content from the properties
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

// call onEachFeature popup funciton on geojsonFeature and add it to the map
L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);


