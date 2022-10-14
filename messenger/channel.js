const { WebClient } = require('@slack/web-api')
require('dotenv').config()
const botToken = process.env.SLACK_BOT_TOKEN
const web = new WebClient(botToken)


/**
 * sends message to a slack channel
 * in case of private channel, the bot needs to be a member
 * @param {string} message 
 * @param {string} channel 
 */
const postMessageToChannel = async (message, channel) => {
  await web.chat.postMessage({
    channel,
    text: message,
  });
}

module.exports = { postMessageToChannel }