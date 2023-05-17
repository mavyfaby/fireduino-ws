import { Server } from "socket.io";
import { Session } from "./network/session";
import { fetchEstablishments } from "./network/request";
import { Fireduino, Mobile } from "./types";
import { Log } from "./utils";

// Create a socket.io server
const io = new Server();
// Set port
const port = process.env.PORT || 5000;
// Create session for fireduino
const session = new Session<Fireduino>();
// Create session for mobile
const mobileSession = new Session<Mobile>();
// Create session for fresh fireduinos
let exos = <Fireduino[]>[];

// Log fetch
Log.s("Fetching establishments...");

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
        Log.s("Mobile connected:", platform);
        // Add platform to session
        mobileSession.add(estb, { sid: socket.id, platform });
      });

      // Listen for "fireduino" event
      socket.on("fireduino", (mac) => {
        // Log connection
        Log.s("Fireduino connected:", mac);
        // Add uid to session
        if (session.add(estb, { sid: socket.id, mac })) {
          // Emit "fireduino_connect" event to the establishment
          nsp.emit("fireduino_connect", session.getDevices(estb));
        }
      });

      // Listen for event
      socket.on("fireduino_check", (mac) => {
        // Emit "fireduino_check" event
        socket.emit("fireduino_check", session.hasUID(estb, mac));
      });

      // Listen for event
      socket.on("exoduino_check", (mac) => {
        // Emit "exoduino_check" event
        socket.emit("exoduino_check", exos.some((exo) => exo.mac === mac));
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
          Log.e("Mobile disconnected: " + platform);
          // Remove platform from session
          mobileSession.remove(estb, { sid: socket.id, platform });
          // Return
          return;
        }

        // Fireduino disconnected
        if (mac !== null && platform === null) {
          // Log disconnection
          Log.e("Fireduino disconnected:", mac);
          // Remove uid from session
          if (session.remove(estb, { sid: socket.id, mac })) {
            // Emit "fireduino_disconnect" event to the establishment
            nsp.emit("fireduino_disconnect", session.getDevices(estb));
          }

          // Return
          return;
        }

        // Log disconnection
        Log.e("Namespace Unknown disconnected:", socket.id);
        // Return
        return;
      });

      // Listen for event
      socket.on("get_online_fireduinos", () => {
        // Return online fireduinos
        socket.emit("get_online_fireduinos", session.getDevices(estb));
      });

      // Listen for event
      socket.on("get_exoduinos", () => {
        // Return exoduinos
        socket.emit("get_exoduinos", exos);
      });
    });
  }

  // Global socket connection
  io.on("connection", (socket) => {
    // Exoduino connects
    socket.on("fireduino", mac => {
      // Add exoduino to session
      exos.push({ sid: socket.id, mac });
      // Log connection
      Log.s("Exoduino connected:", mac);
    });

    // Call when an exoduino disconnects
    socket.on("disconnect", () => {
      // Declare MAC
      let mac = null;

      // Remove disconnected exoduino in the session
      for (let i = 0; i < exos.length; i++) {
        if (exos[i].sid === socket.id) {
          mac = exos[i].mac;
          exos.splice(i, 1);
          break;
        }
      }

      // Log disconnection
      if (mac !== null) {
        Log.e("Exoduino disconnected:", mac);
        return;
      }

      // Log disconnection
      Log.e("Unknown disconnected:", socket.id);
    });
  });

  // Listen for connections
  io.listen(Number(port));
  // Show a message
  Log.s(`Fireduino Websocket Server is listening on port ${port}`);
});
