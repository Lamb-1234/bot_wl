module.exports = {
    name: "guildMemberAdd",

    async execute(member) {

        const role = member.guild.roles.cache.get(process.env.OLHEIRO_ID);

        if (role) {
            await member.roles.add(role);
        }

    }
};
