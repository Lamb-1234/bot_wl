const { applyUserState } = require("../utils/wlEngineCore");

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {
        await applyUserState(member);
    }
};
