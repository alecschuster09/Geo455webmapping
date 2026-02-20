const map = L.map("map").setView([-12.755748320900487, -74.04171501711798], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var myIcon1 = L.icon({
    iconUrl: 'images/icon_640.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon1 = L.icon({
    iconUrl: 'images/icon_640.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon1 = L.icon({
    iconUrl: 'images/icon_640.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon1 = L.icon({
    iconUrl: 'images/icon_640.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon1 = L.icon({
    iconUrl: 'images/icon_640.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon1 = L.icon({
    iconUrl: 'images/icon_640.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon1 = L.icon({
    iconUrl: 'images/icon_640.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon1 = L.icon({
    iconUrl: 'images/icon_640',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon1 = L.icon({
    iconUrl: 'images/icon_640.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon1 = L.icon({
    iconUrl: 'images/icon_640.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});

var MachuPicchu = L.marker([-13.163001968881893, -72.54526135215248], {icon: myIcon1}).bindPopup("<b>Machu Picchu").addTo(map);
var LakeHumantay = L.marker([-13.379257229843631, -72.58466353418564], {icon: myIcon1}).bindPopup("<b>Lake Humantay").addTo(map);
var Cusco = L.marker([-13.53118420742982, -71.96705905930583], {icon: myIcon1}).bindPopup("<b>Cusco").addTo(map);
var RainbowMountains = L.marker([-13.869581481950595, -71.30316213141414], {icon: myIcon1}).bindPopup("<b>Rainbow Mountains").addTo(map);
var Sacsayhuaman = L.marker([-13.509511731714898, -71.98170926116995], {icon: myIcon1}).bindPopup("<b>Sacsayhuaman Ruins").addTo(map);
var Lima = L.marker([-12.040692656493423, -77.04615813366128], {icon: myIcon1}).bindPopup("<b>Lima").addTo(map);
var SacredValley = L.marker([-13.331980131901283, -72.08463693232727], {icon: myIcon1}).bindPopup("<b>Sacred Valley").addTo(map);
var Huacachina = L.marker([-14.087400041052922, -75.76330891901914], {icon: myIcon1}).bindPopup("<b>Huacachina Oasis").addTo(map);
var Paracas = L.marker([-13.83288957844985, -76.24775848280781], {icon: myIcon1}).bindPopup("<b>Paracas").addTo(map);
var LimaMainSquare = L.marker([-12.045927317812463, -77.03056727468939], {icon: myIcon1}).bindPopup("<b>Lima Main Square").addTo(map);

