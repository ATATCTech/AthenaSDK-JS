import {User} from "./types";
import Status from "./status";
import {getToken, removeToken, setToken} from "./native";
import {Athena} from "./athena";
import {displayNameCheck, emailCheck, lengthCheck, nameCheck} from "./dataCheck";

export class Rejection extends Error {
    public readonly code: number;
    public readonly msg: string;

    public constructor(code: number, msg: string = "") {
        super(code + ": " + msg);
        this.code = code;
        this.msg = msg;
    }
}

export async function test(
    instance: Athena,
    online: () => void,
    unavailable: () => void,
    other: (status: number) => void = () => {
    },
    offline?: (reason: any) => void,
): Promise<void> {
    try {
        const [status] = await instance.get("/online");
        if (Status.success(status)) online();
        else if (Status.unavailable(status)) unavailable();
        else other(status);
    } catch (e) {
        if (offline != null) offline(e);
    }
}

/**
 * Check if such user exists.
 * @param instance Athena instance
 * @param exists callback if the user exists
 * @param not callback if the user does not exist
 * @param other callback on other status
 * @param nameOrEmail
 * @exception 0 invalid {@param nameOrEmail}
 */
export async function userExists(
    instance: Athena,
    exists: () => void,
    not: () => void,
    other: (status: number) => void,
    nameOrEmail: string
): Promise<void> {
    if (!nameCheck(nameOrEmail) && !emailCheck(nameOrEmail)) throw new Rejection(0, nameOrEmail);
    const [status, message] = await instance.get("user_exists", [nameOrEmail]);
    if (Status.success(status)) {
        if (message === "true") exists();
        else not();
    } else other(status);
}

/**
 * Send a verification email to sign up.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param name
 * @param email
 * @param displayName
 * @param password
 * @exception 0 invalid {@param name}
 * @exception 1 invalid {@param email}
 * @exception 2 invalid {@param displayName}
 * @exception 3 invalid {@param password}
 */
export async function signUpRequest(
    instance: Athena,
    success: () => void,
    other: (status: number) => void,
    name: string,
    email: string,
    displayName: string,
    password: string
): Promise<void> {
    if (!nameCheck(name)) throw new Rejection(0, name);
    if (!emailCheck(email)) throw new Rejection(1, email);
    if (!displayNameCheck(displayName)) throw new Rejection(2, displayName);
    if (!lengthCheck(password, 6, 64)) throw new Rejection(3, password);
    const [status] = await instance.post("sign_up_request", {
        name: name,
        email: email,
        displayName: displayName,
        password: password
    });
    if (Status.success(status)) success();
    else other(status);
}

/**
 * Sign up.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param requestToken
 * @param tokenSetter
 */
export async function signUp(
    instance: Athena,
    success: (t: string) => void,
    other: (status: number) => void,
    requestToken: string,
    tokenSetter: (token: string) => void = setToken
): Promise<void> {
    const [status, message] = await instance.post("sign_up", {token: requestToken});
    if (Status.success(status)) {
        tokenSetter(message);
        success(message);
    } else other(status);
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
 * @exception 0 invalid {@param nameOrEmail}
 * @exception 1 invalid {@param password}
 */
export async function signIn(
    instance: Athena,
    success: (c: string) => void,
    other: (status: number) => void,
    nameOrEmail: string,
    password: string,
    clientID: string,
    rt: string
): Promise<void> {
    if (!nameCheck(nameOrEmail) && !emailCheck(nameOrEmail)) throw new Rejection(0, nameOrEmail);
    if (!lengthCheck(password, 6, 64)) throw new Rejection(1, password);
    const [status, message] = await instance.post("sign_in", {
        name: nameOrEmail,
        email: nameOrEmail,
        password: password,
        clientID: clientID,
        rt: rt
    });
    if (Status.success(status)) success(message);
    else other(status);
}

/**
 * Direct sign in.
 * This requires an athena authentication token that is officially released.
 * *Require officially issued token.*
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param athenaAuthToken
 * @param clientID
 * @param rt
 * @param tokenRemover
 */
export async function directSignIn(
    instance: Athena,
    success: (c: string) => void,
    other: (status: number) => void,
    athenaAuthToken: string,
    clientID: string,
    rt: string,
    tokenRemover: () => void = removeToken
): Promise<void> {
    const [status, message] = await instance.post("direct_sign_in", {
        token: athenaAuthToken,
        clientID: clientID,
        rt: rt
    });
    if (Status.success(status)) success(message);
    else {
        if (status === 0) tokenRemover();
        other(status);
    }
}

/**
 * Exchange athena authentication code for athena authentication token.
 * This API involves client secret, meaning that it is supposed to be called in the backend.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param athenaAuthCode
 * @param clientSecret
 */
export async function athenaAuthToken(
    instance: Athena,
    success: (t: string) => void,
    other: (status: number) => void,
    athenaAuthCode: string,
    clientSecret: string,
): Promise<void> {
    const [status, message] = await instance.post("aat", {token: athenaAuthCode, clientSecret: clientSecret});
    if (Status.success(status)) success(message);
    else other(status);
}

/**
 * Get user by name.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param name
 * @exception 0 invalid {@param name}
 */
export async function getUserByName(
    instance: Athena,
    success: (u: User) => void,
    other: (status: number) => void,
    name: string
): Promise<void> {
    if (!nameCheck(name)) throw new Rejection(0, name);
    const [status, message] = await instance.get("user", [name]);
    if (Status.success(status)) success(JSON.parse(message));
    else other(status);
}

/**
 * Get users by names.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param nameList
 * @exception 0 invalid name in {@param nameList}
 */
export async function getUsers(
    instance: Athena,
    success: (u: User[]) => void,
    other: (status: number) => void,
    nameList: string[]
): Promise<void> {
    for (let name of nameList) if (!nameCheck(name)) throw new Rejection(0, name);
    const [status, message] = await instance.get("users", [nameList.toString()]);
    if (Status.success(status)) success(JSON.parse(message));
    else other(status);
}

/**
 * Get users with a certain filter.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param keyword
 * @param filter
 */
export async function getUsersWith(
    instance: Athena,
    success: (u: User[]) => void,
    other: (status: number) => void,
    keyword: string,
    filter: string,
): Promise<void> {
    const [status, message] = await instance.get("users", [keyword, filter]);
    if (Status.success(status)) success(JSON.parse(message));
    else other(status);
}

/**
 * Get user object with AthenaAuthToken.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param tokenGetter
 * @param tokenRemover
 * @exception 0 token not found
 */
export async function getUserByAAT(
    instance: Athena,
    success: (u: User) => void,
    other: (status: number) => void,
    tokenGetter: () => string | null = getToken,
    tokenRemover: () => void = removeToken
): Promise<void> {
    const token = tokenGetter();
    if (token == null) throw new Rejection(0, "token not found");
    const [status, message] = await instance.post("user", {token: token});
    if (Status.success(status)) success(JSON.parse(message));
    else {
        if (status === 0) tokenRemover();
        other(status);
    }
}

/**
 * Set user's basic information.
 * *Require officially issued token.*
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param displayName
 * @param profile
 * @param tokenGetter
 * @param tokenRemover
 * @exception 0 token not found
 * @exception 1 both {@param displayName} and {@param profile} are invalid
 */
export async function setUser(
    instance: Athena,
    success: () => void,
    other: (status: number) => void,
    displayName: string,
    profile: string,
    tokenGetter: () => string | null = getToken,
    tokenRemover: () => void = removeToken
): Promise<void> {
    const token = tokenGetter();
    if (token == null) throw new Rejection(0, "token not found");
    if (!displayNameCheck(displayName) && !lengthCheck(profile, undefined, 65536)) throw new Rejection(1);
    const [status] = await instance.post("set_user", {
        token: token,
        user: {displayName: displayName, profile: profile}
    });
    if (Status.success(status)) success();
    else {
        if (status === 0) tokenRemover();
        other(status);
    }
}

/**
 * Change user's name.
 * *Require officially issued token.*
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param name
 * @param tokenGetter
 * @param tokenSetter
 * @param tokenRemover
 * @exception 0 token not found
 * @exception 1 invalid {@param name}
 */
export async function setName(
    instance: Athena,
    success: (t: string) => void,
    other: (status: number) => void,
    name: string,
    tokenGetter: () => string | null = getToken,
    tokenSetter: (token: string) => void = setToken,
    tokenRemover: () => void = removeToken
): Promise<void> {
    const token = tokenGetter();
    if (token == null) throw new Rejection(0, "token not found");
    if (!nameCheck(name)) throw new Rejection(1, name);
    const [status, message] = await instance.post("set_name", {string: name, token: token});
    if (Status.success(status)) {
        tokenSetter(message);
        success(message);
    } else {
        if (status === 0) tokenRemover();
        other(status);
    }
}

/**
 * Send a verification email to change email address. The email will be sent to the new email address.
 * *Require officially issued token.*
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param success
 * @param other
 * @param email
 * @param tokenGetter
 * @param tokenRemover
 * @exception 0 token not found
 * @exception 1 invalid {@param email}
 */
export async function setEmailRequest(
    instance: Athena,
    success: () => void,
    other: (status: number) => void,
    email: string,
    tokenGetter: () => string | null = getToken,
    tokenRemover: () => void = removeToken
): Promise<void> {
    const token = tokenGetter();
    if (token == null) throw new Rejection(0, "token not found");
    if (!emailCheck(email)) throw new Rejection(1, email);
    const [status] = await instance.post("set_email_request", {string: email, token: token});
    if (Status.success(status)) success();
    else {
        if (status === 0) tokenRemover();
        other(status);
    }
}

/**
 * Change user's email address.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param success
 * @param other
 * @param requestToken
 */
export async function setEmail(
    instance: Athena,
    success: () => void,
    other: (status: number) => void,
    requestToken: string,
): Promise<void> {
    const [status] = await instance.post("set_email", {token: requestToken});
    if (Status.success(status)) success();
    else other(status);
}

/**
 * Send a verification email to change password.
 * *Require officially issued token.*
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param success
 * @param other
 * @param email
 * @param password
 * @exception 0 invalid {@param email}
 * @exception 1 invalid {@param password}
 */
export async function setPasswordRequest(
    instance: Athena,
    success: () => void,
    other: (status: number) => void,
    email: string,
    password: string
): Promise<void> {
    if (!emailCheck(email)) throw new Rejection(0, email);
    if (!lengthCheck(password, 6, 64)) throw new Rejection(1, password);
    const [status] = await instance.post("set_password_request", {string: email, newString: password});
    if (Status.success(status)) success();
    else other(status);
}

/**
 * Change user's password.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param success
 * @param other
 * @param requestToken
 */
export async function setPassword(
    instance: Athena,
    success: () => void,
    other: (status: number) => void,
    requestToken: string,
): Promise<void> {
    const [status] = await instance.post("set_password", {token: requestToken});
    if (Status.success(status)) success();
    else other(status);
}

/**
 * Revoke all tokens.
 * *Require officially issued token.*
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param tokenGetter
 * @param tokenRemover
 * @exception 0 token not found
 */
export async function revokeTokens(
    instance: Athena,
    success: () => void,
    other: (status: number) => void,
    tokenGetter: () => string | null = getToken,
    tokenRemover: () => void = removeToken
): Promise<void> {
    const token = tokenGetter();
    if (token == null) throw new Rejection(0, "token not found");
    const [status] = await instance.post("revoke_tokens", {token: token});
    if (Status.success(status)) {
        tokenRemover();
        success();
    } else {
        if (status === 0) tokenRemover();
        other(status);
    }
}