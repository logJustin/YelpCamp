mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom

});

new mapboxgl.Marker({ color: '#4c6951' })
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<strong><p style="margin-bottom: 1px; margin-top:8px">${campground.title}</p></strong>
                <p style="margin-bottom: 1px;">${campground.location}</p>`
            )
    )
    .addTo(map)


// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(),);
