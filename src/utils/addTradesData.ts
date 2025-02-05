import { ref, set, push } from "firebase/database";

import { database } from "./firebase.config";
const writeData = (userId: string, data: any) => {
    set(ref(database, `trades/${userId}`), data);
};