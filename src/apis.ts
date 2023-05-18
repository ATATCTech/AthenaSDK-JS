import {User} from "./types.js";
import Status from "./status.js";
import {getToken, removeToken, setToken} from "./native.js";
import {Athena} from "./athena.js";

export const signUpRequest = (
    instance: Athena,
    success: () => void,
    other: (status: number) => void,
    name: string,
    email: string,
    displayName: string,
    password: string
): Promise<void> => {
    return instance.post("sign_up_request", {
        name: name,
        email: email,
        displayName: displayName,
        password: password
    }, (status) => {
        if (Status.success(status)) success();
        else other(status);
    });
};

export const signUp = (
    instance: Athena,
    success: (t: string) => void,
    other: (status: number) => void,
    requestToken: string,
    tokenSetter: (token: string) => void = setToken
): Promise<void> => {
    return instance.post("sign_up", {token: requestToken}, (status, message) => {
        if (Status.success(status)) {
            tokenSetter(message);
            success(message);
        }
        else other(status);
    });
};

export const signIn = (
    instance: Athena,
    success: (t: string) => void,
    other: (status: number) => void,
    nameOrEmail: string,
    password: string,
    tokenSetter: (token: string) => void = setToken
): Promise<void> => {
    return instance.post("sign_in", {name: nameOrEmail, email: nameOrEmail, password: password}, (status, message) => {
        if (Status.success(status)) {
            tokenSetter(message);
            success(message);
        }
        else other(status);
    });
};

export const getUserByName = (
    instance: Athena,
    success: (u: User) => void,
    other: (status: number) => void,
    name: string
): Promise<void> => {
    return instance.get("user", [name], (status, message) => {
        if (Status.success(status)) success(JSON.parse(message));
        else other(status);
    });
};

export const getUsers = (
    instance: Athena,
    success: (u: User[]) => void,
    other: (status: number) => void,
    nameList: string[]
): Promise<void> => {
    return instance.get("users", [nameList.toString()], (status, message) => {
        if (Status.success(status)) success(JSON.parse(message));
        else other(status);
    });
};

export const getUsersWith = (
    instance: Athena,
    success: (u: User[]) => void,
    other: (status: number) => void,
    keyword: string,
    filter: string,
): Promise<void> => {
    return instance.get("users", [keyword, filter], (status, message) => {
        if (Status.success(status)) success(JSON.parse(message));
        else other(status);
    });
};

export const getUserByAAT = (
    instance: Athena,
    success: (u: User) => void,
    other: (status: number) => void,
    tokenGetter: () => string | null = getToken,
    tokenRemover: () => void = removeToken
): Promise<void> => {
    const token = tokenGetter();
    if (token == null) return new Promise((resolve, reject) => {reject("token not found");});
    return instance.post("user", {token: token}, (status, message) => {
        if (Status.success(status)) success(JSON.parse(message));
        else {
            if (status === 0) tokenRemover();
            other(status);
        }
    });
};