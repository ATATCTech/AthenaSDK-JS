import {getCookie, removeCookie, setCookie} from "typescript-cookie";

export const getToken = (): string | null => {
    if (typeof document === "undefined") return null;
    const token = getCookie("athenaAuthToken");
    return token === undefined ? null : token;
};

export const setToken = (token: string): void => {
    if (typeof document === "undefined") return;
    setCookie("athenaAuthToken", token);
};

export const removeToken = (): void => {
    if (typeof document === "undefined") return;
    removeCookie("athenaAuthToken");
};