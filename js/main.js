// 02/19/2026: Begin Activity 6 Part One
// GOAL: Proportional symbols representing attribute values of mapped features
//STEPS:
//Step 1. Create the Leaflet map--already done in createMap()
//Step 2. Import GeoJSON data--already done in getData()
//Step 3. Add circle markers for point features to the map--already done in AJAX callback
//Step 4. Determine the attribute for scaling the proportional symbols
//Step 5. For each feature, determine its value for the selected attribute
//Step 6. Give each feature's circle marker a radius based on its attribute value

// 02/21/2026: Begin Activity 6 Part 2
//GOAL: Allow the user to sequence through the attributes and resymbolize the map 
//   according to each attribute
//STEPS:
//Step 1. Create slider widget
//Step 2. Create step buttons
//Step 3. Create an array of the sequential attributes to keep track of their order
//Step 4. Assign the current attribute based on the index of the attributes array
//Step 5. Listen for user input via affordances
//Step 6. For a forward step through the sequence, increment the attributes array index; 
//   for a reverse step, decrement the attributes array index
//Step 7. At either end of the sequence, return to the opposite end of the sequence on the next step
//   (wrap around)
//Step 8. Update the slider position based on the new index
//Step 9. Reassign the current attribute based on the new attributes array index
//Step 10. Resize proportional symbols according to each feature's value for the new attribute

console.log("This map shows the annual number of passengers boarding airplanes (offically called enplanements) in 20 of the most consistently busy airport cities in the United States from 2013 to 2023. All original data was made accessible by the U.S. Gederal Aviation Administration and the FFA. Data was accessed by H. McBride 02/2026 at: https://www.faa.gov/airports/planning_capacity/passenger_allcargo_stats/passenger/previous_years#2023");

//declare map and minValue var in global scope so I can access them in all necessary functions
var map;
var minValue;

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [38.27, -98.58],
        zoom: 4
    });

    // Use tile layer from leaflet-providers; this one is called Stadia_StamenWatercolor and is a watercolor style map
    var Stadia_StamenWatercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
        minZoom: 1,
        maxZoom: 16,
        attribution: 'Federal Aviation Administration (FAA) | Noun Project | <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'jpg'
    });


    //add the Stadia_StamenWatercolor tilelayer to the map
    //Stadia_StamenWatercolor.addTo(map);

    // testing NASA Earth at Night tilelayer
    var NASAGIBS_ViirsEarthAtNight2012 = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
        attribution: 'Federal Aviation Administration (FAA) | Noun Project | Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ. | ',
        bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
        minZoom: 1,
        maxZoom: 8,
        format: 'jpg',
        time: '',
        tilematrixset: 'GoogleMapsCompatible_Level'
    });

    // Add to map
    NASAGIBS_ViirsEarthAtNight2012.addTo(map);

    // Testing CartoDB_VoyagerNoLabels tilelayer
    var CartoDB_VoyagerNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
        
    });
    
    // add to map, then adjust opacity to see NASA basemap underneath
    CartoDB_VoyagerNoLabels.addTo(map)

    CartoDB_VoyagerNoLabels.setOpacity(0.1);

    //call getData function
    getData();
};

function calcMinValue(data){
    //create emtpy array to store all data values
    var allValues = [];
    // loop through each prefecture
    for (var prefecture of data.features){
        //loop through each year
        for(var year = 2013; year <= 2023; year+=1){
            //console.log(year)
            // get visitor numbers for current year
            var value = prefecture.properties[year]
            // add value to array
            allValues.push(value);
        }
    }
    // get min value of our array
    var minValue = Math.min(...allValues)
    //console.log(minValue)
    return minValue;
}

// Calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    // constant factor adjusts symbol sizes evenly
    var minRadius = 7;
    // Flannery Appearance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5716) * minRadius

    return radius;
};

//Example 2.1 line 1...function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Step 4: Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    //check
    console.log(attribute);

    //create marker options
    var options = {
        radius: 8,
        fillColor: "gold",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    }


    //console.log(Object.keys(feature.properties));
    
    // for each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    // give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string starting with Prefecture...Example 2.1 line 24
    var popupContent = "<p><b>City: </b> " + feature.properties.City + "</p>";

    // Add airport info to the popup content
    popupContent += "<p><b>Airports: </b> " + feature.properties.Airports + "</p>";

    //add formatted attribute to popup content string, year should return the corresponding number of passengers 
    var year = attribute;

    popupContent += "<p><b>Number of Passengers by Enplanements in " + year + ":</b> " + feature.properties[attribute];
   
    //bind the popup to the circle marker, set the offset appropriately
    layer.bindPopup(popupContent, {
        offset: [0, -6] 
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Example 2.1 line 34...Add circle markers for point features to the map
function createPropSymbols(data, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(attribute){
    map.eachLayer(function(layer){
        //Example 3.18 line 4
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>City:</b> " + props.City + "</p>";
           
            // add additional text (airport and enplanement counts)
            popupContent += "<p><b>Airports: </b> " + props.Airports + "</p>";
            
            // define year variable as attribute
            var year = attribute
           
            // add enplanement count text per year
            popupContent += "<p><b>Number of Passengers by Enplanements in " 
                + year + ":</b> " + props[attribute];
            
            //update popup content            
            popup = layer.getPopup();            
            popup.setContent(popupContent).update();
        };
    });
};

//Sequence Slider Step 1: Create new sequence controls
function createSequenceControls(attributes){
    //create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend',slider);

    //set slider attributes
    document.querySelector(".range-slider").max = 10;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;

    //below Example 3.6...add step buttons
    // Noun Project Icon: Airplane by Blackwoodmedia.com.au from <a href="https://thenounproject.com/browse/icons/term/airplane/" target="_blank" title="Airplane Icons">Noun Project</a> (CC BY 3.0)
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="forward">Forward</button>');
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="reverse">Reverse</button>');
    
    document.querySelector('#reverse').insertAdjacentHTML('beforeend',"<img src='img/noun-airplane-299060.png'>");
    document.querySelector('#forward').insertAdjacentHTML('beforeend',"<img src='img/reversed_noun-airplane-299060.png'>")
    
     //Below Example 3.6 in createSequenceControls()
    //Step 5: click listener for buttons
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            //sequence
        })
    })

    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){
        //Step 6: get the new index value
        var index = this.value;
        console.log(index)
        //Called in both step button and slider event listener handlers
        //Step 9: pass new attribute to update symbols
        updatePropSymbols(attributes[index]);
    });

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
        console.log(index);

        //Called in both step button and slider event listener handlers
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

    // NOTE: According to a quick Google search, using one of the two scripts below below is safer than using "20" above because if I had any other properties with "20" in the name, those would also be grabbed.
    // I will check in lab if I should change to the Google-recommended script or keep the original 'less-clean' script from the textbook
        //     
        //if (!isNaN(attribute)){  // only numeric property names
        //     attributes.push(attribute);
        // };
        //OR USE: 
        //if (Number(attribute) >= 2013 && Number(attribute) <= 2023){
            //attributes.push(attribute);
                
};
    //check result
    console.log(attributes);

    return attributes;
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
                minValue = calcMinValue(json);
                createPropSymbols(json, attributes);
                createSequenceControls(attributes);
            })
    };

// the eventlistener will wait until the DOM content has loaded and then will call the function createMap which puts the whole thing together
document.addEventListener('DOMContentLoaded',createMap)

