import {getCookie, removeCookie, setCookie} from "typescript-cookie";

export function getToken(): string | null {
    if (typeof document === "undefined") return null;
    const token = getCookie("athenaAuthToken");
    return token === undefined ? null : token;
}

export function setToken(token: string): void {
    if (typeof document === "undefined") return;
    setCookie("athenaAuthToken", token);
}

export function removeToken(): void {
    if (typeof document === "undefined") return;
    removeCookie("athenaAuthToken");
}