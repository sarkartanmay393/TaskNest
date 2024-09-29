import admin from "firebase-admin";
import * as serviceAccount from "./tsmk-firebase-admin.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
