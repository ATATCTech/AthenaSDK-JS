export function lengthCheck(string, minLength = 0, maxLength) {
    return string != null && string.length >= minLength && string.length <= maxLength;
}
export function emailCheck(email) {
    return lengthCheck(email, 5, 320) && /^[\w!#$%&'*+\-/=?^`{|}~]+(\.[\w!#$%&'*+\-/=?^`{|}~]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]+$/.test(email);
}
export function displayableCheck(string) {
    return string != null && /^[\S ]+$/.test(string);
}
export function displayNameCheck(displayName, minLength = 3, maxLength = 36) {
    return lengthCheck(displayName, minLength, maxLength) && displayableCheck(displayName);
}
export function nameCheck(name, minLength = 3, maxLength = 36) {
    return lengthCheck(name, minLength, maxLength) && /^[A-Za-z]+(-?[A-Za-z0-9]+)*$/.test(name);
}
export function urlCheck(url, prefix = "https://") {
    return prefix != null && lengthCheck(url, prefix.length + 1, 8182) && new RegExp("^" + prefix + "[\\w!#$%&'*+\\-/=?^`{|}~.]+$").test(url);
}
export function mobileCheck(mobile) {
    return lengthCheck(mobile, 7, 16) && /^\+?[0-9]+$/.test(mobile);
}
//# sourceMappingURL=aaa.js.map