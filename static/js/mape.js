$(document).ready(function() {
    var map = new L.Map('map');
    map.setView(new L.LatLng(45.8150, 15.9819), 10);
    var googleLayer = new L.Google('ROADMAP');
    map.addLayer(googleLayer);
    //map.attributionControl.setPrefix('');
    var kmlLayer = new L.KML("../data/karta_zagreb.kml", {async: true});
    map.addLayer(kmlLayer);
    });
