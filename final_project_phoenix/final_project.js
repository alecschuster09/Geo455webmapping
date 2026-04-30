// ─────────────────────────────────────────────
// MAP INIT
// ─────────────────────────────────────────────
var map = L.map("map").setView([6.794952075439587, 20.91148703911037], 2);

var streets = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

var TopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 18,
  attribution: 'Tiles &copy; Esri'
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
// MARATHON METADATA
// ─────────────────────────────────────────────
var marathonMeta = {
  "Berlin Marathon":         { difficulty: 1, month: 9  },
  "Boston Marathon":         { difficulty: 5, month: 4  },
  "Chicago Marathon":        { difficulty: 1, month: 10 },
  "London Marathon":         { difficulty: 2, month: 4  },
  "New York City Marathon":  { difficulty: 4, month: 11 },
  "Osaka Marathon":          { difficulty: 2, month: 3  },
  "Paris Marathon":          { difficulty: 2, month: 4  },
  "Sydney Marathon":         { difficulty: 3, month: 9  },
  "Tokyo Marathon":          { difficulty: 2, month: 3  },
  "Valencia Marathon":       { difficulty: 1, month: 12 }
};

// ─────────────────────────────────────────────
// DIFFICULTY COLORS + LABELS
// ─────────────────────────────────────────────
var difficultyColors = {
  1: '#2ecc71',
  2: '#a8d08d',
  3: '#f1c40f',
  4: '#e67e22',
  5: '#e74c3c'
};
var difficultyLabels = {
  1: 'Very Easy',
  2: 'Easy',
  3: 'Moderate',
  4: 'Hard',
  5: 'Very Hard'
};

// Helper: parse participant strings like "54,062" → 54062
function parseParticipants(str) {
  return parseInt(String(str).replace(/,/g, ''), 10);
}

// Helper: get difficulty color by marathon name
function getDifficultyColor(name) {
  var diff = (marathonMeta[name] || {}).difficulty || 3;
  return difficultyColors[diff];
}

// ─────────────────────────────────────────────
// ROUTE LAYERS  (colored by difficulty)
// ─────────────────────────────────────────────
function makeRouteLayer(data, name) {
  var diff  = (marathonMeta[name] || {}).difficulty || 3;
  var color = difficultyColors[diff];

  return L.geoJSON(data, {
    style: {
      color:   color,
      weight:  3,
      opacity: 0.8
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        '<strong>' + name + '</strong><br>' +
        'Course Difficulty: <b>' + difficultyLabels[diff] + '</b> (' + diff + '/5)'
      );
      layer.on({
        mouseover: function() {
          this.setStyle({ weight: 7, opacity: 1 });
          this.openPopup();
        },
        mouseout: function() {
          this.setStyle({ weight: 3, opacity: 0.8 });
          this.closePopup();
        }
      });
    }
  }).addTo(map);
}

var berlinMarathon   = makeRouteLayer(berlinData,   "Berlin Marathon");
var bostonMarathon   = makeRouteLayer(bostonData,   "Boston Marathon");
var chicagoMarathon  = makeRouteLayer(chicagoData,  "Chicago Marathon");
var londonMarathon   = makeRouteLayer(londonData,   "London Marathon");
var nycMarathon      = makeRouteLayer(nycData,      "New York City Marathon");
var osakaMarathon    = makeRouteLayer(osakaData,    "Osaka Marathon");
var parisMarathon    = makeRouteLayer(parisData,    "Paris Marathon");
var sydneyMarathon   = makeRouteLayer(sydneyData,   "Sydney Marathon");
var tokyoMarathon    = makeRouteLayer(tokyoData,    "Tokyo Marathon");
var valenciaMarathon = makeRouteLayer(valenciaData, "Valencia Marathon");

// ─────────────────────────────────────────────
// POINT MARKERS
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
// LAYER 1 – PROPORTIONAL CIRCLES
// ─────────────────────────────────────────────
var minParticipants = Infinity;
var maxParticipants = 0;

marathonPoints.features.forEach(function(f) {
  var n = parseParticipants(f.properties.participants);
  if (n > maxParticipants) maxParticipants = n;
  if (n < minParticipants) minParticipants = n;
});

function propRadius(participants) {
  var n    = parseParticipants(participants);
  var minR = 8, maxR = 40;
  var t    = (n - minParticipants) / (maxParticipants - minParticipants);
  return minR + t * (maxR - minR);
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
// LAYER 3 – TIME SLIDER
// ─────────────────────────────────────────────
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

var sliderLayer = L.layerGroup();

function updateSlider(month) {
  sliderLayer.clearLayers();
  enrichedFeatures.forEach(function(f) {
    if (f.properties.month <= month) {
      var p      = f.properties;
      var coords = f.geometry.coordinates;

      var marker = L.marker([coords[1], coords[0]], {
        icon: L.divIcon({
          html: '<div style="font-size:24px;line-height:1;filter:drop-shadow(1px 1px 1px rgba(0,0,0,0.4));">🏃</div>',
          className:   '',
          iconSize:    [24, 24],
          iconAnchor:  [12, 12],
          popupAnchor: [0, -14]
        })
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

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);
    return container;
  }
});

var sliderControl = new SliderControl();

function initSliderEvents() {
  var slider  = document.getElementById('monthSlider');
  var display = document.getElementById('sliderMonthDisplay');
  if (!slider) return;
  slider.addEventListener('input', function() {
    var m = parseInt(this.value, 10);
    display.textContent = monthNames[m];
    updateSlider(m);
  });
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
  'Streetmap':  streets,
  'Topography': TopoMap
};

var overlays = {
  '<span class="lc-icon">📍</span> Marathon Locations':           pointsLayer,
  '<span class="lc-icon">⭕</span> Participation (Prop Circles)': propCircles,
  '<span class="lc-icon">🎨</span> Course Difficulty':            difficultyLayer,
  '<span class="lc-icon">📅</span> Race Calendar (Time Slider)':  sliderLayer
};

var layerControl = L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

// ─────────────────────────────────────────────
// LEGEND
// ─────────────────────────────────────────────
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

function buildLegend() {
  var el = document.getElementById('legend-panel');
  if (!el) return;

  el.innerHTML =
    '<div class="legend-section">' +
      '<div class="legend-title">⭕ Participation (Proportional Circles)</div>' +
      '<div class="legend-subtitle">Circle size = number of finishers</div>' +
      '<div style="display:flex;align-items:flex-end;gap:10px;margin-bottom:6px;">' +
        legendCircle(8,  '#1a6fc4', '~32k') +
        legendCircle(24, '#1a6fc4', '~45k') +
        legendCircle(40, '#1a6fc4', '~59k') +
      '</div>' +
    '</div>' +

    '<div class="legend-section">' +
      '<div class="legend-title">🎨 Course Difficulty</div>' +
      '<div class="legend-subtitle">Circle + route color = difficulty rating</div>' +
      Object.keys(difficultyColors).map(function(k) {
        return '<div class="legend-box">' +
          '<span class="legend-color" style="background:' + difficultyColors[k] + ';border-radius:50%;"></span>' +
          difficultyLabels[k] +
        '</div>';
      }).join('') +
    '</div>' +

    '<div class="legend-section">' +
      '<div class="legend-title">📅 Race Calendar (Time Slider)</div>' +
      '<div class="legend-box">' +
        '<span style="font-size:20px;line-height:1;filter:drop-shadow(1px 1px 1px rgba(0,0,0,0.4));">🏃</span>' +
        'Marathon visible in selected month' +
      '</div>' +
      '<div class="legend-subtitle">Use the slider (bottom-right) to filter by month.</div>' +
    '</div>';
}

// ─────────────────────────────────────────────
// SHOW / HIDE SLIDER WITH LAYER TOGGLE
// ─────────────────────────────────────────────
map.on('overlayadd', function(e) {
  if (e.layer === sliderLayer) {
    sliderControl.addTo(map);
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