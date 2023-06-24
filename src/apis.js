import Status from "./status";
import { getToken, removeToken, setToken } from "./native";
import { displayNameCheck, emailCheck, lengthCheck, nameCheck } from "./aaa";
export class Rejection {
    code;
    msg;
    constructor(code, msg = "") {
        this.code = code;
        this.msg = msg;
    }
}
export function test(instance, online, unavailable, other = () => { }, offline) {
    return instance.get("", [], (status) => {
        if (Status.success(status))
            online();
        else if (Status.unavailable(status))
            unavailable();
        else
            other(status);
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
export function userExists(instance, exists, not, other, nameOrEmail) {
    if (!nameCheck(nameOrEmail) && !emailCheck(nameOrEmail))
        return new Promise((_, reject) => { reject(new Rejection(0, nameOrEmail)); });
    return instance.get("user_exists", [nameOrEmail], (status, message) => {
        if (Status.success(status)) {
            if (message === "true")
                exists();
            else
                not();
        }
        else
            other(status);
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
export function signUpRequest(instance, success, other, name, email, displayName, password) {
    if (!nameCheck(name))
        return new Promise((_, reject) => { reject(new Rejection(0, name)); });
    if (!emailCheck(email))
        return new Promise((_, reject) => { reject(new Rejection(1, email)); });
    if (!displayNameCheck(displayName))
        return new Promise((_, reject) => { reject(new Rejection(2, displayName)); });
    if (!lengthCheck(password, 6, 64))
        return new Promise((_, reject) => { reject(new Rejection(3, password)); });
    return instance.post("sign_up_request", {
        name: name,
        email: email,
        displayName: displayName,
        password: password
    }, (status) => {
        if (Status.success(status))
            success();
        else
            other(status);
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
export function signUp(instance, success, other, requestToken, tokenSetter = setToken) {
    return instance.post("sign_up", { token: requestToken }, (status, message) => {
        if (Status.success(status)) {
            tokenSetter(message);
            success(message);
        }
        else
            other(status);
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
export function signIn(instance, success, other, nameOrEmail, password, clientID, rt) {
    if (!nameCheck(nameOrEmail) && !emailCheck(nameOrEmail))
        return new Promise((_, reject) => { reject(new Rejection(0, nameOrEmail)); });
    if (!lengthCheck(password, 6, 64))
        return new Promise((_, reject) => { reject(new Rejection(1, password)); });
    return instance.post("sign_in", { name: nameOrEmail, email: nameOrEmail, password: password, clientID: clientID, rt: rt }, (status, message) => {
        if (Status.success(status))
            success(message);
        else
            other(status);
    });
}
/**
 * Direct sign in.
 * This requires an athena authentication token that is officially released.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param athenaAuthToken
 * @param clientID
 * @param rt
 * @param tokenRemover
 */
export function directSignIn(instance, success, other, athenaAuthToken, clientID, rt, tokenRemover = removeToken) {
    return instance.post("direct_sign_in", { token: athenaAuthToken, clientID: clientID, rt: rt }, (status, message) => {
        if (Status.success(status))
            success(message);
        else {
            if (status === 0)
                tokenRemover();
            other(status);
        }
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
 * @param wait blocks the thread
 */
export async function athenaAuthToken(instance, success, other, athenaAuthCode, clientSecret, wait = true) {
    if (wait) {
        const [status, message] = await instance._post("aat", { token: athenaAuthCode, clientSecret: clientSecret });
        if (Status.success(status))
            success(message);
        else
            other(status);
    }
    else {
        return instance.post("aat", { token: athenaAuthCode, clientSecret: clientSecret }, (status, message) => {
            if (Status.success(status))
                success(message);
            else
                other(status);
        });
    }
}
/**
 * Get user by name.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param name
 * @rejection 0 invalid {@param name}
 */
export function getUserByName(instance, success, other, name) {
    if (!nameCheck(name))
        return new Promise((_, reject) => { reject(new Rejection(0, name)); });
    return instance.get("user", [name], (status, message) => {
        if (Status.success(status))
            success(JSON.parse(message));
        else
            other(status);
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
export function getUsers(instance, success, other, nameList) {
    for (let name of nameList)
        if (!nameCheck(name))
            return new Promise((_, reject) => { reject(new Rejection(0, name)); });
    return instance.get("users", [nameList.toString()], (status, message) => {
        if (Status.success(status))
            success(JSON.parse(message));
        else
            other(status);
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
export function getUsersWith(instance, success, other, keyword, filter) {
    return instance.get("users", [keyword, filter], (status, message) => {
        if (Status.success(status))
            success(JSON.parse(message));
        else
            other(status);
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
export function getUserByAAT(instance, success, other, tokenGetter = getToken, tokenRemover = removeToken) {
    const token = tokenGetter();
    if (token == null)
        return new Promise((_, reject) => { reject(new Rejection(0, "token not found")); });
    return instance.post("user", { token: token }, (status, message) => {
        if (Status.success(status))
            success(JSON.parse(message));
        else {
            if (status === 0)
                tokenRemover();
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
export function setUser(instance, success, other, displayName, profile, tokenGetter = getToken, tokenRemover = removeToken) {
    const token = tokenGetter();
    if (token == null)
        return new Promise((_, reject) => { reject(new Rejection(0, "token not found")); });
    if (!displayNameCheck(displayName) && !lengthCheck(profile, undefined, 65536))
        return new Promise((_, reject) => { reject(new Rejection(1)); });
    return instance.post("set_user", { token: token, user: { displayName: displayName, profile: profile } }, (status) => {
        if (Status.success(status))
            success();
        else {
            if (status === 0)
                tokenRemover();
            other(status);
        }
    });
}
//# sourceMappingURL=apis.js.map