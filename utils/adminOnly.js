const config = require("../config/config");

function isAdmin(member) {
    return member.roles.cache.has(config.ROLES.ADMIN);
}

module.exports = { isAdmin };
