const wlStore = require("../data/wlStore");

module.exports = {
    name: "removewl",
    description: "Remove a whitelist de um usuário",
    options: [
        {
            name: "user",
            description: "Usuário para remover WL",
            type: 6, // USER
            required: true
        }
    ],

    async execute(interaction) {

        const user = interaction.options.getUser("user");

        const wl = wlStore.getWL(user.id);

        if (!wl) {
            return interaction.reply({
                content: "❌ Esse usuário não tem whitelist.",
                ephemeral: true
            });
        }

        wlStore.deleteWL(user.id);

        return interaction.reply({
            content: `✔ WL de **${user.tag}** foi removida com sucesso.`,
            ephemeral: true
        });
    }
};
