import axios from "axios";

export class Athena {
    private readonly baseUrl: string;
    private readonly port?: number;

    constructor(baseUrl: string, port?: number) {
        this.baseUrl = baseUrl;
        this.port = port;
    }

    public getEndpoint(ep: string): string {
        return (this.port == null ? this.baseUrl : this.baseUrl + ":" + this.port) + "/" + ep;
    }

    public async get(ep: string, pathVariables: string[] = []): Promise<[number, string]> {
        const r = await axios.get(this.getEndpoint(ep) + "/" + pathVariables.join("/"));
        return [r.data.status, r.data.message];
    }

    public async post(ep: string, data: any): Promise<[number, string]> {
        const r = await axios.post(this.getEndpoint(ep), data);
        return [r.data.status, r.data.message];
    }
}

export function useAthena(
    baseUrl: string = "https://athena2.atatctech.com",
    port?: number
): Athena {
    return new Athena(baseUrl, port);
}
