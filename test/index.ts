import { io } from "socket.io-client";

// Check if we are in development mode
const isDev = process.argv.length > 2 && process.argv[2] === "--dev";
// Create socket.io client
const socket = io(isDev ? "http://localhost:5000" : "https://fireduino-ws.azurewebsites.net");

const data = {
    "device_id": 1,
    "data": [
        1, 2, 3, 4, 5
    ]
};

// Listen for "connect" event
socket.on("connect", () => {
    console.log("Connected to server");

    socket.emit("data", data);
});

// Listen for "disconnect" event
socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

// Show message
console.log("Connecting to server...");