const wlStore = require("../data/wlStore");

module.exports = {
    name: "guildMemberRemove",

    async execute(member) {

        const userId = member.id;

        // remove a WL do sistema principal
        const wl = wlStore.getWL(userId);

        if (wl) {
            wlStore.deleteWL(userId);
            console.log(`🧹 WL removida automaticamente: ${userId}`);
        }
    }
};
