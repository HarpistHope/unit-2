// GEOG 579 - Spring 2026 - Lab 1 - Hope McBride
// Favicon by MHDK Avatar at the Noun Project https://thenounproject.com/icon/airplane-8160142/
console.log("This map shows the annual number of passengers boarding airplanes (offically called enplanements) in 20 of the most consistently busy airport cities in the United States from 2013 to 2023. All original data was made accessible by the U.S. Gederal Aviation Administration and the FFA. Data was accessed by H. McBride 02/2026 at: https://www.faa.gov/airports/planning_capacity/passenger_allcargo_stats/passenger/previous_years#2023");

//declare map and dataStats var in global scope so I can access them in all necessary functions
var map;
var dataStats = {};
// create an array for city totals
var allcityTotals = [];

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [38.27, -98.58],
        zoom: 4
    });

    // Use tile layer from leaflet-providers
    var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Federal Aviation Administration (FAA) | Noun Project | Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
    });

    Esri_WorldGrayCanvas.addTo(map)

    //call getData function
    getData();
};

// Calculating the min, max, and mean values; also sum each city's total enplanements to create a static bar chart (calculate, arrange)
function calcStats(data){
    //create emtpy array to store all data values
    var allValues = [];

    // loop through each city
    for (var city of data.features){
        // create cityTotal variable 
        var cityTotal = 0;

        //loop through each year
        for(var year = 2013; year <= 2023; year+=1){
            //console.log(year)
            // get enplanement numbers for current year
            var value = city.properties[year]
            // add value to array
            allValues.push(value);
            // add sum values to cityTotal
            cityTotal += value;
        }

        // I'm still in the loop, push each city + total pairs to allcityTotals array 
        allcityTotals.push({
            city: city.properties.City,
            total: cityTotal
        });
    }
    // get min, max, mean stats for our array
    dataStats.min = Math.min(...allValues);
    dataStats.max = Math.max(...allValues);
    //calculate meanValue
    var sum = allValues.reduce(function(a, b){return a+b;});
    dataStats.mean = sum/ allValues.length;

}

// check the array; it logs the cities and their total enplanements over the decade
console.log(allcityTotals)


// Calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    // constant factor adjusts symbol sizes evenly
    var minRadius = 7;
    // Flannery Appearance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/dataStats.min, 0.5716) * minRadius

    return radius;
};

//Refactoring Example 1.2 line 1...PopupContent constructor function
function PopupContent(properties, attribute){
    this.properties = properties;
    this.attribute = attribute;
    this.year = attribute;
    this.passengers = this.properties[attribute];
    this.formatted = "<p>City: <b>" + this.properties.City + "</b><p>Airports: <b>" + this.properties.Airports + "</b></p><p>Year: <b>" + this.year + "</b></p><p>Total Number of Enplanements: <b>" + this.passengers + "</b></p>";
};

// function to create circle markers for point features and bind the popups to the markers
function pointToLayer(feature, latlng, attributes){
    //Step 4: Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    //check
    //console.log(attribute);

    // create marker options
    var options = {
        radius: 8,
        fillColor: "#335ef9",
        color: "white",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    }
    // logging to the console to check
    // console.log(Object.keys(feature.properties));
    
    // for each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    // give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //Refactoring Example 1.3 line 1...in pointToLayer(); create new popup content
    var popupContent = new PopupContent(feature.properties, attribute);
   
    //bind the popup to the circle marker    
    layer.bindPopup(popupContent.formatted, { 
    	offset: new L.Point(0,-6)
    });
   
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

// function to create proportional symbols and the first map popup
function createPropSymbols(data, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);

    // Set up the map's entry point: a popup with instructions to click the proportional symbols
    var firstPopup = L.popup()
        .setLatLng([39.0119, -98.4842])
        .setContent("Click on proportional symbols to see data.")
        .openOn(map);
};

// function to resize/update proportional symbols according to new attribute values
function updatePropSymbols(attribute){
    // get the year from the attribute
    var year = attribute
    // update temporal legend for each year
    document.querySelector("span.year").innerHTML = year;

    // update size and popup content of each prop symbol 
    map.eachLayer(function(layer){
        //Example 3.18 line 4
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
            
            // Refactoring example 1.3 line 6...in UpdatePropSymbols()
            var popupContent = new PopupContent(props, attribute);

            //update popup with new content    
            popup = layer.getPopup();    
            popup.setContent(popupContent.formatted).update();

        };
    });
};


// function to create new sequence controls
function createSequenceControls(attributes){   
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        // set up container 'sequence-control-container' and range slider buttons 
        onAdd: function () {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            // log attribution for the airplane icons used for the step buttons  
            console.log("Noun Project Icon for the range slider buttons: Airplane by Blackwoodmedia.com.au from <a href='https://thenounproject.com/browse/icons/term/airplane/' target='_blank' title='Airplane Icons'>Noun Project</a> (CC BY 3.0)");
           
            //add first skip button that that it will appear to the left of the range slider
            container.insertAdjacentHTML('beforeend', '<button class="step" id="reverse" title="Reverse"><img src="img/noun-airplane-299060.png"></button>'); 
            
            //create range input element (slider)
            container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">')
           
            // add second skip button
            container.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="Forward"><img src="img/flipped_noun-airplane-299060.png"></button>');

            //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });

    // call a new instance of SequenceControl
    map.addControl(new SequenceControl());   

    //SET SLIDER ATTRIBUTES AND ATTACH LISTENERS HERE
    //set slider attributes
    document.querySelector(".range-slider").max = 10;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;

    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){
        //Step 6: get the new index value
        var index = this.value;
        //console.log(index)

        //Step 9: pass new attribute to update symbols
        updatePropSymbols(attributes[index]);
    });

    // click listener for buttons
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            var index = document.querySelector('.range-slider').value;

            //Step 6: increment or decrement depending on button clicked
            if (step.id == 'forward'){
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 10 ? 0 : index;
            } else if (step.id == 'reverse'){
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 10 : index;
            };

            //Step 8: update slider
            document.querySelector('.range-slider').value = index;
            //console.log(index);

            //Step 9: pass new attribute to update symbols
            updatePropSymbols(attributes[index]);
        })

    })
};

//Above Example 3.10...Step 3: build an attributes array from the data
function processData(data){

    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){

        //only take attributes with population values
        if (attribute.indexOf("20") > -1){
            attributes.push(attribute);
        };                
    };

    //check result
    //console.log(attributes);

    return attributes;
};

// function to create the temporal legend
function createLegend(attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function () {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
            container.innerHTML = '<h3 class="temporalLegend">Enplanements in <span class="year">2013</span></h3><p>(rounded to the nearest ten-thousand)</p>';

            //Example 3.5 line 15...Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="100px">';

            //array of circle names to base loop on
            var circles = ["max", "mean", "min"];

            //Step 2: loop to add each circle and text to svg string
            for (var i=0; i<circles.length; i++){

                //Step 3: assign the r and cy attributes  
                var radius = calcPropRadius(dataStats[circles[i]]);  
                var cy = 59 - radius;  

                //circle string  
                svg += '<circle class="legend-circle" id="' + circles[i] + '" r="' + radius + '" cy="' + cy + '" fill="#335ef9" fill-opacity="0.8" stroke="whitesmoke" cx="30"/>';  
                
                // evenly space out labels
                var textY = i * 20 + 20;

                // text string
                svg += '<text id="' + circles[i] + '-text" x="65" y="' + textY + '">' + ((dataStats[circles[i]])/1000000).toFixed(2) + ' million</text>';
            
            }; 

            //close svg string
            svg += "</svg>";

            //add attribute legend svg to container
            container.insertAdjacentHTML('beforeend',svg);
            
            return container;
        }
    });

    map.addControl(new LegendControl());
};


// Import GeoJSON data
    function getData(map){
        //load the data
        fetch("data/topEnplanementCities.geojson")
            .then(function(response){
                return response.json();
            })
            .then(function(json){
                 //create an attributes array
                var attributes = processData(json);
                calcStats(json);
                createPropSymbols(json, attributes);
                createSequenceControls(attributes);
                createLegend(attributes);
            });

    };

// the eventlistener will wait until the DOM content has loaded and then will call the function createMap which puts the whole thing together
document.addEventListener('DOMContentLoaded',createMap)


const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
