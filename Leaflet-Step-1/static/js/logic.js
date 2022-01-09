// Create the tile layer that will be the background of our map.
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Initialize all the LayerGroups that we'll use.
var layers = {
  Quakes: new L.LayerGroup()
};

// Create the map with our layers.
var map = L.map("map", {
  center: [0.000, 0.000],
  zoom: 2.5,
  layers: [
    layers.Quakes
  ]
});

// Add our "streetmap" tile layer to the map.
streetmap.addTo(map);

// Create an overlays object to add to the layer control.
var overlays = {
  "Earthquakes": layers.Quakes
};

// Create a control for our layers, and add our overlays to it.
L.control.layers(null, overlays).addTo(map);


// Perform an call to retrieve the earthquake data for the month in json format.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function(EarthquakeData) {


    console.log(EarthquakeData);

    let EarthquakeList = EarthquakeData.features;

    console.log(EarthquakeList[0]);



    for (var i = 0; i < EarthquakeList.length; i++) {

        var Earthquake = EarthquakeList[i];

        var depth = Earthquake.geometry.coordinates[2];


        // Anything deeper than 300, make a solid circle
        depthFill = depth/300 + .1;

        if (depthFill > 1) {depthFill = 1};

        // https://leafletjs.com/examples/choropleth/
        function getColor(depth) {
            return depth > 500 ? "red" :
                   depth > 400  ? "orange" :
                   depth > 300  ? "yellow" :
                   depth > 200  ? "green" :
                   depth > 100   ? "blue" :
                              "violet";
        }

        // var color = "";
        // if (depth > 500) {
        //   color = "red";
        // }
        // else if (depth > 400) {
        //   color = "orange";
        // }
        // else if (depth > 300) {
        //   color = "yellow";
        // }
        // else if (depth > 200) {
        //     color = "green";
        // }
        // else if (depth > 100) {
        //     color = "blue";
        // }
        // else {
        //   color = "violet";
        // }

        
        var EarthquakeSize = (Earthquake.properties.mag * 50000)*Math.cos((Earthquake.geometry.coordinates[1]/180)*Math.PI)

    
        var newQuake = L.circle([Earthquake.geometry.coordinates[1],Earthquake.geometry.coordinates[0]], {
            color: 'black',
            weight: 1,
            fillColor: getColor(Earthquake.geometry.coordinates[2]),
            fillOpacity: .65,
            radius: EarthquakeSize
        });

        newQuake.addTo(layers.Quakes);

        newQuake.bindPopup(" Magnitude: " + Earthquake.properties.mag + 
                            "<br> Depth: " + depth +
                            "<br> Place: " + Earthquake.properties.place);
    };

//https://leafletjs.com/examples/choropleth/
     // Create a legend to display information about our map.
    var info = L.control({
        position: "bottomright"
    });
  
  // When the layer control is added, insert a div with the class of "legend".
    info.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'legend');
        grades = [0, 100, 200, 300, 400, 500],
        labels = [];
  
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');  
        }
        return div;
    };
  // Add the info legend to the map.
    info.addTo(map);


    // document.querySelector(".legend").innerHTML = [
    //     "<p> Color by Depth " + "</p>",
    //     "<p> Under 100: " + "</p>",
    //     "<p> 100 - 200: " + "</p>",
    //     "<p> 200 - 300: " + "</p>",
    //     "<p> 300 - 400: " + "</p>",
    //     "<p> 400 - 500: " + "</p>",
    //     "<p> Over 500 " + "</p>"
    //   ].join("");

});