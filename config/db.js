const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqttow1.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

/**
 * get the regionMap from the DB which shows the current usage of the environments
 * @returns {Object} regionMap 
 */
const getRegionMap = async () => {
    const record = await client.db("slack_bot").collection("lock_details").findOne({project: "rce"})
    return record.locks
}

/**
 * set the regionMap to the DB
 * @param {Object} map 
 */
const setRegionMap = async (map) => {
    await client.db("slack_bot").collection("lock_details").updateOne({ project: "rce" }, {$set: { locks: map }})
}

/**
 * get the corresponding regions associated with a realm
 * @param {string} realm 
 * @returns {string} CSV of region short codes
 */
const getRegionsFromRealmCode = async (realm) => {
    const regions = await client.db("slack_bot").collection("realm_region_map").findOne({ realm })
    return regions ? regions.region : null
}

/**
 * add region to a realm
 * @param {string} realm 
 * @param {string} region 
 */
const addRegionToRealm = async (realm, region) => {
    const currentRealmRegionMapping = await getRegionsFromRealmCode(realm)
    await client.db("slack_bot").collection("realm_region_map").updateOne({ realm }, {$set: { region: `${region}` + currentRealmRegionMapping }})
}

/**
 * delete region from a realm
 * @param {string} realm 
 * @param {string} region 
 */
const deleteRegionFromRealm = async (realm, region) => {
    const currentRealmRegionMapping = await getRegionsFromRealmCode(realm)
    const newRealmRegionMapArray = currentRealmRegionMapping.split(",").filter(val => region !== val)
    await client.db("slack_bot").collection("realm_region_map").updateOne({ realm }, {$set: { region: newRealmRegionMapArray.join(",") }})
}

/**
 * insert a new realm document
 * @param {string} realm 
 */
const insertRealm = async (realm) => {
    const currentRealmRegionMapping = await getRegionsFromRealmCode(realm)
    if (currentRealmRegionMapping === null) {
        await client.db("slack_bot").collection("realm_region_map").insertOne({realm, region: ""})
    }
}

/**
 * remove the realm document from the Collection
 * @param {string} realm 
 */
const removeRealm = async (realm) => {
    const currentRealmRegionMapping = await getRegionsFromRealmCode(realm)
    if (currentRealmRegionMapping !== null) {
        await client.db("slack_bot").collection("realm_region_map").deleteOne({realm})
    }
}

/**
 * fetches all the realm to region mappings for the project
 * TODO: add the project filter
 * @returns {object[]} array of realm mappings
 */
const getRealmMappings = async () => {
    return await client.db("slack_bot").collection("realm_region_map").find({}).toArray()
}

module.exports = { setRegionMap, getRegionMap, getRegionsFromRealmCode, addRegionToRealm, deleteRegionFromRealm, insertRealm, removeRealm, getRealmMappings }