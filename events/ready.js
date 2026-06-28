const loadCommands = require("../handlers/commandHandler");
const fs = require("fs");
const path = require("path");

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const config = require("../config/config");

const filePath = path.join(__dirname, "../data/panel.json");

module.exports = {
    name: "ready",
    once: true,

    async execute(client) {

        await loadCommands(client);

        console.log(`Bot online: ${client.user.tag}`);

        const channel = await client.channels.fetch(config.CHANNELS.WL_PANEL);

        const embed = new EmbedBuilder()
            .setTitle("🌴 ROCINHA RP - WHITELIST")
            .setDescription("Clique no botão abaixo para iniciar sua whitelist.")
            .setColor(config.COLORS.PRIMARY)
            .setFooter({ text: config.EMBED_FOOTER });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(config.BUTTONS.REQUEST_WL)
                .setLabel("Solicitar WL")
                .setStyle(ButtonStyle.Success)
        );

        let msg = null;

        // =========================
        // 1. tenta carregar ID salvo
        // =========================
        let data = {};
        try {
            data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        } catch {}

        if (data.panelMessageId) {
            try {
                msg = await channel.messages.fetch(data.panelMessageId);
            } catch {
                msg = null;
            }
        }

        // =========================
        // 2. SE NÃO ACHOU → PROCURA QUALQUER PAINEL ANTIGO
        // =========================
        if (!msg) {
            const messages = await channel.messages.fetch({ limit: 10 });

            msg = messages.find(m =>
                m.author.id === client.user.id &&
                m.components.length > 0
            ) || null;
        }

        // =========================
        // 3. SE AINDA NÃO ACHOU → CRIA
        // =========================
        if (!msg) {
            msg = await channel.send({
                embeds: [embed],
                components: [row],
            });
        } else {
            await msg.edit({
                embeds: [embed],
                components: [row],
            });
        }

        // =========================
        // 4. SALVA SEMPRE O ID CERTO
        // =========================
        fs.writeFileSync(filePath, JSON.stringify({
            panelMessageId: msg.id
        }, null, 2));
    }
};
