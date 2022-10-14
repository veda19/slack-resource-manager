const { getRegionMap, setRegionMap } = require("../config/db")
const { isSuperUser } = require("../helpers/helper")

/**
 * 
 * @param {Response} res 
 * @param {string} userId 
 * @param {string} environmentDetails 
 * @returns {Response} responds the user with operaion status
 */
const unlockRegions = async (res, userId, environmentDetails) => {
    let SUPER_USER_OVERRIDE = false
    const envArray = environmentDetails.split(",")
    const map = await getRegionMap()
    const noAccessRegions = []
    const availableRegions = []
    const regionsToUnlock = []

    for (const env of envArray) {
        // if not a valid airport code
        if (map[env] === undefined) {
            res.send(`Invalid canonical region short code \`${env}\` `)
            return
        }
        // if the user trying to unlock is not the owner of the lock
        if (map[env] !== null && map[env] != userId) {
            noAccessRegions.push(env)
        }
    }

    if (noAccessRegions.length > 0 && !isSuperUser(userId)) {
        res.send(`The region(s) \`${noAccessRegions.join(",")}\` cannot be unlocked because someone else own the lock`)
        return        
    } else if (isSuperUser(userId) && noAccessRegions.length > 0) {
        SUPER_USER_OVERRIDE = true
    }

    for (const env of envArray) {
        if (map[env] ===  null) {  // ignore if trying to unlock a resource which is not already locked
            availableRegions.push(env)
        } else {
            regionsToUnlock.push(env)
        }
         
        map[env] = null
    }
    await setRegionMap(map)
    SUPER_USER_OVERRIDE ? 
        availableRegions.length === 0 ?
        res.send(`_*SUPER USER OVERRIDE*_ :superhero:\nSuccesfully unlocked the region(s) \`${envArray.join(",")}\``) :
        regionsToUnlock.length === 0 ?
        res.send(`The region(s) \`${availableRegions.join(",")}\` are already available to use`) :
        res.send(`_*SUPER USER OVERRIDE*_\nSuccesfully unlocked the region(s) \`${regionsToUnlock.join(",")}\` and the region(s) \`${availableRegions.join(",")}\` are already available to use`) :
        
        availableRegions.length === 0 ?
        res.send(`Succesfully unlocked the region(s) \`${envArray.join(",")}\``) :
        regionsToUnlock.length === 0 ?
        res.send(`The region(s) \`${availableRegions.join(",")}\` are already available to use`) :
        res.send(`Succesfully unlocked the region(s) \`${regionsToUnlock.join(",")}\` and the region(s) \`${availableRegions.join(",")}\` are already available to use`)
}

module.exports = { unlockRegions }