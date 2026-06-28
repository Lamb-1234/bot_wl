const { SlashCommandBuilder } = require("discord.js");
const wlStore = require("../../data/wlStore");
const { canHandleWL } = require("../../utils/permissions");
const { sendLog } = require("../../utils/logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removewl")
        .setDescription("Remove a whitelist de um usuário")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("Usuário")
                .setRequired(true)
        ),

    async execute(interaction, client) {

        if (!canHandleWL(interaction.member)) {
            return interaction.reply({
                content: "❌ Sem permissão",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser("user");
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        const wl = wlStore.getWL(user.id);

        if (!wl) {
            return interaction.reply({
                content: "⚠ WL não encontrada.",
                ephemeral: true
            });
        }

        // remove do banco
        wlStore.deleteWL(user.id);

        // remove cargos se existir membro
        if (member) {
            await member.roles.remove(process.env.MEMBRO_ID).catch(() => {});
            await member.roles.remove(process.env.RECRUTADOR_ID).catch(() => {});
        }

        // log
        await sendLog(client, {
            userTag: user.tag,
            userId: user.id,
            action: "WL REMOVIDA",
            staff: interaction.user.tag
        });

        // DM
        user.send("⚠ Sua whitelist foi REMOVIDA por um administrador.").catch(() => {});

        return interaction.reply({
            content: `✔ WL de ${user.tag} removida com sucesso.`,
            ephemeral: true
        });
    }
};
