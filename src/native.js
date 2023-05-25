import { getCookie, removeCookie, setCookie } from "typescript-cookie";
export function getToken() {
    if (typeof document === "undefined")
        return null;
    const token = getCookie("athenaAuthToken");
    return token === undefined ? null : token;
}
export function setToken(token) {
    if (typeof document === "undefined")
        return;
    setCookie("athenaAuthToken", token);
}
export function removeToken() {
    if (typeof document === "undefined")
        return;
    removeCookie("athenaAuthToken");
}
//# sourceMappingURL=native.js.map