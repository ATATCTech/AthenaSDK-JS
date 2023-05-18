# AthenaSDK-JS

JavaScript SDK for Athena2.

## Installation

```shell
npm i @atatctech/athena-sdk
```

## Usage

```javascript
const instance = useAthena();
getUserByName(instance, (u) => {console.log(u);}, () => {}, "USERNAME").then();
```

