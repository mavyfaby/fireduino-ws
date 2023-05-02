import { SessionEvent } from "../classes/event";
import type { Device, SessionType } from "../types";

/**
 * This class is used to store connected fireduino uids
 */
export class Session extends SessionEvent {
  private static devices: Device[] = [];
  private static mobileInstance: Session;
  private static fireduinoInstance: Session;
  private type: SessionType;

  private constructor(type: SessionType) {
    super();
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
   * Get all devices
   */
  public getDevices(): Device[] {
    // Return devices
    return Session.devices.filter((device) => device.type === this.type);
  }

  /**
   * Add uid to session
   */
  public add(socketId: string, uid: string): boolean {
    // Check if uid is not already added
    if (!this.has(uid)) {
      // Add uid
      Session.devices.push({ type: this.type, socketId, uid });
      // Emit add event
      this.emit("fireduino_connect");
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
      // Emit remove event
      this.emit("fireduino_disconnect");
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
    // if device id is found, return it else return null
    return device ? device.uid : null;
  }

  /**
   * Check if uid is in session
   */
  public has(uid: string): boolean {
    // Check if uid is added
    return Session.devices.some((device) => device.type === this.type && device.uid === uid);
  }
}