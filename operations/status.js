const { getRegionMap } = require("../config/db")
const { getUserNameById } = require("../helpers/helper")

/**
 * build a formatted string to display the locked envs
 * @param {string[]} lockedEnvs 
 * @param {Object} envToUserMap 
 * @returns {string}
 */
const getLockedEnvDetails = (lockedEnvs, envToUserMap) => {
    let details = `The Details of locked Regions are as Follows\n`
    for (const env of lockedEnvs) {
        details += `\`${env}\` is being used by \`${envToUserMap[env]}\`\n`
    }
    return details
}

/**
 * 
 * @param {Response} res 
 * @param {string} userId 
 * @param {string} environmentDetails 
 * @returns {Response} formatted string to display the usage status 
 */
const getStatus = async (res, userId, environmentDetails) => {
    const envArray = environmentDetails.split(",")
    const map = await getRegionMap()
    const availableEnvs = []
    const lockedEnvs = []
    const envToUserMap = {}
    const userIdToNameMap = {}

    for (const env of envArray) {
        // if not a valid airport code
        if (map[env] === undefined) {
            res.send(`Invalid canonical region short code \`${env}\` `)
            return
        }

        if(map[env] === null) {
            availableEnvs.push(env)
        } else if(map[env].length > 0) {
            if (userIdToNameMap[map[env]]) {
                envToUserMap[env] = userIdToNameMap[map[env]]
                lockedEnvs.push(env)
                continue
            }
            envToUserMap[env] = await getUserNameById(map[env])
            userIdToNameMap[map[env]] = envToUserMap[env]
            lockedEnvs.push(env)
        }
    }

    availableEnvs.length === 0 ?
        res.send(`${getLockedEnvDetails(lockedEnvs, envToUserMap)}`) :
        lockedEnvs.length === 0 ?
        res.send(`The region(s) \`${availableEnvs.join(",")}\` are free to use`) :
        res.send(`${getLockedEnvDetails(lockedEnvs, envToUserMap)} whereas the region(s) \`${availableEnvs.join(",")}\` are free to use`) 

}


module.exports = { getStatus }