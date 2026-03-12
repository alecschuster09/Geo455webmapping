var streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var topo = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
    layers: 'SRTM30-Colored-Hillshade'
});

var map = L.map("map", {
  center: [6.794952075439587, 20.91148703911037],
  zoom: 2,
  layers: [streets, imagery, topo]
});

var homeCenter = map.getCenter();

var homeZoom = map.getZoom(); 

L.easyButton(('<img src="Home_icon_black.png", height=70%>'), function () {
  map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

/*Create custom popups with images*/
var greatwallPopup = "Great Wall of China<br/><img src='https://upload.wikimedia.org/wikipedia/commons/c/c4/Badaling_China_Great-Wall-of-China-04.jpg' alt='great wall wiki' width='150px'/>";

var chichenPopup = "Chichen Itza<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/960px-Chichen_Itza_3.jpg?_=20090824213859' alt='chichen wiki' width='150px'/>";

var petraPopup = "Petra<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Al_Deir_Petra.JPG/960px-Al_Deir_Petra.JPG?_=20131117020455' alt='petra wiki' width='150px'/>";

var machuPopup = "Machu Picchu<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Machu_Picchu%2C_Per%C3%BA%2C_2015-07-30%2C_DD_47.JPG/960px-Machu_Picchu%2C_Per%C3%BA%2C_2015-07-30%2C_DD_47.JPG?_=20170530203518' alt='machu picchu wiki' width='150px'/>";

var christPopup = "Christ the Redeemer<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Rio_de_Janeiro_-_Cristo_Redentor_01.jpg/960px-Rio_de_Janeiro_-_Cristo_Redentor_01.jpg?_=20170701081809' alt='christ the redeemer wiki' width='150px'/>";

var coloPopup = "Colosseum<br/><img src='https://upload.wikimedia.org/wikipedia/commons/7/74/The_Colosseum.jpg' alt='Colosseum wiki' width='150px'/>";

var tajPopup = "Taj Mahal<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Taj-Mahal.jpg/960px-Taj-Mahal.jpg?_=20170605161416' width='150px'/>";

var customOptions ={'maxWidth': '150','className' : 'custom'};

/*LayerGroup and Data Array*/
var landmarks = L.layerGroup(); //
landmarks.addTo(map); //

var wonders = [
  { name: "Petra", coords: [30.3285, 35.4444], popupHtml: petraPopup },
  { name: "Colosseum", coords: [41.8902, 12.4922], popupHtml: coloPopup },
  { name: "Machu Picchu", coords: [-13.1629, -72.5450], popupHtml: machuPopup},
  { name: "Taj Mahal", coords: [27.1753, 78.0421], popupHtml: tajPopup},
  { name: "Christ the Redeemer", coords: [-22.9517, -43.2104], popupHtml: christPopup},
  { name: "Great Wall of China", coords: [40.4505, 116.5490], popupHtml: greatwallPopup},
  { name: "Chichen Itza", coords: [ 20.6793, -88.5682], popupHtml: chichenPopup},
    ]

function addWondersToLayer(dataArray, layerGroup) {

  for (var i = 0; i < dataArray.length; i++) {
    var feature = dataArray[i]; //
      
    var marker = L.marker(feature.coords); //
      
      marker.bindPopup(feature.popupHtml, customOptions); //
      
      marker.bindTooltip(feature.name, {
      direction: "top",
      sticky: true,
      opacity: 0.9});
      
      marker.addTo(layerGroup); 
  }
}

addWondersToLayer(wonders, landmarks);

/* Adding the Great Wall of China Line */
var lines = L.layerGroup();

var greatWallLineCoords 

var greatWallLineCoords = [
  [40.45058574410227, 116.54903113946699],
  [40.44940804004364, 116.55324919831969],
  [40.44714494004076, 116.55510028845048],
  [40.44545911200895, 116.55455406535388],
  [40.44428131665059, 116.55637480900924],
  [40.44060923386488, 116.56019837128976],
  [40.43557422832096, 116.56189773235194],
  [40.431023921892326, 116.56441642808237],
  [40.43005690361108, 116.56583967643232],
  [40.42912280914733, 116.56815090383526],
  [40.42817101495977, 116.56756399877838]
];

var greatWallLine = L.polyline(greatWallLineCoords, {weight: 14}).addTo(lines);

greatWallLine.bindPopup(greatwallPopup, customOptions);

greatWallLine.bindTooltip("Great Wall of China", { sticky: true });

greatWallLine.on("click", function () {
  map.fitBounds(greatWallLine.getBounds());
}); 

lines.addTo(map);

/* Layer control and Menu Item */
var baseLayers = {
    'Satellite Imagery': imagery,
    'Streetmap': streets,
    "Hillshade": topo,
    };

var overlays = {
  "Seven Wonders": landmarks,
  "Great Wall": lines
};

var layerControl = L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(map);



      

    
  
      
  
