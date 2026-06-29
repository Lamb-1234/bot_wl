const config = require("../config/config");
const wlStore = require("../data/wlStore");

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {

        const wl = wlStore.getWL(member.id);

        const olho = member.guild.roles.cache.get(config.ROLES.OLHEIRO);
        const membro = member.guild.roles.cache.get(config.ROLES.MEMBRO);

        if (!olho) return;

        try {

            // SEM WL → OLHEIRO
            if (!wl || wl.status !== "approved") {
                await member.roles.add(olho).catch(() => {});
                return;
            }

            // COM WL APROVADA → MEMBRO
            if (membro) {
                await member.roles.add(membro).catch(() => {});
            }

        } catch (err) {
            console.log("Erro guildMemberAdd:", err.message);
        }
    }
};
