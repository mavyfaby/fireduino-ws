import { Server } from "socket.io";

// Create a socket.io server
const io = new Server(3000);
// Set port
const port = process.env.PORT || 5000;

// Listen for connections
io.on("connection", (socket) => {
    // Log new connection
    console.log("New connection!", socket.id);
});

// Listen for connections
io.listen(Number(port));
// Show a message
console.log(`Fireduino Websocket Server is listening on port ${port}`);

