const socket = io();

// Check if geolocation is available
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 50000,
            maximumAge: 0,
        }
    );
}

// Initialize the map
const map = L.map("map").setView([0, 0], 10);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Swaranjit",
}).addTo(map);

// Keep track of markers for connected users
const markers = {};

// Listen for location updates from the server
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // Set the map's view to the new location
    map.setView([latitude, longitude],);

    // Update marker for the user or create a new one
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Handle user disconnection
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
