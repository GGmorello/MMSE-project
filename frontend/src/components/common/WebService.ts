import axios, { Axios, AxiosResponse } from "axios";

import {
    Response,
    SuccessResponse,
    ResponseType,
    ErrorResponse,
    User,
    Event,
    EventBase,
} from "model";

const APP_BASE_URL = "http://localhost:5000/";

class WebService {
    private readonly instance: Axios;

    constructor(token?: string) {
        this.instance = axios.create({
            baseURL: APP_BASE_URL,
            headers: {
                Authorization: token,
            },
        });
    }

    async login(username: string, password: string): Promise<Response<User>> {
        return await this.instance
            .post("auth/login", {
                username,
                password,
            })
            .then((res: AxiosResponse<User>) => {
                const resp: SuccessResponse<User> = {
                    type: ResponseType.SUCCESSFUL,
                    data: res.data,
                };
                return resp;
            })
            .catch(this.createDefaultErrorResponse);
    }

    async createEvent(event: EventBase): Promise<Response<Event>> {
        return await this.instance.post<Event>(
            "event/create", {
                clientId: event.clientId,
                startDate: event.startDate,
                endDate: event.endDate,
                eventRequestItems: event.eventRequestItems,
            }).then((res: AxiosResponse<Event>) => {
            const resp: SuccessResponse<Event> = {
                type: ResponseType.SUCCESSFUL,
                data: res.data,
            };
            return resp;
        }).catch(this.createDefaultErrorResponse);
    }

    private createDefaultErrorResponse(
        error: AxiosResponse<any>,
    ): ErrorResponse {
        return { type: ResponseType.ERROR, message: error.statusText };
    }
}

export default WebService;
