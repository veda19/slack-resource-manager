const crypto = require('crypto')
const bcrypt = require('bcrypt')
require('dotenv').config()

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET

const buildRequestBodyString = (requestBody) => {
    let bodyString = ``
    const objectKeys = Object.keys(requestBody)
    for (const key of objectKeys) {
        bodyString += `${key}=${requestBody[key]}&`
    }
    return bodyString.slice(0, -1)
}

const isAuthSuccessful = async (req) => {

    const requestTimestamp = req.headers['x-slack-request-timestamp']
    const slackSignature = req.headers['x-slack-signature']
    console.log({headers: req.headers});

    const timeDifference = Math.abs(((new Date()).getTime() / 1000) - requestTimestamp)
    
    if (timeDifference > 60 * 5) {
        // The request timestamp is more than five minutes from local time.
        // It could be a replay attack, so let's ignore it.
        return false
    } 

    const requestBody = buildRequestBodyString(req.body)

    const signatureBaseString = `v0:${requestTimestamp}:${requestBody}`

    //TODO: compare the slack signatures

    return true
}

module.exports = { isAuthSuccessful }

















