// const admin = require("firebase-admin");
// const serviceAccount = require("./firebase-service-account.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// console.log("Firebase Admin Initialized with project:", admin.app().options.projectId);

// module.exports = admin;

import admin from "firebase-admin";
import { createRequire } from "module";

// Allows us to import JSON files in an ES6 module environment
const require = createRequire(import.meta.url);
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("Firebase Admin Initialized with project:", admin.app().options.projectId);

export default admin;