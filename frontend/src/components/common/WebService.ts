import axios, { Axios, AxiosResponse } from "axios";

import {
    Response,
    SuccessResponse,
    ResponseType,
    ErrorResponse,
    User,
    Event,
    EventBase,
    Task,
    Subteam,
    Role,
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

    async fetchEvents(): Promise<Response<Event[]>> {
        return await this.instance
            .get<Event[]>("event")
            .then((res: AxiosResponse<Event[]>) => {
                const resp: SuccessResponse<Event[]> = {
                    type: ResponseType.SUCCESSFUL,
                    data: res.data,
                };
                return resp;
            })
            .catch(this.createDefaultErrorResponse);
    }

    async submitTaskRequest(taskId: string, subteam: Subteam | null, role: Role, request: string): Promise<Response<any>> {
        return await new Promise((resolve) => {
            setTimeout(() => {
                const data: { [key: string]: any } = {
                    taskId,
                    subteam,
                    role,
                    request,
                };
                const mockResponse: Response<any> = {
                    type: ResponseType.SUCCESSFUL,
                    data,
                };
                resolve(mockResponse);
            }, 3000);
        });
    }

    async createEvent(event: EventBase): Promise<Response<Event>> {
        const params: { [key: string]: any } = {
            clientId: event.clientId,
            startDate: event.startDate,
            endDate: event.endDate,
            eventRequestItems: event.eventRequestItems,
        };
        return await this.instance
            .post<Event>("event/create", params)
            .then((res: AxiosResponse<Event>) => {
                const resp: SuccessResponse<Event> = {
                    type: ResponseType.SUCCESSFUL,
                    data: res.data,
                };
                return resp;
            })
            .catch(this.createDefaultErrorResponse);
    }

    async updateEventStatus(
        id: string,
        approved: boolean,
        reviewNotes: string | null,
    ): Promise<Response<Event>> {
        return await this.instance
            .put<Event>("event/approve", { id, approved, reviewNotes })
            .then((res: AxiosResponse<Event>) => {
                const resp: SuccessResponse<Event> = {
                    type: ResponseType.SUCCESSFUL,
                    data: res.data,
                };
                return resp;
            })
            .catch(this.createDefaultErrorResponse);
    }

    async fetchTasks(): Promise<Response<Task[]>> {
        return await new Promise((resolve) => {
            setTimeout(() => {
                const mockResponse: Response<Task[]> = {
                    type: ResponseType.SUCCESSFUL,
                    data: [
                        {
                            id: "123",
                            eventId: "mock event",
                            subteamId: Subteam.CHEFS,
                            taskId: 1,
                            description: "chef task",
                        },
                        {
                            id: "456",
                            eventId: "mock event",
                            subteamId: Subteam.AUDIO_SPECIALIST,
                            taskId: 2,
                            description: "audio specialist task",
                        },
                    ],
                };
                resolve(mockResponse);
            }, 3000);
        });
        // return await this.instance
        //     .get<Task[]>("event/tasks")
        //     .then((res: AxiosResponse<Task[]>) => {
        //         const resp: SuccessResponse<Task[]> = {
        //             type: ResponseType.SUCCESSFUL,
        //             data: res.data,
        //         };
        //         return resp;
        //     })
        //     .catch(this.createDefaultErrorResponse);
    }

    private createDefaultErrorResponse(
        error: AxiosResponse<any>,
    ): ErrorResponse {
        return { type: ResponseType.ERROR, message: error.statusText };
    }
}

export default WebService;
