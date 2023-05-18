import {useAthena} from "../src/athena.js";

const instance = useAthena("http://localhost:8080", (e) => {console.log(e);});
