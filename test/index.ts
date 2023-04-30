import { io } from "socket.io-client";

// Remove first two arguments
process.argv.splice(0, 2);
// Check if we are in development mode
const isDev = process.argv.length > 0 && process.argv[0] === "--dev";
// Get endpoint
const endpoint = isDev ? "http://localhost:5000" : "https://fireduino-ws.azurewebsites.net";
// Get dummy device id
const uid = process.argv.length > 1 ? process.argv[1] : "1234567890";

// Create socket.io client
const socket = io(endpoint);

// Listen for "connect" event
socket.on("connect", () => {
    console.log("Connected to server");

    socket.emit("fireduino", uid);
});

// Listen for "disconnect" event
socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

// Show message
console.log("Connecting to server...");