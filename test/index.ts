import { io } from "socket.io-client";
import prompt from "prompt-sync";

import { Log, keyListen } from "../src/utils";

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
const socket = io(endpoint + (estb === '-' ? '' : "/estb" + estb));

// Listen for "connect" event
socket.on("connect", () => {
    Log.s("Connected to server");
    socket.emit("fireduino", uid);
});

/**
 * When the server emits this event,
 * it means that the fireduino has been added to the establishment.
 * 
 * 1. Save the establishment id to the fireduino
 * 2. Restart the fireduino socket server to apply changes
 */
socket.on("add_fireduino", estbID => {
    Log.s("Adding fireduino to establishment: ", estbID);
});

// Listen for "fireduino_extinguish" event
socket.on("fireduino_extinguish", (willExtinguish) => {
    Log.s("Extinguishing fire: ", willExtinguish);
});

// Listen for "disconnect" event
socket.on("disconnect", () => {
    Log.e("Disconnected from server");
});

socket.on("connect_error", (err) => {
    Log.e("Connection error: " + err.message);
});

keyListen((key) => {
    if (key === " ") {
        console.log("Fire detected");
        socket.emit("fire_detected");
    } 

    if (key === "1") {
        console.log("Smoke detected");
        socket.emit("smoke_detected");
    } 
});

// Show message
Log.s("Connecting to server...");