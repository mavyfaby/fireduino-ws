import type { Device, SessionType } from "../types";

/**
 * This class is used to store connected fireduino uids
 */
export class Session {
  private static devices: Device[] = [];
  private static mobileInstance: Session;
  private static fireduinoInstance: Session;
  private type: SessionType;

  private constructor(type: SessionType) {
    this.type = type;
  }

  /**
   * Get session instance
   */
  public static getInstance(type: SessionType): Session {

    // If type is mobile
    if (type === "mobile") {
      // Check if instance is not created
      if (!Session.mobileInstance) {
        // Create instance
        Session.mobileInstance = new Session("mobile");
      }
    }

    // If type is fireduino
    if (type === "fireduino") {
      // Check if instance is not created
      if (!Session.fireduinoInstance) {
        // Create instance
        Session.fireduinoInstance = new Session("fireduino");
      }
    }

    // Return instance
    return type === "mobile" ? Session.mobileInstance : Session.fireduinoInstance;
  }

  /**
   * Add uid to session
   */
  public add(socketId: string, uid: string): boolean {
    // Check if uid is not already added
    if (!this.has(uid)) {
      // Add uid
      Session.devices.push({ type: this.type, socketId, uid });
      // Return true
      return true;
    }

    // Return false
    return false;
  }

  /**
   * Remove uid from session
   */
  public remove(uid: string): boolean {
    // Check if uid is added
    if (this.has(uid)) {
      // Remove uid
      Session.devices = Session.devices.filter((device) => device.type === this.type && device.uid !== uid);
      // Return true
      return true;
    }

    // Return false
    return false;
  }

  /**
   * Get socket id from uid
   */
  public getUid(socketId: string): string | null {
    // Get uid
    const device = Session.devices.find((device) => device.type === this.type && device.socketId === socketId);

    // Check if device is found
    if (device) {
      // Return uid
      return device.uid;
    }

    // Return null
    return null;
  }

  /**
   * Check if uid is in session
   */
  public has(uid: string): boolean {
    // Check if uid is added
    return Session.devices.some((device) => device.type === this.type && device.uid === uid);
  }
}