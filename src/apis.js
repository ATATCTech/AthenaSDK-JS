import Status from "./status";
import { getToken, removeToken, setToken } from "./native";
import { displayNameCheck, emailCheck, lengthCheck, nameCheck } from "./aaa";
export class Rejection extends Error {
    code;
    msg;
    constructor(code, msg = "") {
        super(code + ": " + msg);
        this.code = code;
        this.msg = msg;
    }
}
export async function test(instance, online, unavailable, other = () => {
}, offline) {
    try {
        const [status] = await instance.get("");
        if (Status.success(status))
            online();
        else if (Status.unavailable(status))
            unavailable();
        else
            other(status);
    }
    catch (e) {
        if (offline != null)
            offline(e);
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
export async function userExists(instance, exists, not, other, nameOrEmail) {
    if (!nameCheck(nameOrEmail) && !emailCheck(nameOrEmail))
        throw new Rejection(0, nameOrEmail);
    const [status, message] = await instance.get("user_exists", [nameOrEmail]);
    if (Status.success(status)) {
        if (message === "true")
            exists();
        else
            not();
    }
    else
        other(status);
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
 * @exception 0 invalid {@param name}
 * @exception 1 invalid {@param email}
 * @exception 2 invalid {@param displayName}
 * @exception 3 invalid {@param password}
 */
export async function signUpRequest(instance, success, other, name, email, displayName, password) {
    if (!nameCheck(name))
        throw new Rejection(0, name);
    if (!emailCheck(email))
        throw new Rejection(1, email);
    if (!displayNameCheck(displayName))
        throw new Rejection(2, displayName);
    if (!lengthCheck(password, 6, 64))
        throw new Rejection(3, password);
    const [status] = await instance.post("sign_up_request", {
        name: name,
        email: email,
        displayName: displayName,
        password: password
    });
    if (Status.success(status))
        success();
    else
        other(status);
}
/**
 * Sign up.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param requestToken
 * @param tokenSetter
 */
export async function signUp(instance, success, other, requestToken, tokenSetter = setToken) {
    const [status, message] = await instance.post("sign_up", { token: requestToken });
    if (Status.success(status)) {
        tokenSetter(message);
        success(message);
    }
    else
        other(status);
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
export async function signIn(instance, success, other, nameOrEmail, password, clientID, rt) {
    if (!nameCheck(nameOrEmail) && !emailCheck(nameOrEmail))
        throw new Rejection(0, nameOrEmail);
    if (!lengthCheck(password, 6, 64))
        throw new Rejection(1, password);
    const [status, message] = await instance.post("sign_in", {
        name: nameOrEmail,
        email: nameOrEmail,
        password: password,
        clientID: clientID,
        rt: rt
    });
    if (Status.success(status))
        success(message);
    else
        other(status);
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
export async function directSignIn(instance, success, other, athenaAuthToken, clientID, rt, tokenRemover = removeToken) {
    const [status, message] = await instance.post("direct_sign_in", {
        token: athenaAuthToken,
        clientID: clientID,
        rt: rt
    });
    if (Status.success(status))
        success(message);
    else {
        if (status === 0)
            tokenRemover();
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
export async function athenaAuthToken(instance, success, other, athenaAuthCode, clientSecret) {
    const [status, message] = await instance.post("aat", { token: athenaAuthCode, clientSecret: clientSecret });
    if (Status.success(status))
        success(message);
    else
        other(status);
}
/**
 * Get user by name.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param name
 * @exception 0 invalid {@param name}
 */
export async function getUserByName(instance, success, other, name) {
    if (!nameCheck(name))
        throw new Rejection(0, name);
    const [status, message] = await instance.get("user", [name]);
    if (Status.success(status))
        success(JSON.parse(message));
    else
        other(status);
}
/**
 * Get users by names.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param nameList
 * @exception 0 invalid name in {@param nameList}
 */
export async function getUsers(instance, success, other, nameList) {
    for (let name of nameList)
        if (!nameCheck(name))
            throw new Rejection(0, name);
    const [status, message] = await instance.get("users", [nameList.toString()]);
    if (Status.success(status))
        success(JSON.parse(message));
    else
        other(status);
}
/**
 * Get users with a certain filter.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param keyword
 * @param filter
 */
export async function getUsersWith(instance, success, other, keyword, filter) {
    const [status, message] = await instance.get("users", [keyword, filter]);
    if (Status.success(status))
        success(JSON.parse(message));
    else
        other(status);
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
export async function getUserByAAT(instance, success, other, tokenGetter = getToken, tokenRemover = removeToken) {
    const token = tokenGetter();
    if (token == null)
        throw new Rejection(0, "token not found");
    const [status, message] = await instance.post("user", { token: token });
    if (Status.success(status))
        success(JSON.parse(message));
    else {
        if (status === 0)
            tokenRemover();
        other(status);
    }
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
 * @exception 0 token not found
 * @exception 1 both {@param displayName} and {@param profile} are invalid
 */
export async function setUser(instance, success, other, displayName, profile, tokenGetter = getToken, tokenRemover = removeToken) {
    const token = tokenGetter();
    if (token == null)
        throw new Rejection(0, "token not found");
    if (!displayNameCheck(displayName) && !lengthCheck(profile, undefined, 65536))
        throw new Rejection(1);
    const [status] = await instance.post("set_user", {
        token: token,
        user: { displayName: displayName, profile: profile }
    });
    if (Status.success(status))
        success();
    else {
        if (status === 0)
            tokenRemover();
        other(status);
    }
}
/**
 * Set user's name.
 * @param instance Athena instance
 * @param success callback on success
 * @param other callback on other status
 * @param name
 * @param tokenGetter
 * @param tokenRemover
 * @exception 0 token not found
 * @exception 1 invalid {@param name}
 */
export async function setName(instance, success, other, name, tokenGetter = getToken, tokenRemover = removeToken) {
    const token = tokenGetter();
    if (token == null)
        throw new Rejection(0, "token not found");
    if (!nameCheck(name))
        throw new Rejection(1, name);
    const [status] = await instance.post("set_name", { string: name, token: token });
    if (Status.success(status))
        success();
    else {
        if (status === 0)
            tokenRemover();
        other(status);
    }
}
//# sourceMappingURL=apis.js.map