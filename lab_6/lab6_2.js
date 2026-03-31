

function getColornonenglish(value) {
    return value > 7.72 ? '#045a8d':
           value > 4.66 ? '#2b8cbe':
           value > 3.03 ? '#74a9cf':
           value > 1.34 ? '#bdc9e1':
                          '#f1eef6';
}

function stylenonenglish(feature) {
    return {
        fillColor: getColornonenglish(feature.properties.webmap),
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
function resetnonenglishHighlight(e) {
    nonenglishLayer.resetStyle(e.target);
    e.target.closePopup();
}

// --------------------------------------------------
// 9. INTERACTION FUNCTIONS
// --------------------------------------------------
function onEachnonenglishFeature(feature, layer) {
    layer.bindPopup(
        '<strong>' + feature.properties.NAME + '</strong><br>' +
        '<span style="color:blue">' + feature.properties.webmap + ' non english speakers/hectare</span>'
    );
    layer.on({
        mouseover: function (e) {
            highlightFeature(e);
            e.target.openPopup();
        },
        mouseout: resetnonenglishHighlight
    });
}

// Insert density legend into side panel
var nonenglishLegendDiv = document.getElementById('density-legend-nonenglish');
if (nonenglishLegendDiv) {
    nonenglishLegendDiv.innerHTML = buildLegendHTML(
        'Non English Speakers',
        [0, 1.34, 3.03, 4.66, 7.72],
        getColornonenglish
    );
}



var nonenglishLayer = L.geoJson(nonenglish, {
    style: stylenonenglish,
    onEachFeature: onEachnonenglishFeature
}).addTo(map);

var baseMaps = {
  'Non English Speakers': nonenglishLayer
};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(mymap);