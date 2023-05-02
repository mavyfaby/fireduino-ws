export type SessionType = "mobile" | "fireduino";

export type Device = {
  type: SessionType;
  socketId: string;
  uid: string;
}

export type Establishment = {
  id?: number;
  name?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
  inviteKey?: string;
  createdAt?: string;
}