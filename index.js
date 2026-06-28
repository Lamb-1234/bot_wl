require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// =====================
// 🔵 IDS (TROCAR AQUI)
// =====================
const OLHEIRO_ID = process.env.OLHEIRO_ID;
const MEMBRO_ID = process.env.MEMBRO_ID;
const ADMIN_ID = process.env.ADMIN_ID;
const SETUP_ID = process.env.SETUP_ID;
const DISCORD_ID = process.env.DISCORD_ID;

// =====================
// 🟢 INICIO
// =====================
console.log("INICIANDO BOT...");

// =====================
// 1 - AUTO OLHEIRO
// =====================
client.on("guildMemberAdd", async (member) => {
  const role = member.guild.roles.cache.get(OLHEIRO_ID);
  if (role) member.roles.add(role);
});

// =====================
// 2 - BOTÃO WL
// =====================
client.on("ready", async () => {
  console.log(`Bot online: ${client.user.tag}`);

  const channel = client.channels.cache.get(SETUP_CHANNEL);
  if (!channel) return;

  const button = new ButtonBuilder()
    .setCustomId("wl_request")
    .setLabel("Solicitar WL")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  channel.send({
    content: "Clique para solicitar whitelist:",
    components: [row],
  });
});

// =====================
// 3 - ABRIR FORM
// =====================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "wl_request") {
    const modal = new ModalBuilder()
      .setCustomId("wl_form")
      .setTitle("Whitelist");

    const nome = new TextInputBuilder()
      .setCustomId("nome")
      .setLabel("Nome RP")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const id = new TextInputBuilder()
      .setCustomId("id")
      .setLabel("ID do jogador")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(nome),
      new ActionRowBuilder().addComponents(id),
    );

    await interaction.showModal(modal);
  }
});

// =====================
// 4 - ENVIAR PARA ADM
// =====================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "wl_form") {
    const nome = interaction.fields.getTextInputValue("nome");
    const id = interaction.fields.getTextInputValue("id");

    const channel = interaction.guild.channels.cache.get(MEMBRO_ID);

    const msg = await channel.send({
      content: `📩 NOVA WL\n\n👤 Nome: ${nome}\n🆔 ID: ${id}\n👤 User: ${interaction.user.tag}`,
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`wl_accept_${interaction.user.id}`)
            .setLabel("✔ Aprovar")
            .setStyle(ButtonStyle.Success),

          new ButtonBuilder()
            .setCustomId(`wl_reject_${interaction.user.id}`)
            .setLabel("❌ Rejeitar")
            .setStyle(ButtonStyle.Danger),
        ),
      ],
    });

    await interaction.reply({
      content: "📨 WL enviada com sucesso!",
      ephemeral: true,
    });
  }
});

// =====================
// 5 - APROVAR / REJEITAR
// =====================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith("wl_accept_")) {
    const userId = interaction.customId.split("_")[2];
    const member = await interaction.guild.members.fetch(userId);

    await member.roles.remove(OLHEIRO_ID);
    await member.roles.add(MEMBRO_ROLE);

    return interaction.reply({
      content: "✔ WL APROVADA",
      ephemeral: true,
    });
  }

  if (interaction.customId.startsWith("wl_reject_")) {
    return interaction.reply({
      content: "❌ WL REJEITADA",
      ephemeral: true,
    });
  }
});

// =====================
// LOGIN
// =====================
client.login(DISCORD_ID);
