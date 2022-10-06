export enum ResponseType {
    SUCCESSFUL = "SUCCESSFUL",
    ERROR = "ERROR",
}

export interface SuccessResponse<T> {
    type: ResponseType.SUCCESSFUL;
    data: T;
}

export interface ErrorResponse {
    type: ResponseType.ERROR;
    message: string;
}

export type Response<T> = SuccessResponse<T> | ErrorResponse;
