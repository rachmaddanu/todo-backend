const twilio = require('twilio');

const { accountSiD, authToken } = require('./secret/twilio_key.js');

const client = new twilio(accountSiD, authToken);

module.exports = client;