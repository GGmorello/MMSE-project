import axios, { Axios, AxiosResponse } from "axios";

import {
    Response,
    SuccessResponse,
    ResponseType,
    ErrorResponse,
    User,
    Event,
    EventBase,
    TaskApplicationBase,
    TaskApplication,
    TaskBase,
    Role,
    FinancialRequest,
    HiringRequest,
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

    async fetchHiringRequests(): Promise<Response<HiringRequest[]>> {
        return await this.instance
            .get<HiringRequest[]>("user/hire")
            .then((res: AxiosResponse<HiringRequest[]>) => {
                const resp: SuccessResponse<HiringRequest[]> = {
                    type: ResponseType.SUCCESSFUL,
                    data: res.data,
                };
                return resp;
            })
            .catch(this.createDefaultErrorResponse);
    }

    async fetchFinancialRequests(): Promise<Response<FinancialRequest[]>> {
        return await this.instance
            .get<FinancialRequest[]>("event/requests")
            .then((res: AxiosResponse<FinancialRequest[]>) => {
                const resp: SuccessResponse<FinancialRequest[]> = {
                    type: ResponseType.SUCCESSFUL,
                    data: res.data,
                };
                return resp;
            })
            .catch(this.createDefaultErrorResponse);
    }

    async updateFinancialRequestStatus(id: string, approved: boolean): Promise<Response<FinancialRequest>> {
        return await this.instance
            .put<FinancialRequest>("event/request/approve", { id, approved })
            .then((res: AxiosResponse<FinancialRequest>) => {
                const resp: SuccessResponse<FinancialRequest> = {
                    type: ResponseType.SUCCESSFUL,
                    data: res.data,
                };
                return resp;
            })
            .catch(this.createDefaultErrorResponse);
    }

    async updateHiringRequestStatus(id: string, approved: boolean): Promise<Response<HiringRequest>> {
        return await this.instance
            .put<HiringRequest>("user/hire/approve", { id, approved })
            .then((res: AxiosResponse<HiringRequest>) => {
                const resp: SuccessResponse<HiringRequest> = {
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

    async createTaskApplication(
        application: TaskApplicationBase,
    ): Promise<Response<TaskApplication>> {
        // TODO: Integrate with backend
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                const res: SuccessResponse<TaskApplication> = {
                    type: ResponseType.SUCCESSFUL,
                    data: {
                        ...application,
                        id: "temp-id",
                        tasks: application.tasks.map(
                            (t: TaskBase, i: number) => ({
                                ...t,
                                id: `task-${i}`,
                            }),
                        ),
                    },
                };
                resolve(res);
            }, 3000);
        });
        // return await this.instance
        //     .post<TaskApplication>("event/application", application)
        //     .then((res: AxiosResponse<TaskApplication>) => {
        //         const resp: SuccessResponse<TaskApplication> = {
        //             type: ResponseType.SUCCESSFUL,
        //             data: res.data,
        //         };
        //         return resp;
        //     })
        //     .catch(this.createDefaultErrorResponse);
    }

    async submitHiringRequest(requestor: Role, requestedRole: Role, comment: string): Promise<Response<HiringRequest>> {
        return await this.instance
            .post<HiringRequest>("user/hire", { requestor, requestedRole, comment })
            .then((res: AxiosResponse<HiringRequest>) => {
                const resp: SuccessResponse<HiringRequest> = {
                    type: ResponseType.SUCCESSFUL,
                    data: res.data,
                };
                return resp;
            })
            .catch(this.createDefaultErrorResponse);
    }

    private createDefaultErrorResponse(
        error: AxiosResponse<any>,
    ): ErrorResponse {
        return { type: ResponseType.ERROR, message: error.statusText };
    }
}

export default WebService;
