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
const baseUrl = "http://localhost:8080";
const defaultExcept = (r: any) => {
    console.log("Err");
    console.log(r);
};

const instance = useAthena(baseUrl, defaultExcept);
```

`baseUrl` refers to the backend server address. In this case, it is set to "http://localhost:8080" instead of "https://athena2.atatctech.com" by default.

`defaultExcept` is the method that is called when an error occurs for all APIs if not specified.

## APIs

- `test()`
- `userExists()`
- `signUpRequest()`
- `signUp()`
- `signIn()`
- `directSignIn()`
- `athenaAuthToken()`
- `getUserByName()`
- `getUsers()`
- `getUsersWith()`
- `getUserByAAT()`
- `setUser()`
- `setName()`
- `revokeTokens()`
