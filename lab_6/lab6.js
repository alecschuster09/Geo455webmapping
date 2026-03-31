var map = L.map("map").setView([51.48882027639122, -0.1028811094342392], 10);

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

function getColorDensity(value) {
    return value > 139 ? '#54278f':
           value > 87  ? '#756bb1':
           value > 53  ? '#9e9ac8':
           value > 32  ? '#cbc9e2':
                         '#f2f0f7';
}

function styleDensity(feature){
    return {
        fillColor: getColorDensity(feature.properties.pop_den),   
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
}

// --------------------------------------------------
// 7. HIGHLIGHT FUNCTION
// --------------------------------------------------
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// --------------------------------------------------
// 8. RESET FUNCTIONS
// --------------------------------------------------
function resetDensityHighlight(e) {
    densityLayer.resetStyle(e.target);
    e.target.closePopup();
}

// --------------------------------------------------
// 9. INTERACTION FUNCTIONS
// --------------------------------------------------
function onEachDensityFeature(feature, layer) {
    layer.bindPopup(
        '<strong>' + feature.properties.NAME + '</strong><br>' +
        '<span style="color:purple">' + feature.properties.pop_den + ' people/hectare</span>'
    );

    layer.on({
        mouseover: function (e) {
            highlightFeature(e);
            e.target.openPopup();
        },
        mouseout: resetDensityHighlight
    });
}

var densitymap = L.geoJson(data, {
   style:styleDensity,
   onEachFeature: onEachDensityFeature
}).addTo(map);


// --------------------------------------------------
// 12. BUILD LEGENDS IN THE SIDE PANEL
// --------------------------------------------------
function buildLegendHTML(title, grades, colorFunction) {
    var html = '<div class="legend-title">' + title + '</div>';

    for (var i = 0; i < grades.length; i++) {
        var from = grades[i];
        var to = grades[i + 1];

        html +=
            '<div class="legend-box">' +
                '<span class="legend-color" style="background:' + colorFunction(from + 1) + '"></span>' +
                '<span>' + from + (to ? '&ndash;' + to : '+') + '</span>' +
            '</div>';
    }

    return html;
}

// Insert density legend into side panel
var densityLegendDiv = document.getElementById('density-legend');
if (densityLegendDiv) {
    densityLegendDiv.innerHTML = buildLegendHTML(
        'Population Density',
        [0, 32, 53, 87, 139],
        getColorDensity
    );
}

var nonenglish = L.geoJson(nonenglish, {
}).addTo(map);

var baseMaps = {
  'Population Density': densitymap,
  'Non English Speakers': nonenglish
};

var layerControl = L.control.layers(baseMaps, null, {collapsed: false}).addTo(map);




