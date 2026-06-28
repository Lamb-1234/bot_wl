const config = require("../config/config");

function canHandleWL(member) {
    if (!member) return false;

    return (
        member.roles.cache.has(config.ROLES.ADMIN) ||
        member.roles.cache.has(config.ROLES.RECRUTADOR)
    );
}

module.exports = { canHandleWL };
