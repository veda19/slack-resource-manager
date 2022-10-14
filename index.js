const { getRegionsFromRealmCode } = require("./config/db")
const { addRegion, deleteRegion } = require("./operations/manageRegion")
const { addRealm, deleteRealm, listRealmMappings } = require("./operations/manageRealm")
const { lockRegion } = require("./operations/lock")
const { unlockRegions } = require("./operations/unlock")
const { getStatus } = require("./operations/status")
const { isSuperUser } = require("./helpers/helper")
const { isAuthSuccessful } = require("./helpers/auth")

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())


const userToken = process.env.SLACK_USER_TOKEN
const port = process.env.PORT || 4000

const ADMIN_OPERATIONS = ["add-region", "delete-region", "add-realm", "delete-realm", "list-mappings"]
const OPERATIONS = ADMIN_OPERATIONS.concat("lock", "unlock", "status")

/**
 * API Route handling the slack's slash command - /pe
 */
app.post('/', async (req, res) => {
  if (!req.body) {
    res.status(400).send("Bad Request")
  }

  const commandArgs = req.body.text && req.body.text.split(" ")
  if (commandArgs === null || commandArgs.length !== 2) {
    res.status(400).send("Bad Request")
  }

  const operation = commandArgs[0]

  let environmentDetails = commandArgs[1]

  if (!OPERATIONS.includes(operation)) {
    res.send("Bad Request. Please check the parameters once again")
  }

  if (ADMIN_OPERATIONS.includes(operation)) {
    if (!isSuperUser(req.body.user_id)) {
      res.send("Operation Forbidden")
      return
    }
    if (["add-region", "delete-region"].includes(operation) && environmentDetails.split(":").length !== 2) {
      res.send("Bad Request. Please check the arguments again")
    }
  }

  // check if a realm code given in the input
  if (environmentDetails.match(/^OC/) && !ADMIN_OPERATIONS.includes(operation)) {

    // re-assign this value with the respective region short codes
    environmentDetails = await getRegionsFromRealmCode(environmentDetails)
    if (environmentDetails === null) {
      res.send("Invalid realm. Please try again")
      return
    }
    // in case of an invalid realm code
    if (environmentDetails == -1) {
      res.send("Bad Request. Improper realm code")
      return
    }
  } 
  
  switch(operation) {
    case 'lock': lockRegion(res, req.body.user_id, environmentDetails)
      break
    case 'unlock': unlockRegions(res, req.body.user_id, environmentDetails)
      break
    case 'status': getStatus(res, req.body.user_id, environmentDetails)  
      break;
    case 'add-region': addRegion(res, environmentDetails)
      break
    case 'delete-region': deleteRegion(res, environmentDetails)    
      break
    case 'add-realm': addRealm(res, environmentDetails)
      break
    case 'delete-realm': deleteRealm(res, environmentDetails)
      break  
    case 'list-mappings': listRealmMappings(res)   
      break
    default: res.send("Bad Request. Please check the parameters once again")
  }
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
