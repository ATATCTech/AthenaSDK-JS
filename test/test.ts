import {useAthena} from "../src/athena.js";
import {getUserByName} from "../src/index.js";

const instance = useAthena("http://localhost:8080", (e) => {console.log(e);});
getUserByName(instance, (u) => {console.log(u);}, () => {}, "ATATC").then();