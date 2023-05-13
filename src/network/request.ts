import { WebServerAPI } from "../config";
import { Establishment } from "../types";
import { Log } from "../utils";
import axios from "axios";

/**
 * Fetch establishments from the server
 */
export function fetchEstablishments(callback: (estb: Establishment[]) => void) {
  // Fetch establishments
  axios.get(WebServerAPI + "/establishments").then(({ status, data }) => {
    // If response 
    if (status === 200) {
      // Log success
      Log.s("Establishments fetched");
      // Create empty array
      const estbs: Establishment[] = [];

      // For each establishment
      for (const estb of data.data) {
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
    Log.e("Error " + status + ": Failed to fetch establishments.");
    Log.e("Stopping...");
  });
}