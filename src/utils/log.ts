import { date } from "./date";

/**
 * Log message
 */
function log(isError: boolean, ...args: string[]) {
  console.log("[" + (isError ? "-" : "+") + "] " + date(), ...args);
}

/**
 * Listen for key press
 * @param callback 
 */
export function keyListen(callback: (key: string) => void) {
  // Get stdin
  const stdin = process.stdin;
  stdin.setRawMode( true );

  stdin.resume();
  stdin.setEncoding( 'utf8' );

  // on any data into stdin
  stdin.on('data', function(key) {
    // ctrl-c ( end of text )
    if (key.toString() === '\u0003') {
      process.exit();
    }

    callback(key.toString());
  });
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