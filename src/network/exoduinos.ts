import type { Fireduino } from "../types";

/**
 * Class for managing exoduinos
 */
class Exoduinos {
  private list: Array<Fireduino>;

  constructor() {
    this.list = [];
  }

  /**
   * Add a fireduino to the list
   * @param fireduino Fireduino to add
   */
  public add(fireduino: Fireduino) {
    this.list.push(fireduino);
  }

  /**
   * Remove an exoduino from the list
   * @param sid The socket id
   */
  public remove(sid: string): string | null {
    // Declare mac
    let mac = null;

    // Iterate through the list
    for (let i = 0; i < this.list.length; i++) {
      // Check if the socket id matches
      if (this.list[i].sid === sid) {
        // Get mac
        mac = this.list[i].mac;
        // Remove from list
        this.list.splice(i, 1);
        // Break
        break;
      }
    }

    // Return mac
    return mac;
  }

  /**
   * Get the socket id based on the mac address
   */
  public getSocketID(mac: string) {
    // Iterate through the list
    for (let i = 0; i < this.list.length; i++) {
      // Check if the mac address matches
      if (this.list[i].mac === mac) {
        // Return socket id
        return this.list[i].sid;
      }
    }

    // Return null
    return "";
  }

  /**
   * Get all exoduinos
   */
  public getAll() {
    return this.list;
  }
}

export { Exoduinos };