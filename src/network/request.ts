import { WebServerAPI } from "../config";
import { Establishment } from "../types";
import axios from "axios";

/**
 * Fetch establishments from the server
 */
export function fetchEstablishments(callback: (estb: Establishment[]) => void) {
  // Fetch establishments
  axios.get(WebServerAPI + "/establishments").then((response) => {
    // If response 
    if (response.status === 200) {
      // Log success
      console.log("[+] Establishments fetched");
      // Create empty array
      const estbs: Establishment[] = [];

      // For each establishment
      for (const estb of response.data.data) {
        estbs.push({
          id: estb.a,
          inviteKey: estb.b,
          name: estb.c,
          phone: estb.d,
          address: estb.e,
          latitude: estb.f,
          longitude: estb.g,
          createdAt: estb.h,
        });
      }

      // Call callback
      callback(estbs);
      return;
    }

    // Log error
    console.log("[-] Failed to fetch establishments: " + response.status);
    console.log("[-] Stopping...");
  });
}