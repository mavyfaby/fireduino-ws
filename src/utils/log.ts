import { date } from "./date";

/**
 * Log message
 */
function log(message: string, isError: boolean) {
  console.log("[" + (isError ? "-" : "+") + "] " + date() + " " + message);
}

/**
 * Log object
 */
export const Log = {
  // Log success
  s(message: string) {
    log(message, false);
  },

  // Log error
  e(message: string) {
    log(message, true);
  }
};