import type { Fireduino, Mobile, Establishment, Device } from "../types";

/**
 * This class is used to store connected fireduino uids
 * @author Maverick G. Fabroa (mavyfaby)
 */
export class Session<T extends Device> {
  private devices: Map<number, T[]> = new Map();

  public constructor() {
    // Do nothing
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
    if (!this.has(estb, device)) {
      // Add device
      this.devices.set(estb.id!, [ ...this.devices.get(estb.id!)!, device ]);
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
    if (this.has(estb, device)) {
      // Remove device
      this.devices.set(estb.id!, this.devices.get(estb.id!)!.filter((d) => d !== device));
      // Return true
      return true;
    }

    // Return false
    return false;
  }

  /**
   * Get socket id from uid
   * @param estb Establishment
   * @param sid Socket ID
   */
  public getUid(estb: Establishment, sid: string): string | null {
    // Get device by sid
    const device = this.devices.get(estb.id!)!.find((device) => device.sid === sid);

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
   * Check if uid is in session
   * @param estb Establishment
   * @param mac MAC Address
   */
  public has(estb: Establishment, device: T): boolean {
    // If estb.id is null
    if (!estb.id) return false;
    // If has no devices
    if (!this.devices.has(estb.id)) return false;
    // Return if device is in session
    return this.devices.get(estb.id)!.some((d) => d.sid === device.sid);
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