const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Handle socket.io connections
io.on("connection", function(socket) {
    socket.on("send-location", function(data){
        io.emit("receive-location", {id:socket.id, ...data}); // Broadcast the received location to all connected clients
        console.log("Received location from user:", {id:socket.id, ...data});
    })
    console.log("A user connected");

    // Example of handling disconnection
    socket.on("disconnect", () => {
        io.emit("disconnected", {id:socket.id});
        console.log("A user disconnected");
    });
});

// Handle GET request for the root route
app.get('/', function(req, res) {
    res.render("index");
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
