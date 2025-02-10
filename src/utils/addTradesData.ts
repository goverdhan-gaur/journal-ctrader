import { ref, push } from "firebase/database";

import { database } from "./firebase.config";
import { Overview } from "./aggregatedOverview";
export const writeData = async (data: Overview) => {
    const a = await push(ref(database, `trades`), data);
    console.log(a.key);
};



