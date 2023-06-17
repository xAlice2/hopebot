const protobuf = require('protobufjs')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function EggIncFirstContactRequest(EID) {
    
    var rootProto = await protobuf.load('src\\utils\\ei.proto')

    var url = "https://ctx-dot-auxbrainhome.appspot.com/ei/bot_first_contact"
    const params = new URLSearchParams();
    params.append('data', btoa(`."${EID}`));

    var response = await fetch(url, { method: "POST", body: params })
    var test = Buffer.from(await response.text(), 'base64')
    var first_contact_response = rootProto.lookupType("ei.EggIncFirstContactResponse")
    return first_contact_response.decode(test).backup
    
}

async function GetPeriodicalsRequest() {
    
    var kirbyEID = "EI4964979469451264", clientVer = 99
    var rootProto = await protobuf.load('src\\utils\\ei.proto')
    var periodicalsReq = rootProto.lookupType('ei.GetPeriodicalsRequest')
    var buffer = periodicalsReq.encode(periodicalsReq.create({ userId: kirbyEID, currentClientVersion: clientVer })).finish()

    var url = "https://ctx-dot-auxbrainhome.appspot.com/ei/get_periodicals"
    const params = new URLSearchParams();
    params.append('data', btoa(buffer));

    var response = await fetch(url, { method: "POST", body: params })
    var encodedResp = Buffer.from(await response.text(), 'base64')

    var auth = rootProto.lookupType("ei.AuthenticatedMessage")
    let authmessage = auth.decode(encodedResp).message

    var periodicals_response = rootProto.lookupType("ei.PeriodicalsResponse")
    return periodicals_response.decode(authmessage)
}


module.exports = { EggIncFirstContactRequest }