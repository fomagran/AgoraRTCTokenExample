const functions = require("firebase-functions").region("asia-northeast3");
const {RtcTokenBuilder, RtcRole} = require("agora-access-token");
const APP_ID = "f6b5501a22f64b6b9e26ac9332d93d9f";
const APP_CERTIFICATE = "07ff45c4d5094a95b58a88531548dd81";

exports.generateAccessToken = functions.https.onCall((data) => {

  // get channel name
  const channelName = req.query.channelName;
  
  if (!channelName) {
    return data.status(500).json({ 'error': 'channel is required' });
  }
  // get uid 
  let uid = data.uid;
  if(!uid || uid == '') {
    uid = 0;
  }
  // get role
  let role = RtcRole.SUBSCRIBER;
  if (data.role == 'publisher') {
    role = RtcRole.PUBLISHER;
  }
  // get the expire time
  let expireTime = data.expireTime;
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
  return data.json({ 'token': token });
});
