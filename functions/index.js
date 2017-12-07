const functions = require('firebase-functions');
const admin = require('firebase-admin');

// const createUser = require('./routes/create_user');
// const requestOtp = require('./routes/request_otp');
// const verifyOtp = require('./routes/verify_otp');
//bootcamp2
const request_OTP = require('./routes/requestOTP');
const verify_OTP = require('./routes/verifyOTP');


const serviceAccount = require("./secret/firebase-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-otp-ce2d1.firebaseio.com"
}); //dapet dari firebase

// exports.createUser = functions.https.onRequest(createUser);
// exports.requestOtp = functions.https.onRequest(requestOtp);
// exports.verifyOtp = functions.https.onRequest(verifyOtp);
exports.request_OTP = functions.https.onRequest(request_OTP);
exports.verify_OTP = functions.https.onRequest(verify_OTP);