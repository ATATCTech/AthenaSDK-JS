import {User} from "./types";
import Status from "./status";
import {getToken, removeToken, setToken} from "./native";
import {Athena} from "./athena";
import {displayNameCheck, emailCheck, lengthCheck, nameCheck} from "./aaa";

export class Rejection {
    public readonly code: number;
    public readonly msg: string;
    public constructor(code: number, msg: string = "") {
        this.code = code;
        this.msg = msg;
    }
}

export function test(
    instance: Athena,
    online: () => void,
    unavailable: () => void,
    other: (status: number) => void = () => {},
    offline?: (reason: any) => void,
): Promise<void> {
    return instance.get("", [], (status) => {
        if (Status.success(status)) online();
        else if (Status.unavailable(status)) unavailable();
        else other(status);
    }, offline);
}

/**
 * Check if such user exists.
 * @param instance Athena instance
 * @param exists callback if the user exists
 * @param not callback if the user does not exist
 * @param other callback on other status
 * @param nameOrEmail
 * @rejection 0 invalid {@param nameOrEmail}
 */
export function userExists(
    instance: Athena,
    exists: () => void,
    not: () => void,
    other: (status: number) => void,
    nameOrEmail: string
): Promise<void> {
    if (!nameCheck(nameOrEmail) && !emailCheck(nameOrEmail)) return new Promise((_, reject) => {reject(new Rejection(0, nameOrEmail));});
    return instance.get("user_exists", [nameOrEmail], (status, message) => {
        if (Status.success(status)) {
            if (message === "true") exists();
            else not();
        }
        else other(status);
    });
}

/**
 * Send an email request to sign up.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param name
 * @param email
 * @param displayName
 * @param password
 * @rejection 0 invalid {@param name}
 * @rejection 1 invalid {@param email}
 * @rejection 2 invalid {@param displayName}
 * @rejection 3 invalid {@param password}
 */
export function signUpRequest(
    instance: Athena,
    success: () => void,
    other: (status: number) => void,
    name: string,
    email: string,
    displayName: string,
    password: string
): Promise<void> {
    if (!nameCheck(name)) return new Promise((_, reject) => {reject(new Rejection(0, name));});
    if (!emailCheck(email)) return new Promise((_, reject) => {reject(new Rejection(1, email));});
    if (!displayNameCheck(displayName)) return new Promise((_, reject) => {reject(new Rejection(2, displayName));});
    if (!lengthCheck(password, 6, 64)) return new Promise((_, reject) => {reject(new Rejection(3, password));});
    return instance.post("sign_up_request", {
        name: name,
        email: email,
        displayName: displayName,
        password: password
    }, (status) => {
        if (Status.success(status)) success();
        else other(status);
    });
}

/**
 * Sign up.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param requestToken
 * @param tokenSetter
 */
export function signUp(
    instance: Athena,
    success: (t: string) => void,
    other: (status: number) => void,
    requestToken: string,
    tokenSetter: (token: string) => void = setToken
): Promise<void> {
    return instance.post("sign_up", {token: requestToken}, (status, message) => {
        if (Status.success(status)) {
            tokenSetter(message);
            success(message);
        }
        else other(status);
    });
}

/**
 * Sign in.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param nameOrEmail
 * @param password
 * @param clientID
 * @param rt
 * @rejection 0 invalid {@param nameOrEmail}
 * @rejection 1 invalid {@param password}
 */
export function signIn(
    instance: Athena,
    success: (c: string) => void,
    other: (status: number) => void,
    nameOrEmail: string,
    password: string,
    clientID: string,
    rt: string
): Promise<void> {
    if (!nameCheck(nameOrEmail) && !emailCheck(nameOrEmail)) return new Promise((_, reject) => {reject(new Rejection(0, nameOrEmail));});
    if (!lengthCheck(password, 6, 64)) return new Promise((_, reject) => {reject(new Rejection(1, password));});
    return instance.post("sign_in", {name: nameOrEmail, email: nameOrEmail, password: password, clientID: clientID, rt: rt}, (status, message) => {
        if (Status.success(status)) success(message);
        else other(status);
    });
}

/**
 * Exchange athena authentication code for athena authentication token.
 * This API involves client secret, meaning that it is supposed to be called in the backend.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param athenaAuthCode
 * @param clientSecret
 * @param tokenSetter
 */
export function athenaAuthToken(
    instance: Athena,
    success: (t: string) => void,
    other: (status: number) => void,
    athenaAuthCode: string,
    clientSecret: string,
    tokenSetter: (token: string) => void = setToken
): Promise<void> {
    return instance.post("aat", {token: athenaAuthCode, clientSecret: clientSecret}, (status, message) => {
        if (Status.success(status)) {
            tokenSetter(message);
            success(message);
        }
        else other(status);
    });
}

/**
 * Get user by name.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param name
 * @rejection 0 invalid {@param name}
 */
export function getUserByName(
    instance: Athena,
    success: (u: User) => void,
    other: (status: number) => void,
    name: string
): Promise<void> {
    if (!nameCheck(name)) return new Promise((_, reject) => {reject(new Rejection(0, name));});
    return instance.get("user", [name], (status, message) => {
        if (Status.success(status)) success(JSON.parse(message));
        else other(status);
    });
}

/**
 * Get users by names.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param nameList
 * @rejection 0 invalid name in {@param nameList}
 */
export function getUsers(
    instance: Athena,
    success: (u: User[]) => void,
    other: (status: number) => void,
    nameList: string[]
): Promise<void> {
    for (let name of nameList) if (!nameCheck(name)) return new Promise((_, reject) => {reject(new Rejection(0, name));});
    return instance.get("users", [nameList.toString()], (status, message) => {
        if (Status.success(status)) success(JSON.parse(message));
        else other(status);
    });
}

/**
 * Get users with a certain filter.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param keyword
 * @param filter
 */
export function getUsersWith(
    instance: Athena,
    success: (u: User[]) => void,
    other: (status: number) => void,
    keyword: string,
    filter: string,
): Promise<void> {
    return instance.get("users", [keyword, filter], (status, message) => {
        if (Status.success(status)) success(JSON.parse(message));
        else other(status);
    });
}

/**
 * Get user object with AthenaAuthToken.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param tokenGetter
 * @param tokenRemover
 * @rejection 0 token not found
 */
export function getUserByAAT(
    instance: Athena,
    success: (u: User) => void,
    other: (status: number) => void,
    tokenGetter: () => string | null = getToken,
    tokenRemover: () => void = removeToken
): Promise<void> {
    const token = tokenGetter();
    if (token == null) return new Promise((_, reject) => {reject(new Rejection(0, "token not found"));});
    return instance.post("user", {token: token}, (status, message) => {
        if (Status.success(status)) success(JSON.parse(message));
        else {
            if (status === 0) tokenRemover();
            other(status);
        }
    });
}

/**
 * Set user's basic information.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param displayName
 * @param profile
 * @param tokenGetter
 * @param tokenRemover
 * @rejection 0 token not found
 * @rejection 1 both {@param displayName} and {@param profile} are invalid
 */
export function setUser(
    instance: Athena,
    success: () => void,
    other: (status: number) => void,
    displayName: string,
    profile: string,
    tokenGetter: () => string | null = getToken,
    tokenRemover: () => void = removeToken
): Promise<void> {
    const token = tokenGetter();
    if (token == null) return new Promise((_, reject) => {reject(new Rejection(0, "token not found"));});
    if (!displayNameCheck(displayName) && !lengthCheck(profile, undefined, 65536)) return new Promise((_, reject) => {reject(new Rejection(1));});
    return instance.post("set_user", {token: token, user: {displayName: displayName, profile: profile}}, (status) => {
        if (Status.success(status)) success();
        else {
            if (status === 0) tokenRemover();
            other(status);
        }
    });
}