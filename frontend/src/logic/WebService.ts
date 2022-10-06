import axios, { Axios, AxiosResponse } from "axios";

import { Response, SuccessResponse, ResponseType, ErrorResponse } from "model";

class WebService {
    private readonly instance: Axios;

    constructor(baseUrl: string, token?: string) {
        this.instance = axios.create({
            baseURL: baseUrl,
            headers: {
                Authorization: token,
            },
        });
    }

    async login(username: string, password: string): Promise<Response<Object>> {
        // TODO: Remove mock API call
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                const response: SuccessResponse<Object> = {
                    type: ResponseType.SUCCESSFUL,
                    data: { name: "hello", surname: "world" },
                };
                resolve(response);
            }, 3000);
        });
        // return await this.instance
        //     .post("/v1/user/authenticate", {
        //         username,
        //         password,
        //     })
        //     .then((res: AxiosResponse<Object>) => {
        //         const resp: SuccesResponse<Object> = {
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
