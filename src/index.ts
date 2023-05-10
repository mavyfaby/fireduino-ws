import { Server } from "socket.io";
import { Session } from "./network/session";
import { fetchEstablishments } from "./network/request";
import { Fireduino, Mobile } from "./types";

// Create a socket.io server
const io = new Server(3000);
// Set port
const port = process.env.PORT || 5000;
// Create session for fireduino
const session = new Session<Fireduino>();
// Create session for mobile
const mobileSession = new Session<Mobile>();

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
      socket.on("mobile", (platform: string) => {
        // Log connection
        console.log("[+] Mobile connected:", platform);
        // Add platform to session
        mobileSession.add(estb, { sid: socket.id, platform });
      });

      // Listen for "fireduino" event
      socket.on("fireduino", (mac) => {
        // Log connection
        console.log("[+] Fireduino connected:", mac);
        // Add uid to session
        if (session.add(estb, { sid: socket.id, mac })) {
          // Emit "fireduino_connect" event to the establishment
          nsp.emit("fireduino_connect", session.getDevices(estb));
        }
      });

      // Listen for "fireduino_chk" event
      socket.on("fireduino_check", (uid) => {
        // Emit "fireduino_check" event
        socket.emit("fireduino_check", session.has(estb, uid));
      });

      // Listen for "disconnect" event
      socket.on("disconnect", () => {
        // Get mac
        const mac = session.getUid(estb, socket.id);
        // Get platform
        const platform = mobileSession.getUid(estb, socket.id);

        // Mobile disconnected
        if (mac === null && platform !== null) {
          // Log disconnection
          console.log("[-] Mobile disconnected:", platform);
          // Remove platform from session
          mobileSession.remove(estb, { sid: socket.id, platform });
          // Return
          return;
        }

        // Fireduino disconnected
        if (mac !== null && platform === null) {
          // Log disconnection
          console.log("[-] Fireduino disconnected:", mac);
          // Remove uid from session
          if (session.remove(estb, { sid: socket.id, mac })) {
            // Emit "fireduino_disconnect" event to the establishment
            nsp.emit("fireduino_disconnect", session.getDevices(estb));
          }

          // Return
          return;
        }

        // Log disconnection
        console.log("[-] Unknown disconnected:", socket.id);
        // Return
        return;
      });

      // Listen for "get_online_fireduinos" event
      socket.on("get_online_fireduinos", () => {
        // Emit "get_online_fireduinos" event
        socket.emit("get_online_fireduinos", session.getDevices(estb));
      });
    });
  }

  // Listen for connections
  io.listen(Number(port));
  // Show a message
  console.log(`[+] Fireduino Websocket Server is listening on port ${port}`);
});
