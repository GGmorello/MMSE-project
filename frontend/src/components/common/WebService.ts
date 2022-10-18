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
    FinancialRequest,
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

    async submitFinancialRequest(
        taskId: string,
        requestor: Role,
        request: string,
    ): Promise<Response<FinancialRequest>> {
        return await this.instance
            .put<FinancialRequest>("event/request", { taskId, requestor, request })
            .then((res: AxiosResponse<FinancialRequest>) => {
                const resp: SuccessResponse<FinancialRequest> = {
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
                            taskRequest: {
                                taskId: "123",
                                subteam: Subteam.CHEFS,
                                role: Role.TOP_CHEF,
                                request: "please give us more money",
                            },
                        },
                        {
                            id: "456",
                            eventId: "mock event",
                            subteamId: Subteam.AUDIO_SPECIALIST,
                            taskId: 2,
                            description: "audio specialist task",
                            taskRequest: {
                                taskId: "456",
                                subteam: Subteam.AUDIO_SPECIALIST,
                                role: Role.AUDIO_SPECIALIST,
                                request: "too many lights bro",
                            },
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
