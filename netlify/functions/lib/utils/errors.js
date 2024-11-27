/**
 * @param  {} paramName
 * @param  {} message=""
 */

class ParamsError extends Error {
    constructor(paramName, message = "") {
        super(`[${paramName}]- ${message}`);
    }
}

module.exports = { ParamsError }
