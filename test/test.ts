import {useAthena, test} from "../src/index.js";

const instance = useAthena("http://localhost:8080", (e) => {console.log(e);});
test(instance,
    () => {
    console.log("online");
}, () => {
    console.log("unavailable");
}, undefined, () => {
    console.log("offline");
});