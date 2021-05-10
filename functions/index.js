const express = require('express');
const functions = require("firebase-functions").region("asia-northeast3");
const admin = require("firebase-admin");

const {RtcTokenBuilder, RtcRole} = require("agora-access-token");
const APP_ID = "f6b5501a22f64b6b9e26ac9332d93d9f";
const APP_CERTIFICATE = "07ff45c4d5094a95b58a88531548dd81";
const app = express();


admin.initializeApp();

const nocache = (req, resp, next) => {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  resp.header('Expires', '-1');
  resp.header('Pragma', 'no-cache');
  next();
}

exports.generateAccessToken = functions.https.onRequest((req, res) => {
  // set response header
  resp.header('Acess-Control-Allow-Origin', '*');
  // get channel name
  const channelName = req.query.channelName;
  if (!channelName) {
    return resp.status(500).json({ 'error': 'channel is required' });
  }
  // get uid 
  let uid = req.query.uid;
  if(!uid || uid == '') {
    uid = 0;
  }
  // get role
  let role = RtcRole.SUBSCRIBER;
  if (req.query.role == 'publisher') {
    role = RtcRole.PUBLISHER;
  }
  // get the expire time
  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime == '') {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  // calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  // build the token
  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
  // return the token
  return resp.json({ 'token': token });
});

const cors = require('cors');
app.use(cors({ origin: true }));
app.use(myMiddleware);

app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
exports.widgets = functions.https.onRequest(app);