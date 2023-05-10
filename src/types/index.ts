export type Device = {
  sid: string;
}

export type Fireduino = Device & {
  mac: string;
}

export type Mobile = Device & {
  platform: string;
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