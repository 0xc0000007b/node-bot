function  debug(obj = {}) {
    return JSON.stringify(obj, null, 5)
}

module.exports = debug;