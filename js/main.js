// Add all scripts to the JS folder
console.log("This map shows the number of annual US visitors to each prefecture in Japan from 2015 to 2024. The data is from the Japan National Tourism Organization (JNTO) and was accessed by H. McBride 02/2026 at: https://statistics.jnto.go.jp/en/graph/#graph--lodgers--by--prefecture");
console.log("I will likely curb the number of features shown on the map and choose a different tile layer to make it more readable for Lab1; for Activity 5, I have kept all 47 prefectures on the map and went with a pretty watercolor-type tilelayer.");

//declare map var in global scope so I can access it in both createMap and getData functions
var map;

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [37, 136],
        zoom: 5
    });

    // Use tile layer from leaflet-providers; this one is called Stadia_StamenWatercolor and is a watercolor style map
    var Stadia_StamenWatercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
        minZoom: 1,
        maxZoom: 16,
        attribution: 'Japan National Tourism Organization (JNTO) | <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'jpg'
    });

    //add the Stadia_StamenWatercolor tilelayer to the map
    Stadia_StamenWatercolor.addTo(map);

    //call getData function
    getData();
};

// function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//function to retrieve/fetch the data and place it on the map
function getData(){
    // fetch the data
    fetch("data/prefectures_annualUSvisitors.geojson")
        .then(function(response){
            return response.json();
        })
    // first define marker options for style, then create a geojson layer that adds both the popup function and the style function to the data 
        .then(function(json){            
            //create marker options
            var geojsonMarkerOptions = {
                radius: 4,
                fillColor: "Crimson",
                color: "Crimson",
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            };
            //create the geojson layer, apply the onEachFeature function to create popups for each feature, then apply the marker style options to the point features
            L.geoJson(json, {
                onEachFeature: onEachFeature,
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map); // add the geojson layer to the map
        });
    }

// the eventlistener will wait until the DOM content has loaded and then will call the function createMap which puts the whole thing together
document.addEventListener('DOMContentLoaded',createMap)