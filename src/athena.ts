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
        const r = await (await fetch(this.getEndpoint(ep) + "/" + pathVariables.join("/"))).json();
        return [r.status, r.message];
    }

    public async post(ep: string, data: any): Promise<[number, string]> {
        const r = await (await fetch(this.getEndpoint(ep), {method: "POST", body: JSON.stringify(data), headers: {
                'Content-Type': 'application/json'
            }})).json();
        return [r.status, r.message];
    }
}

export function useAthena(
    baseUrl: string = "https://athena2.atatctech.com",
    port?: number
): Athena {
    return new Athena(baseUrl, port);
}
