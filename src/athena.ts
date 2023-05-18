import axios from "axios";

export class Athena {
    private readonly baseUrl: string;
    private readonly globalExcept: (reason: any) => void;

    constructor(baseUrl: string, globalExcept: (reason: any) => void = () => {}) {
        this.baseUrl = baseUrl;
        this.globalExcept = globalExcept;
    }

    public getEndpoint(ep: string): string {
        return this.baseUrl + "/" + ep;
    }

    public get(ep: string, pathVariables: string[] = [], handler: (status: number, message: string) => void, except?: (reason: any) => void): Promise<void> {
        return axios.get(this.getEndpoint(ep) + "/" + pathVariables.join("/")).then((r) => {
            handler(r.data.status, r.data.message);
        }).catch(except ? except : this.globalExcept);
    }

    public post(ep: string, data: any, handler: (status: number, message: string) => void, except?: (reason: any) => void): Promise<void> {
        return axios.post(this.getEndpoint(ep), data).then((r) => {
            handler(r.data.status, r.data.message);
        }).catch(except ? except : this.globalExcept);
    }
}

export const useAthena = (
    baseUrl: string = "https://athena2.atatctech.com",
    globalExcept: (reason: any) => void = () => {}
): Athena => {
    return new Athena(baseUrl, globalExcept);
};
