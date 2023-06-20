import axios from "axios";
export class Athena {
    baseUrl;
    defaultExcept;
    constructor(baseUrl, defaultExcept = () => { }) {
        this.baseUrl = baseUrl;
        this.defaultExcept = defaultExcept;
    }
    getEndpoint(ep) {
        return this.baseUrl + "/" + ep;
    }
    get(ep, pathVariables = [], handler, except) {
        return axios.get(this.getEndpoint(ep) + "/" + pathVariables.join("/")).then((r) => {
            handler(r.data.status, r.data.message);
        }).catch(except == null ? this.defaultExcept : except);
    }
    post(ep, data, handler, except) {
        return axios.post(this.getEndpoint(ep), data).then((r) => {
            handler(r.data.status, r.data.message);
        }).catch(except == null ? this.defaultExcept : except);
    }
}
export function useAthena(baseUrl = "https://athena2.atatctech.com", defaultExcept = () => { }) {
    return new Athena(baseUrl, defaultExcept);
}
//# sourceMappingURL=athena.js.map