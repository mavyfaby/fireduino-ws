import { io } from "socket.io-client";
import prompt from "prompt-sync";

import { Log } from "../src/utils";

// Remove first two arguments
process.argv.splice(0, 2);
// Check if we are in development mode
const isDev = process.argv.length > 0 && process.argv[0] === "--dev";
// Get endpoint
const endpoint = isDev ? "http://localhost:5000" : "https://fireduino-ws.azurewebsites.net";
// Get establishment id
const estb = prompt()(">> Enter establishment id: ");
// Get MAC Address
const uid = prompt()(">> Enter MAC Address: ");
// Print line
console.log("---------------------------");

// Create socket.io client
const socket = io(endpoint + "/estb" + estb);

// Listen for "connect" event
socket.on("connect", () => {
    Log.s("Connected to server");
    socket.emit("fireduino", uid);
});

// Listen for "disconnect" event
socket.on("disconnect", () => {
    Log.e("Disconnected from server");
});

socket.on("connect_error", (err) => {
    Log.e("Connection error: " + err.message);
});

// Show message
Log.s("Connecting to server...");