mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: currentEmergency.location.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});


//Setting the marker in the Map
new mapboxgl.Marker()
.setLngLat(currentEmergency.location.coordinates)
.addTo(map);

