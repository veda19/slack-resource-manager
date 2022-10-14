// testing purposes

let regionMap = {
    QRO: null,
    CDG: null,
    LIN: null,
    JNB: null,
    ARN: null,
    SCA: null,
    SIN: null,
    MRS: null,
    MTZ: null,
    ICN: null,
    KIX: null,
    VCP: null,
    CWL: null,
    SCL: null,
    NRT: null,
    AUH: null,
    ZRH: null,
    JED: null,
    YUL: null,
    HYD: null,
    SJC: null,
    YYZ: null,
    GRU: null,
    MEL: null,
    AMS: null,
    YNY: null,
    BOM: null,
    SYD: null,
    DXB: null,
    PHX: null,
    LHR: null,
    FRA: null,
    IAD: null,
    IADTls: null,
    TIW: null,
    NJA: null,
    UKB: null,
    MCT: null,
    WGA: null
}

/**
 * @deprecated used only for test purposes 
 * @param {Object} map 
 */
const setRegionMap = (map) => regionMap = map

/**
 * @deprecated used only for test purposes 
 * @returns {Object} regionMap
 */
const getRegionMap = () => regionMap

module.exports = { setRegionMap, getRegionMap }