var map = L.map("map").setView([28.972443641658437, 84.59443216376953], 8);

// Carto (free, no key needed)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});

// Add minimap control
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(map);

var homeCenter = map.getCenter();

var homeZoom = map.getZoom();

L.easyButton(('<img src="images/globe_icon.png", height=70%>'), function() {
    map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

// Define the icon FIRST
var myIcon = L.icon({
    iconUrl: 'images/peaks.png',
    iconSize: [20, 20],
    iconAnchor: [10, 15],
    popupAnchor: [1, -24],
});

// Then use it here with mountain peaks data//
var peaks = new L.geoJson(mtn_peaks, {
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup(
            '<p>Peak Name: <b>' + feature.properties.TITLE + '</b></br>' +
            'Peak Height: ' + feature.properties.Peak_Heigh + ' m</br>' +
            'Number of Deaths: ' + feature.properties.number_of_ + '</br>' +
            'Number of Expeditions: ' + feature.properties.number_of1 + '</p>'
        );
    },
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: myIcon});
    }
}).addTo(map);

// Proportional Circles//
function getRadius(area) {
  var radius = Math.sqrt(area / Math.PI);
  return radius * 2;
}

var propcircles = new L.geoJson(mtn_peaks, {
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindPopup(
            '<p>Peak Name: <b>' + feature.properties.TITLE + '</b></br>' +
            'Number of Expeditions: ' + feature.properties.number_of1 + '</p>'
        );
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            fillColor: '#920101',
            color: '#920101',
            weight: 2,
            radius: getRadius(feature.properties.number_of1),
            fillOpacity: 0.35
        }).on({
            mouseover: function(e) {
                this.openPopup();
                this.setStyle({fillOpacity: 0.8, fillColor: '#2D8F4E'});
            },
            mouseout: function(e) {
                this.closePopup();
                this.setStyle({fillOpacity: 0.35, fillColor: '#920101'});
            }
        });
    }
});

// Heatmap //
var min = 0;
var max = 0;
var heatMapPoints = [];

mtn_peaks.features.forEach(function(feature) {
    heatMapPoints.push([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        feature.properties.number_of_
    ]);

    if (feature.properties.number_of_ < min || min === 0) {
        min = feature.properties.number_of_;
    }

    if (feature.properties.number_of_ > max || max === 0) {
        max = feature.properties.number_of_;
    }
});

var heat = L.heatLayer(heatMapPoints, {
    radius: 25,
    minOpacity: 0.5,
    gradient:{0.5: 'blue', 0.75: 'lime', 1: 'red'},
});

// Cluster Markers //
var clustermarkers = L.markerClusterGroup();
mtn_peaks.features.forEach(function(feature) {
    clustermarkers.addLayer(L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]));
});



// Search Box //
var searchControl = new L.Control.Search({
    position:'topright',
    layer: peaks,
    propertyName: 'TITLE',
    marker: false,
    markeranimate: true,
    delayType: 50,
    collapsed: false,
    textPlaceholder: 'Search by Peak Name: e.g. Everest, Lhotse',   
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 15);}
});

map.addControl(searchControl);

// Add a scale bar
L.control.scale({
    position: 'bottomright', // or 'bottomright', 'topleft', 'topright'
    metric: true,   // meters/kilometers
    imperial: true  // miles/feet
}).addTo(map);

// If these are all overlay layers (markers, heatmaps, etc.)
var overlays = {
  '<img src="images/peaks.png" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"> Location of Himalayan Peaks': peaks,
  '<img src="images/propcircles.png" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"> Expeditions Proportional Circles': propcircles,
  '<img src="images/dead.jpg" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"> Death Density Heat Map': heat,
  '<img src="images/cluster_icon.png" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"> Clustering of Peaks': clustermarkers
};

L.control.layers(null, overlays, {collapsed: false}).addTo(map);





