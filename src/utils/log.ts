import { date } from "./date";

/**
 * Log message
 */
function log(isError: boolean, ...args: string[]) {
  console.log("[" + (isError ? "-" : "+") + "] " + date(), ...args);
}

/**
 * Log object
 */
export const Log = {
  // Log success
  s(...args: string[]) {
    log(false, ...args);
  },

  // Log error
  e(...args: string[]) {
    log(true, ...args);
  }
};