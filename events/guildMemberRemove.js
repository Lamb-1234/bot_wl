const wlStore = require("../data/wlStore");
const config = require("../config/config");

module.exports = {
    name: "guildMemberRemove",

    async execute(member) {

        const wl = wlStore.getWL(member.id);
        if (!wl) return;

        wlStore.deleteWL(member.id);

        const channel = member.guild.channels.cache.get(config.CHANNELS.WL_LOGS);
        if (!channel) return;

        channel.send(`⚠ WL removida automaticamente: **${member.user.tag}** saiu do servidor.`);
    }
};
