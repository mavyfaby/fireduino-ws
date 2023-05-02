import { Device } from "../types";

export class SessionEvent {
  // List of events
  private events = new Map<string, Function>();

  /**
   * Subscribe to session events
   */
  public subscribe(name: string, callback: () => void): void {
    // Add event
    this.events.set(name, callback);
  }

  /**
   * Unsubscribe from session events
   */
  public unsubscribe(name: string): void {
    // Remove event
    this.events.delete(name);
  }

  /**
   * Emit session event
   */
  public emit(name: string, ...args: any[]): void {
    // Get event
    const event = this.events.get(name);

    // Check if event exists
    if (typeof event === "function") {
      // Call event
      event(...args);
    }
  }
}