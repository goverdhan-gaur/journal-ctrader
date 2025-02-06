import { ref, set, push } from "firebase/database";

import { database } from "./firebase.config";
export const writeData = async (data: any) => {
    const a = await push(ref(database, `trades`), data);
    console.log(a.key);
};



