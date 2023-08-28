# AthenaSDK-JS

JavaScript SDK for Athena2.

## Installation

```shell
npm i @atatctech/athena-sdk
```

## Usage

```javascript
const instance = useAthena();
test(instance,
    () => {
    console.log("online");
}, () => {
    console.log("unavailable");
}, undefined, () => {
    console.log("offline");
});
```

### Create an Instance

```javascript
const baseUrl = "http://localhost";
const port = 8080;

const instance = useAthena(baseUrl, port);
```

`baseUrl` refers to the backend server address. In this case, it is set to "http://localhost" instead of "https://athena2.atatctech.com" by default.

`port` specifies the port that the server listens.

The following example is equivalent to the one above.

```javascript
const instance = useAthena("http://localhost:8080");
```

## APIs

- `test()`
- `userExists()`
- `signUpRequest()`
- `signUp()`
- `signIn()`
- `directSignIn()`
- `athenaAuthToken()`
- `getUserByName()`
- `getUserByUID()`
- `getUsers()`
- `getUsersByUIDs()`
- `getUsersWith()`
- `getUserByAAT()`
- `setUser()`
- `setName()`
- `setEmailRequest()`
- `setEmail()`
- `setPasswordRequest()`
- `setPassword()`
- `revokeTokens()`
