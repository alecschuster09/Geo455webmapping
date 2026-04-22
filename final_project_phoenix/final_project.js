// Calling the two basemaps
var map = L.map("map").setView([6.794952075439587, 20.91148703911037], 2);

// Carto (free, no key needed)
var streets = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

var TopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Minimap
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(map);

// Home button
var homeCenter = map.getCenter();
var homeZoom = map.getZoom();
L.easyButton('<img src="images/globe_icon.png" style="height:70%">', function() {
  map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

// Scale bar
L.control.scale({
  position: 'bottomright',
  metric: true,
  imperial: true
}).addTo(map);

// Layer control 
var overlays = {};

var baseLayers = {
  'Streetmap': streets,
  'Topography': TopoMap
};

var layerControl = L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

//Berlin Data
var berlinMarathon = L.geoJSON(berlinData, {
  style: { color: '#e74c3c', weight: 3, opacity: 0.8 }
}).addTo(map);

//Boston Data
var bostonMarathon = L.geoJSON(bostonData, {
  style: { color: '#e74c3c', weight: 3, opacity: 0.8 }
}).addTo(map);

//Chicago Data
var chicagoMarathon = L.geoJSON(chicagoData, {
  style: { color: '#e74c3c', weight: 3, opacity: 0.8 }
}).addTo(map);

//London Data
var londonMarathon = L.geoJSON(londonData, {
  style: { color: '#e74c3c', weight: 3, opacity: 0.8 }
}).addTo(map);

//NYC Data
var nycMarathon = L.geoJSON(nycData, {
  style: { color: '#e74c3c', weight: 3, opacity: 0.8 }
}).addTo(map);

//Osaka Data
var osakaMarathon = L.geoJSON(osakaData, {
  style: { color: '#e74c3c', weight: 3, opacity: 0.8 }
}).addTo(map);

//Paris Data
var parisMarathon = L.geoJSON(parisData, {
  style: { color: '#e74c3c', weight: 3, opacity: 0.8 }
}).addTo(map);

//Sydney Data
var sydneyMarathon = L.geoJSON(sydneyData, {
  style: { color: '#e74c3c', weight: 3, opacity: 0.8 }
}).addTo(map);

//Tokyo Data
var tokyoMarathon = L.geoJSON(tokyoData, {
  style: { color: '#e74c3c', weight: 3, opacity: 0.8 }
}).addTo(map);

//Valencia Data
var valenciaMarathon = L.geoJSON(valenciaData, {
  style: { color: '#e74c3c', weight: 3, opacity: 0.8 }
}).addTo(map);


L.geoJSON(marathonPoints, {
  onEachFeature: function(feature, layer) {
    var p = feature.properties;
    
    layer.bindTooltip(p.location);
    
    layer.bindPopup(`
      <strong>${p.name}</strong><br>
      <em>${p.location}</em><br>
      Participants: ${p.participants}<br>
      <img src="${p.photo}" width="200"><br><br>
      <a href="${p.website}" target="_blank">Official Website</a>
    `);
  }
}).addTo(map);