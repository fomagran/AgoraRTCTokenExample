//firebase funtions 한국 서버로 설정
const functions = require("firebase-functions").region("asia-northeast3");
//Agora 액세스 토큰빌더,역할 설정
const {RtcTokenBuilder, RtcRole} = require("agora-access-token");
//Agora 앱아이디
const APP_ID = "1186f40c5f4743a7b0650c9a6a0565d6";
//Agora 시크릿
const APP_CERTIFICATE = "ac57e6cc2fb144c1a8659423f1d7724e";

//Cloud Functions으로 토큰 생성 함수 만듦.
exports.generateToken = functions.https.onCall((data)=>{

  //Agora 채널이름
  const channelName = data.channelName;
  //Agora uid
  const uid = data.uid;
  //Agora 역할
  let role = RtcRole.SUBSCRIBER;

  if (data.role == true) {
    role = RtcRole.PUBLISHER;
  }
  //중단되는 시간
  const expireTime = data.expireTime;
  //현재시간
  const currentTime = Math.floor(Date.now() / 1000);
  //현재부터 중단되는 시간
  const privilegeExpireTime = currentTime + expireTime;
  //Agora 토큰
  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE,
      channelName, uid, role, privilegeExpireTime);

  //json형식으로 token값 반환
  return {"token" : token};
});