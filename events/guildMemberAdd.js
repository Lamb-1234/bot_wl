const config = require("../config/config");

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {

        const role = member.guild.roles.cache.get(config.ROLES.OLHEIRO);

        if (!role) return;

        try {
            await member.roles.add(role);
        } catch (err) {
            console.log("Erro ao dar cargo OLHEIRO:", err);
        }

    }
};
