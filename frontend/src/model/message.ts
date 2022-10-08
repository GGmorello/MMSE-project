export enum MessageType {
    ERROR = "ERROR",
    INFO = "INFO",
    SUCCESS = "SUCCESS",
}

export interface Message {
    type: MessageType;
    message: string;
}
