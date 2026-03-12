var streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});


var map = L.map("map", {
  center: [6.794952075439587, 20.91148703911037],
  zoom: 2,
  layers: [streets, imagery,]
});

var homeCenter = map.getCenter();

var homeZoom = map.getZoom(); 

L.easyButton(('<img src="Home_icon_black.png", height=60%>'), function () {
  map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

/*Create custom popups with images*/
var greatwallPopup = "Great Wall of China<br/><img src='https://upload.wikimedia.org/wikipedia/commons/c/c4/Badaling_China_Great-Wall-of-China-04.jpg' alt='great wall wiki' width='150px'/>";

var chichenPopup = "Chichen Itza<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/960px-Chichen_Itza_3.jpg?_=20090824213859' alt='chichen wiki' width='150px'/>";

var petraPopup = "Petra<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Al_Deir_Petra.JPG/960px-Al_Deir_Petra.JPG?_=20131117020455' alt='petra wiki' width='150px'/>";

var machuPopup = "Machu Picchu<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Machu_Picchu%2C_Per%C3%BA%2C_2015-07-30%2C_DD_47.JPG/960px-Machu_Picchu%2C_Per%C3%BA%2C_2015-07-30%2C_DD_47.JPG?_=20170530203518' alt='machu picchu wiki' width='150px'/>";

var christPopup = "Christ the Redeemer<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Rio_de_Janeiro_-_Cristo_Redentor_01.jpg/960px-Rio_de_Janeiro_-_Cristo_Redentor_01.jpg?_=20170701081809' alt='christ the redeemer wiki' width='150px'/>";

var coloPopup = "Colosseum<br/><img src='https://upload.wikimedia.org/wikipedia/commons/7/74/The_Colosseum.jpg' alt='Colosseum wiki' alt='Colosseum wiki' width='150px'/>";

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
    ];

var iconFiles = [
  "images/icon_1.png",
  "images/icon_2.png",
  "images/icon_3.png",
  "images/icon_4.png",
  "images/icon_5.png",
  "images/icon_6.png",
  "images/icon_7.png",
];

var wonderIcons = [];
for (var i = 0; i < iconFiles.length; i++) {
  wonderIcons.push(
    L.icon({
      iconUrl: iconFiles[i],
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -28],
    })
  );
}

function addWondersToLayer(dataArray, layerGroup, iconsArray) {
  var markers = [];

  for (var i = 0; i < dataArray.length; i++) {
    var feature = dataArray[i]; 
      
    var marker = L.marker(feature.coords, { icon: iconsArray[i] }) 
    .bindPopup(feature.popupHtml, customOptions)
    .bindTooltip(feature.name, { direction: "top", sticky: true, opacity: 0.9 })
    .addTo(layerGroup);
    
    markers.push(marker);
  }
  
  return markers;
}

addWondersToLayer(wonders, landmarks, wonderIcons);


/* Layer control and Menu Item */
var baseLayers = {
    'Satellite Imagery': imagery,
    'Streetmap': streets,
    };

var overlays = {};

/* --------------------------------------------------------------
  8) CLICK INTERACTIVITY (Lab 5): popup + update panel (NO marker)
-------------------------------------------------------------- */

// Reuse one popup object (cleaner than creating new ones each click)
var clickPopup = L.popup();

function onMapClick(e) {
  var lat = e.latlng.lat;
  var lon = e.latlng.lng;
  clickPopup
    .setLatLng(e.latlng)
    .setContent(
      "You clicked the map at:<br>" +
      "<b>Lat:</b> " + lat.toFixed(5) + "<br>" +
      "<b>Lon:</b> " + lon.toFixed(5)
    )
    .openOn(map);
  document.getElementById("click-lat").textContent = lat.toFixed(5);
  document.getElementById("click-lon").textContent = lon.toFixed(5);
}

map.on("click", onMapClick);


var layerControl = L.control.layers(baseLayers, overlays, {
  collapsed: false,
  position: 'bottomright' 
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

var buttonsDiv = document.getElementById("wonder-buttons");
var wonderZoom = 6; // pick a zoom level you like

for (var i = 0; i < wonders.length; i++) {
  (function(index) {
    // Create a <button>
    var btn = document.createElement("button");
    btn.type = "button";

    // If using Bootstrap, use btn classes. If not, you can use your own CSS.
    btn.className = "btn btn-outline-secondary btn-sm text-start";

    // Use the SAME icon as the marker + show name
    btn.innerHTML =
      '<img src="' + iconFiles[index] + '" style="width:18px;height:18px;margin-right:8px;">' +
      wonders[index].name;

    // When clicked: zoom to the location + open popup
    btn.addEventListener("click", function() {
      map.setView(wonders[index].coords, wonderZoom);
      wonderMarkers[index].openPopup();
    });

    buttonsDiv.appendChild(btn);
  })(i);
}

/* --------------------------------------------------------------
  9) REAL-TIME ISS (Lab 5): moving marker + jump button
-------------------------------------------------------------- */

var issIcon = L.icon({
  iconUrl: "images/iss200.png",
  iconSize: [80, 52],
  iconAnchor: [25, 16],
});

var issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

// API endpoint
var api_url = "https://api.wheretheiss.at/v1/satellites/25544";

function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

async function getISS() {
  try {
    var response = await fetch(api_url);
    if (!response.ok) throw new Error("ISS API error");
    var data = await response.json();
    var latitude = data.latitude;
    var longitude = data.longitude;

    issMarker.setLatLng([latitude, longitude]);

    document.getElementById("lat").textContent = latitude.toFixed(3);
    document.getElementById("lon").textContent = longitude.toFixed(3);
    document.getElementById("iss-time").textContent = formatTime(new Date());
  } catch (err) {
    document.getElementById("iss-time").textContent = "ISS unavailable";
  }
}

// Initial call + refresh
getISS();
setInterval(getISS, 1000);

// Jump to ISS button (required feature)
document.getElementById("btn-iss").addEventListener("click", function () {
  var ll = issMarker.getLatLng();
  map.setView([ll.lat, ll.lng], 4);
});



      

    
  
      
  
