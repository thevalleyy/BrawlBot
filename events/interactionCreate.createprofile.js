const { ChannelType, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const config = require("../config.json");
const mysql = require("mysql2");
const util = require("util");

const connection = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 10,
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
});

const db = util.promisify(connection.query).bind(connection);

module.exports = async (client, interaction) => {
    if (interaction.channel.type == ChannelType.DM) return;
    if (interaction.user.bot) return;
    if (!interaction.isButton()) return;
    if (interaction.customId !== "createProfile") return;

    const user = interaction.user;

    try {
        await db(`SELECT * FROM profile WHERE dcid = ${user.id}`).then(async (res) => {
            if (res[0]) return interaction.reply({ content: "Du hast bereits ein Profil.", ephemeral: true });

            // create modal
            const modal = new ModalBuilder().setCustomId("createProfileModal").setTitle("Brawlstars Profil ID verknüpfen");

            // components
            const profileInput = new TextInputBuilder()
                .setCustomId("profileInput")
                .setLabel("Brawlstars Profil ID")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(9)
                .setMinLength(7)
                .setPlaceholder("ohne #")
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(profileInput);
            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        });
    } catch (e) {
        client.error(e, "createprofile.js");
        return interaction.reply({ content: "Fehler beim Ausführen.", ephemeral: true });
    }
};
