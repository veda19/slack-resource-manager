const { getRegionMap, setRegionMap } = require("../config/db")
require('dotenv').config()

/**
 * lock given region(s) under the currentUser name
 * @param {Response} res 
 * @param string userId 
 * @param {string} environmentDetails 
 * @returns {Response} responds the user with operaion status
 */
const lockRegion = async (res, userId, environmentDetails) => {
    const envArray = environmentDetails.split(",")
    const map = await getRegionMap()
    const inUseEnvs = []
    for (const env of envArray) {
        // if not a valid airport code
        if (map[env] === undefined) {
            res.send(`Invalid canonical region short code \`${env}\` `)
            return
        }
        if (map[env] !== null) {
            inUseEnvs.push(env)
        } 
    }  
    
    if (inUseEnvs.length > 0) {
        res.send(`The region(s) \`${inUseEnvs.join(",")}\` is currently under use. Please try again after sometime`)
        return
    }

    for (const env of envArray) {
        map[env] = userId
    }
    await setRegionMap(map)
    res.send(`Lock acquired succesfully for region(s) \`${envArray.join(",")}\``)
}

module.exports = { lockRegion }