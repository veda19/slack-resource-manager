
const { WebClient } = require('@slack/web-api');
require('dotenv').config()

const userToken = process.env.SLACK_USER_TOKEN
const web = new WebClient(userToken);

/**
 * get Display name of the given user
 * @param {string} userId 
 * @returns {string | null} display name 
 */
const getUserNameById = async (userId) => {
  const result = await web.users.info({
    user: userId
  }); 
  return result && result.user && result.user.profile ?
  result.user.profile.display_name : null
}

/**
 * check if the given user is a super user
 * @param {string} currentUserId 
 * @returns {boolean} 
 */
const isSuperUser = (currentUserId) => {
  const superUserCSV = process.env.SUPER_USER
  return superUserCSV.split(",").includes(currentUserId)
}

/**
 * @deprecated used only for test purposes 
 * @param {string} realm 
 * @returns {string} CSV string of regions
 */ 
const getRegionsFromRealmCode = (realm) => {
  switch(realm) {
    case "OC1": return "FRA,IAD,LHR,PHX,NRT,KIX,ICN,ZRH,YYZ,BOM,SYD,GRU,VCP,SCL,AMS,LIN,ARN,MRS,MTZ,JNB,JED,DXB,AUH,MEL,SIN,YUL,SJC,HYD,CWL,YNY,CDG,QRO"
    case "OC1-MULTI": return "FRA,IAD,LHR,PHX"
    case "OC1-MONO": return "NRT,KIX,ICN,ZRH,YYZ,BOM,SYD,GRU,VCP,SCL,AMS,LIN,ARN,MRS,MTZ,JNB,JED,DXB,AUH,MEL,SIN,YUL,SJC,HYD,CWL,YNY,CDG,QRO"
    case "OC5": return "TIW" 
    case "OC8": return "NJA,UKB"
    case "OC9": return "MCT"
    case "OC10": return "WGA"
    default: return -1
  }

}

  
module.exports = { getUserNameById, isSuperUser, getRegionsFromRealmCode }