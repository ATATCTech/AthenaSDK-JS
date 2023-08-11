export class Athena {
    baseUrl;
    port;
    constructor(baseUrl, port) {
        this.baseUrl = baseUrl;
        this.port = port;
    }
    getEndpoint(ep) {
        return (this.port == null ? this.baseUrl : this.baseUrl + ":" + this.port) + "/" + ep;
    }
    async get(ep, pathVariables = []) {
        const r = await (await fetch(this.getEndpoint(ep) + "/" + pathVariables.join("/"))).json();
        return [r.status, r.message];
    }
    async post(ep, data) {
        const r = await (await fetch(this.getEndpoint(ep), { method: "POST", body: data })).json();
        return [r.status, r.message];
    }
}
export function useAthena(baseUrl = "https://athena2.atatctech.com", port) {
    return new Athena(baseUrl, port);
}
//# sourceMappingURL=athena.js.map