import { Server } from "socket.io";
import { Session } from "./network/session";
import { fetchEstablishments } from "./network/request";

// Create a socket.io server
const io = new Server(3000);
// Set port
const port = process.env.PORT || 5000;
// Create session for fireduino
const session = Session.getInstance("fireduino");
// Create session for mobile
const mobileSession = Session.getInstance("mobile");

// Log fetch
console.log("[+] Fetching establishments...");

// Fetch establishments for socket namespacing
fetchEstablishments((establishments) => {
  // For each establishment
  for (const estb of establishments) {
    // Create a namespace for each establishment
    const nsp = io.of(`/estb${estb.id}`);

    // Listen for connections
    nsp.on("connection", (socket) => {
      // Listen for "mobile" event
      socket.on("mobile", (platform) => {
        // Log connection
        console.log("[+] Mobile connected:", platform);
        // Add platform to session
        mobileSession.add(socket.id, platform);
      });

      // Listen for "fireduino" event
      socket.on("fireduino", (uid) => {
        // Log connection
        console.log("[+] Fireduino connected:", uid);
        // Add uid to session
        session.add(socket.id, uid);
      });

      // Listen for "fireduino_chk" event
      socket.on("fireduino-check", (uid) => {
        // Emit "fireduino_check" event
        socket.emit("fireduino-check", session.has(uid));
      });

      // Listen for "disconnect" event
      socket.on("disconnect", () => {
        // Get uid
        const uid = session.getUid(socket.id);
        // Get platform
        const platform = mobileSession.getUid(socket.id);

        // Mobile disconnected
        if (uid === null && platform !== null) {
          // Log disconnection
          console.log("[-] Mobile disconnected:", platform);
          // Remove platform from session
          mobileSession.remove(platform);
          // Return
          return;
        }

        // Fireduino disconnected
        if (uid !== null && platform === null) {
          // Log disconnection
          console.log("[-] Fireduino disconnected:", uid);
          // Remove uid from session
          session.remove(uid);
          // Return
          return;
        }

        // Log disconnection
        console.log("[-] Unknown disconnected:", socket.id);
        // Return
        return;
      });

      // Listen for add event
      session.subscribe("fireduino_connect", () => {
        // Emit "fireduino_connect" event to the establishment
        nsp.emit("fireduino_connect", session.getDevices());
      });

      // Listen for remove event
      session.subscribe("fireduino_disconnect", () => {
        // Emit "fireduino_disconnect" event to the establishment
        nsp.emit("fireduino_disconnect", session.getDevices());
      });
    });
  }

  // Listen for connections
  io.listen(Number(port));
  // Show a message
  console.log(`[+] Fireduino Websocket Server is listening on port ${port}`);
});
