export type Device = {
    type: SessionType;
    socketId: string;
    uid: string;
}

export type SessionType = "mobile" | "fireduino";