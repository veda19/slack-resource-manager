const { getRegionMap, setRegionMap, addRegionToRealm, deleteRegionFromRealm } = require("../config/db")

/**
 * add a new region; also map it with the given realm
 * @param {Response} res 
 * @param {string} details 
 * @returns {Response}
 */
const addRegion = async (res, details) => {
    const realm = details.split(":")[0]
    const region = details.split(":")[1]

    // insert region in the lock_details collection
    const regionMap = await getRegionMap()
    regionMap[region] = null
    await setRegionMap(regionMap)

    // update the realm region mappings
    await addRegionToRealm(realm, region)

    if (realm === "OC1-MONO" || realm === "OC1-MULTI") addRegion(res, `OC1:${region}`)

    res.send(`The Region \`${region}\` is succesfully added to the realm \`${realm}\` `)
}

/**
 * delete the given region; also remove the realm mapping
 * @param {Response} res 
 * @param {string} details
 * @returns {Response} 
 */
const deleteRegion = async (res, details) => {
    const realm = details.split(":")[0]
    const region = details.split(":")[1]

    // delete region from the lock_details collection
    const regionMap = await getRegionMap()
    delete regionMap[region]
    await setRegionMap(regionMap)

    // update the realm region mappings
    await deleteRegionFromRealm(realm, region)

    if (realm === "OC1-MONO" || realm === "OC1-MULTI") deleteRegion(res, `OC1:${region}`)

    res.send(`The Region \`${region}\` is succesfully removed from the realm \`${realm}\` `)
}

module.exports = { addRegion, deleteRegion }