import axios from "axios";
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
        const r = await axios.get(this.getEndpoint(ep) + "/" + pathVariables.join("/"));
        return [r.data.status, r.data.message];
    }
    async post(ep, data) {
        const r = await axios.post(this.getEndpoint(ep), data);
        return [r.data.status, r.data.message];
    }
}
export function useAthena(baseUrl = "https://athena2.atatctech.com", port) {
    return new Athena(baseUrl, port);
}
//# sourceMappingURL=athena.js.map