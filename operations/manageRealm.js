const { insertRealm, removeRealm, getRealmMappings } = require("../config/db")

const buildRealmMappingsResponse = (mappings) => {
    let response = "The Realm to region mappings are as follows\n"
    for (const mapping of mappings) {
        response += `\`${mapping.realm}\`   -->   \`${mapping.region}\`\n`
    }
    return response
}

/**
 * add a new realm
 * @param {Response} res 
 * @param {string} realm
 * @returns {Response}
 */
const addRealm = async (res, realm) => {
    await insertRealm(realm)
    res.send(`The realm \`${realm}\` is succesfully added`)
}

/**
 * delete the realm
 * @param {Response} res 
 * @param {string} realm 
 * @returns {Response}
 */
const deleteRealm = async (res, realm) => {
    await removeRealm(realm)
    res.send(`The realm \`${realm}\` is succesfully deleted`)
}

/**
 * list all the realm to region mappings
 * @param {Response} res 
 */
const listRealmMappings = async (res) => {
    const mappings = await getRealmMappings()
    res.send(buildRealmMappingsResponse(mappings))
}

module.exports = { addRealm, deleteRealm, listRealmMappings }