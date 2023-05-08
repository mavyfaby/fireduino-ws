import { io } from "socket.io-client";
import prompt from "prompt-sync";

// Remove first two arguments
process.argv.splice(0, 2);
// Check if we are in development mode
const isDev = process.argv.length > 0 && process.argv[0] === "--dev";
// Get endpoint
const endpoint = isDev ? "http://localhost:5000" : "https://fireduino-ws.onrender.com";
// Get establishment id
const estb = prompt()(">> Enter establishment id: ");
// Get MAC Address
const uid = prompt()(">> Enter MAC Address: ");

// Create socket.io client
const socket = io(endpoint + "/estb" + estb);

// Listen for "connect" event
socket.on("connect", () => {
    console.log("[+] Connected to server");
    socket.emit("fireduino", uid);
});

// Listen for "disconnect" event
socket.on("disconnect", () => {
    console.log("[-] Disconnected from server");
});

socket.on("connect_error", (err) => {
    console.log("[-] Connection error: " + err.message);
});

// Show message
console.log("[+] Connecting to server...");