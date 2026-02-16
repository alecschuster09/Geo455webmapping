const map = L.map("map").setView([-13.163001968881893, -72.54526135215248], 13);

L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);

L.marker([-13.163001968881893, -72.54526135215248])
  .addTo(map)
  .bindPopup("<b>Hola!</b><br>I am Machu Picchu, one of the seven wonders of the world!")
  .openPopup();