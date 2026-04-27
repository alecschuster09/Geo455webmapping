// ─────────────────────────────────────────────
// MAP INIT
// ─────────────────────────────────────────────
var map = L.map("map").setView([6.794952075439587, 20.91148703911037], 2);

var streets = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

var TopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
});

// ─────────────────────────────────────────────
// MINIMAP
// ─────────────────────────────────────────────
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0, maxZoom: 13, attribution: '&copy; OpenStreetMap'
});
new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true, minimized: false, position: "bottomleft"
}).addTo(map);

// ─────────────────────────────────────────────
// HOME BUTTON + SCALE
// ─────────────────────────────────────────────
var homeCenter = map.getCenter();
var homeZoom   = map.getZoom();
L.easyButton('<img src="images/globe_icon.png" style="height:70%">', function() {
  map.setView(homeCenter, homeZoom);
}, "Home").addTo(map);

L.control.scale({ position: 'bottomright', metric: true, imperial: true }).addTo(map);

// ─────────────────────────────────────────────
// MARATHON METADATA  (difficulty + month added here)
// difficulty scale 1–5:  1 = Very Easy, 2 = Easy, 3 = Moderate, 4 = Hard, 5 = Very Hard
// month = numeric month the race is held
// ─────────────────────────────────────────────
var marathonMeta = {
  "Berlin Marathon":        { difficulty: 1, month: 9  },  // Sept  – famously flat
  "Boston Marathon":        { difficulty: 5, month: 4  },  // April – hills, Heartbreak Hill
  "Chicago Marathon":       { difficulty: 1, month: 10 },  // Oct   – flat city loop
  "London Marathon":        { difficulty: 2, month: 4  },  // April – mostly flat
  "New York City Marathon":  { difficulty: 4, month: 11 },  // Nov   – 5 bridges, rolling
  "Osaka Marathon":         { difficulty: 2, month: 3  },  // March – flat urban
  "Paris Marathon":         { difficulty: 2, month: 4  },  // April – gently rolling
  "Sydney Marathon":        { difficulty: 3, month: 9  },  // Sept  – some hills, bridge
  "Tokyo Marathon":         { difficulty: 2, month: 3  },  // March – flat city
  "Valencia Marathon":      { difficulty: 1, month: 12 }   // Dec   – certified flat/fast
};

// Helper: parse participant strings like "54,062" → 54062
function parseParticipants(str) {
  return parseInt(String(str).replace(/,/g, ''), 10);
}

// ─────────────────────────────────────────────
// ROUTE LAYERS  (unchanged from your original)
// ─────────────────────────────────────────────
var routeStyle = { color: '#e74c3c', weight: 3, opacity: 0.8 };

var berlinMarathon   = L.geoJSON(berlinData,   { style: routeStyle }).addTo(map);
var bostonMarathon   = L.geoJSON(bostonData,   { style: routeStyle }).addTo(map);
var chicagoMarathon  = L.geoJSON(chicagoData,  { style: routeStyle }).addTo(map);
var londonMarathon   = L.geoJSON(londonData,   { style: routeStyle }).addTo(map);
var nycMarathon      = L.geoJSON(nycData,      { style: routeStyle }).addTo(map);
var osakaMarathon    = L.geoJSON(osakaData,    { style: routeStyle }).addTo(map);
var parisMarathon    = L.geoJSON(parisData,    { style: routeStyle }).addTo(map);
var sydneyMarathon   = L.geoJSON(sydneyData,   { style: routeStyle }).addTo(map);
var tokyoMarathon    = L.geoJSON(tokyoData,    { style: routeStyle }).addTo(map);
var valenciaMarathon = L.geoJSON(valenciaData, { style: routeStyle }).addTo(map);

// ─────────────────────────────────────────────
// POINT MARKERS  (your original layer)
// ─────────────────────────────────────────────
var pointsLayer = L.geoJSON(marathonPoints, {
  onEachFeature: function(feature, layer) {
    var p = feature.properties;
    layer.bindTooltip(p.name);
    layer.bindPopup(
      '<strong>' + p.name + '</strong><br>' +
      '<em>' + p.location + '</em><br>' +
      'Participants: ' + p.participants + '<br>' +
      '<img src="' + p.photo + '" width="200" style="margin:6px 0"><br>' +
      '<a href="' + p.website + '" target="_blank">Official Website</a>'
    );
  }
}).addTo(map);

// ─────────────────────────────────────────────
// LAYER 1 – PROPORTIONAL CIRCLES (by participants)
// ─────────────────────────────────────────────
var maxParticipants = 0;
marathonPoints.features.forEach(function(f) {
  var n = parseParticipants(f.properties.participants);
  if (n > maxParticipants) maxParticipants = n;
});

function propRadius(participants) {
  var n = parseParticipants(participants);
  // Scale so the largest circle (NYC ~59k) gets radius 35px
  return Math.sqrt(n / maxParticipants) * 35;
}

var propCircles = L.geoJSON(marathonPoints, {
  pointToLayer: function(feature, latlng) {
    var p = feature.properties;
    return L.circleMarker(latlng, {
      radius:      propRadius(p.participants),
      fillColor:   '#1a6fc4',
      color:       '#0d3b6e',
      weight:      1.5,
      fillOpacity: 0.45
    });
  },
  onEachFeature: function(feature, layer) {
    var p = feature.properties;
    layer.bindPopup(
      '<strong>' + p.name + '</strong><br>' +
      'Participants: <b>' + p.participants + '</b>'
    );
    layer.on({
      mouseover: function() {
        this.setStyle({ fillOpacity: 0.85, fillColor: '#f39c12' });
        this.openPopup();
      },
      mouseout: function() {
        this.setStyle({ fillOpacity: 0.45, fillColor: '#1a6fc4' });
        this.closePopup();
      }
    });
  }
});

// ─────────────────────────────────────────────
// LAYER 2 – COURSE DIFFICULTY
// ─────────────────────────────────────────────
var difficultyColors = {
  1: '#2ecc71',   // Very Easy  – green
  2: '#a8d08d',   // Easy       – light green
  3: '#f1c40f',   // Moderate   – yellow
  4: '#e67e22',   // Hard       – orange
  5: '#e74c3c'    // Very Hard  – red
};
var difficultyLabels = {
  1: 'Very Easy',
  2: 'Easy',
  3: 'Moderate',
  4: 'Hard',
  5: 'Very Hard'
};

var difficultyLayer = L.geoJSON(marathonPoints, {
  pointToLayer: function(feature, latlng) {
    var name = feature.properties.name;
    var diff = (marathonMeta[name] || {}).difficulty || 3;
    return L.circleMarker(latlng, {
      radius:      16,
      fillColor:   difficultyColors[diff],
      color:       '#333',
      weight:      1.5,
      fillOpacity: 0.85
    });
  },
  onEachFeature: function(feature, layer) {
    var p    = feature.properties;
    var diff = (marathonMeta[p.name] || {}).difficulty || 3;
    layer.bindPopup(
      '<strong>' + p.name + '</strong><br>' +
      'Course Difficulty: <b>' + difficultyLabels[diff] + '</b> (' + diff + '/5)<br>' +
      '<em>' + p.location + '</em>'
    );
    layer.on({
      mouseover: function() { this.setStyle({ fillOpacity: 1, weight: 3 }); this.openPopup(); },
      mouseout:  function() { this.setStyle({ fillOpacity: 0.85, weight: 1.5 }); this.closePopup(); }
    });
  }
});

// ─────────────────────────────────────────────
// LAYER 3 – TIME SLIDER  (January → December)
// ─────────────────────────────────────────────
// Build an enriched copy of marathonPoints with meta injected
var enrichedFeatures = marathonPoints.features.map(function(f) {
  var meta = marathonMeta[f.properties.name] || {};
  return Object.assign({}, f, {
    properties: Object.assign({}, f.properties, {
      month:      meta.month      || 1,
      difficulty: meta.difficulty || 3
    })
  });
});

var monthNames = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Layer group that holds whatever the slider is currently showing
var sliderLayer = L.layerGroup();

function updateSlider(month) {
  sliderLayer.clearLayers();
  enrichedFeatures.forEach(function(f) {
    if (f.properties.month <= month) {
      var p = f.properties;
      var coords = f.geometry.coordinates;
      var marker = L.circleMarker([coords[1], coords[0]], {
        radius:      12,
        fillColor:   '#8e44ad',
        color:       '#4a235a',
        weight:      1.5,
        fillOpacity: 0.75
      });
      marker.bindPopup(
        '<strong>' + p.name + '</strong><br>' +
        'Race Month: <b>' + monthNames[p.month] + '</b><br>' +
        'Location: ' + p.location + '<br>' +
        'Participants: ' + p.participants
      );
      sliderLayer.addLayer(marker);
    }
  });
}

// Custom Leaflet slider control
var SliderControl = L.Control.extend({
  options: { position: 'bottomright' },
  onAdd: function() {
    var container = L.DomUtil.create('div', 'slider-control');
    container.innerHTML =
      '<div class="slider-inner">' +
        '<div class="slider-label">Race Calendar</div>' +
        '<div class="slider-month-display" id="sliderMonthDisplay">January</div>' +
        '<input type="range" id="monthSlider" min="1" max="12" value="1" ' +
               'style="width:100%;cursor:pointer;">' +
        '<div class="slider-ticks">' +
          '<span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>' +
        '</div>' +
        '<div class="slider-hint">Drag to reveal marathons by month</div>' +
      '</div>';

    // Prevent map from intercepting mouse/touch events on the slider
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    return container;
  }
});

var sliderControl = new SliderControl();

// Wire up slider events AFTER it has been added to the map
function initSliderEvents() {
  var slider  = document.getElementById('monthSlider');
  var display = document.getElementById('sliderMonthDisplay');
  if (!slider) return;
  slider.addEventListener('input', function() {
    var m = parseInt(this.value, 10);
    display.textContent = monthNames[m];
    updateSlider(m);
  });
  // Initialise to January
  updateSlider(1);
}

// ─────────────────────────────────────────────
// SEARCH BOX
// ─────────────────────────────────────────────
var searchControl = new L.Control.Search({
  position:       'topright',
  layer:          pointsLayer,
  propertyName:   'name',
  marker:         false,
  markeranimate:  true,
  delayType:      50,
  collapsed:      false,
  textPlaceholder:'Search Marathon: e.g. Boston, London',
  moveToLocation: function(latlng, title, map) { map.setView(latlng, 11); }
});
map.addControl(searchControl);

// ─────────────────────────────────────────────
// LAYER CONTROL
// ─────────────────────────────────────────────
var baseLayers = {
  'Streetmap':   streets,
  'Topography':  TopoMap
};

var overlays = {
  '<span class="lc-icon">📍</span> Marathon Locations':          pointsLayer,
  '<span class="lc-icon">⭕</span> Participation (Prop Circles)': propCircles,
  '<span class="lc-icon">🎨</span> Course Difficulty':           difficultyLayer,
  '<span class="lc-icon">📅</span> Race Calendar (Time Slider)': sliderLayer
};

var layerControl = L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

// ─────────────────────────────────────────────
// LEGEND PANEL (rendered in sidebar)
// ─────────────────────────────────────────────
function buildLegend() {
  var el = document.getElementById('legend-panel');
  if (!el) return;

  el.innerHTML =
    // Proportional circles legend
    '<div class="legend-section">' +
      '<div class="legend-title">⭕ Participation (Proportional Circles)</div>' +
      '<div class="legend-subtitle">Circle size = number of finishers</div>' +
      '<div style="display:flex;align-items:flex-end;gap:10px;margin-bottom:6px;">' +
        legendCircle(10, '#1a6fc4', '~30k') +
        legendCircle(20, '#1a6fc4', '~45k') +
        legendCircle(28, '#1a6fc4', '~59k') +
      '</div>' +
    '</div>' +

    // Difficulty legend
    '<div class="legend-section">' +
      '<div class="legend-title">🎨 Course Difficulty</div>' +
      Object.keys(difficultyColors).map(function(k) {
        return '<div class="legend-box">' +
          '<span class="legend-color" style="background:' + difficultyColors[k] + ';border-radius:50%;"></span>' +
          difficultyLabels[k] +
        '</div>';
      }).join('') +
    '</div>' +

    // Time slider legend
    '<div class="legend-section">' +
      '<div class="legend-title">📅 Race Calendar (Time Slider)</div>' +
      '<div class="legend-box">' +
        '<span class="legend-color" style="background:#8e44ad;border-radius:50%;"></span>' +
        'Marathon visible in selected month' +
      '</div>' +
      '<div class="legend-subtitle">Use the slider (bottom-right) to filter by month.</div>' +
    '</div>';
}

function legendCircle(r, color, label) {
  var d = r * 2;
  return '<div style="text-align:center;">' +
    '<svg width="' + d + '" height="' + d + '">' +
      '<circle cx="' + r + '" cy="' + r + '" r="' + (r - 1) + '" ' +
        'fill="' + color + '" fill-opacity="0.45" stroke="#0d3b6e" stroke-width="1.5"/>' +
    '</svg>' +
    '<div style="font-size:0.75rem;color:#555;">' + label + '</div>' +
  '</div>';
}

// ─────────────────────────────────────────────
// SHOW / HIDE SLIDER CONTROL WITH LAYER TOGGLE
// ─────────────────────────────────────────────
map.on('overlayadd', function(e) {
  if (e.layer === sliderLayer) {
    sliderControl.addTo(map);
    // slight delay so the DOM element exists
    setTimeout(initSliderEvents, 50);
  }
});
map.on('overlayremove', function(e) {
  if (e.layer === sliderLayer) {
    map.removeControl(sliderControl);
  }
});

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
buildLegend();
