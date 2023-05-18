export function lengthCheck(string: string | null, minLength: number = 0, maxLength: number): boolean {
    return string != null && string.length >= minLength && string.length <= maxLength;
}

export function emailCheck(email: string | null): boolean {
    return lengthCheck(email, 2, 320) && /^[\w!#$%&'*+\-/=?^`{|}~]+(\.[\w!#$%&'*+\-/=?^`{|}~]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]+$/.test(email as string);
}

export function displayableCheck(string: string | null): boolean {
    return string != null && /\S+/.test(string);
}

export function displayNameCheck(displayName: string | null, minLength: number = 3, maxLength: number = 36): boolean {
    return lengthCheck(displayName, minLength, maxLength) && displayableCheck(displayName);
}

export function nameCheck(name: string | null, minLength: number = 3, maxLength: number = 36): boolean {
    return lengthCheck(name, minLength, maxLength) && /^[A-Za-z]+(-?[A-Za-z0-9]+)*$/.test(name as string);
}

export function urlCheck(url: string | null, prefix: string | null = "https://"): boolean {
    return prefix != null && lengthCheck(url, prefix.length + 1, 1024) && new RegExp("^" + prefix + "[\\w!#$%&'*+\\-/=?^`{|}~.]+").test(url as string);
}
