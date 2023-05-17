import type { Fireduino, Mobile, Establishment, Device } from "../types";

/**
 * This class is used to store connected fireduino uids
 * @author Maverick G. Fabroa (mavyfaby)
 */
export class Session<T extends Device> {
  private devices: Map<number, T[]>;

  public constructor() {
    this.devices = new Map();
  }

  /**
   * Get all devices
   * @param estb Establishment
   */
  public getDevices(estb: Establishment): T[] {
    // If estb.id is null
    if (!estb.id) return [];
    // If has no devices
    if (!this.devices.has(estb.id)) return [];
    // If empty
    if (this.devices.get(estb.id)!.length === 0) return [];
    // Return devices of the establishment
    return this.devices.get(estb.id)!;
  }

  /**
   * Add uid to session
   * @param estb Establishment
   * @param device T
   */
  public add(estb: Establishment, device: T): boolean {
    // Check if uid is not already added
    if (!this.hasSocketID(estb, device.sid)) {
      // Devices
      const devices = this.devices.get(estb.id!) || [];
      // Add device 
      this.devices.set(estb.id!, [ ...devices, device ]);
      // Return true
      return true;
    }

    // Return false
    return false;
  }

  /**
   * Remove uid from session
   */
  public remove(estb: Establishment, device: T): boolean {
    // Check if uid is added
    if (this.hasSocketID(estb, device.sid)) {
      // Devices
      const devices = this.devices.get(estb.id!) || [];
      // Remove device
      this.devices.set(estb.id!, devices.filter((d) => d.sid !== device.sid));
      // Return true
      return true;
    }

    // Return false
    return false;
  }

  /**
   * Get unique id from establsihment and socket id
   * @param estb Establishment
   * @param sid Socket ID
   */
  public getUid(estb: Establishment, sid: string): string | null {
    // Devices
    const devices = this.devices.get(estb.id!) || [];
    // Get device by sid
    const device = devices.find((device) => device.sid === sid);

    // If device is null
    if (!device) return null;

    // If fireduino?
    if (this.isFireduino(device)) {
      // Return mac
      return device.mac;
    }

    // If mobile?
    if (this.isMobile(device)) {
      // Return platform
      return device.platform;
    }

    // Return null
    return null;
  } 

  /**
   * Check if socket id is in session
   * @param estb Establishment
   * @param sid Socket ID
   */
  public hasSocketID(estb: Establishment, sid: string): boolean {
    // If estb.id is null
    if (!estb.id) return false;
    // If has no devices
    if (!this.devices.has(estb.id)) return false;
    // Devices
    const devices = this.devices.get(estb.id) || [];
    // Return if device is in session
    return devices.some((d) => d.sid === sid);
  }

  /**
   * Check if uid is in session
   * @param estb Establishment
   * @param uid The Unique ID
   */
  public hasUID(estb: Establishment, uid: string): boolean {
    // If estb.id is null
    if (!estb.id) return false;
    // If has no devices
    if (!this.devices.has(estb.id)) return false;
    // Devices
    const devices = this.devices.get(estb.id) || [];
    // Return if device is in session
    return devices.some((d) => this.getUid(estb, d.sid) === uid);
  }

  /**
   * Check if device is a Fireduino
   * @param device 
   */
  private isFireduino(device: any): device is Fireduino {
    return device.mac !== undefined;
  }
  
  /**
   * Check if device is a Mobile
   */
  private isMobile(device: any): device is Mobile {
    return device.platform !== undefined;
  }
}