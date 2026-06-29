const config = require("../config/config");
const wlData = require("../data/wlData.json");

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {

        const hasWL = wlData[member.id]?.status === "approved";

        const olheiroRole = member.guild.roles.cache.get(config.ROLES.OLHEIRO);
        const wlRole = member.guild.roles.cache.get(config.ROLES.WL); // se tiver

        try {

            // se tem WL
            if (hasWL) {
                if (wlRole) await member.roles.add(wlRole).catch(() => {});
                if (olheiroRole) await member.roles.remove(olheiroRole).catch(() => {});
            }

            // se NÃO tem WL
            if (!hasWL) {
                if (olheiroRole) await member.roles.add(olheiroRole);
            }

        } catch (err) {
            console.log("Erro ao gerenciar cargos:", err);
        }
    }
};
