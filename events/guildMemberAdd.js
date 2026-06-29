const config = require("../config/config");
const wlStore = require("../data/wlStore");

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {

        const wl = wlStore.getWL(member.id);

        // Se já tem WL aprovada, NÃO dá olheiro
        if (wl && wl.status === "approved") return;

        const role = member.guild.roles.cache.get(config.ROLES.OLHEIRO);
        if (!role) return;

        try {
            await member.roles.add(role);
        } catch (err) {
            console.log("Erro ao dar cargo OLHEIRO:", err.message);
        }
    }
};
