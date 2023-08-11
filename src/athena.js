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
        const r = await fetch(this.getEndpoint(ep) + "/" + pathVariables.join("/"));
        return [(await r.json()).status, (await r.json()).message];
    }
    async post(ep, data) {
        const r = await fetch(this.getEndpoint(ep), { method: "POST", body: data });
        return [(await r.json()).status, (await r.json()).message];
    }
}
export function useAthena(baseUrl = "https://athena2.atatctech.com", port) {
    return new Athena(baseUrl, port);
}
//# sourceMappingURL=athena.js.map