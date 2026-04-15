var map = L.map("map").setView([43.09157730670122, -89.41174811804763], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var migrationLayer = new L.migrationLayer({
    map: map,
    data: data,
    pulseRadius:25,
    pulseBorderWidth:1,
    arcWidth:1,
    arcLabel:false,
    arcLabelFont:'14px sans-serif',
    maxWidth:10
});

migrationLayer.addTo(map);

var cities = L.geoJson(loc, {
     style: function (feature) {
        return { color: '#5362f3', weight: 0.5, opacity: 0.7};
    },
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindTooltip(feature.properties.NAME, {permanent: false, direction: 'right'});
    }
}).addTo(map);
    
map.fitBounds(cities.getBounds());

function hideLayer(){
    migrationLayer.hide();
}
function showLayer(){
    migrationLayer.show();
}
function playLayer(){
    migrationLayer.play();
}
function pauseLayer(){
    migrationLayer.pause();
}