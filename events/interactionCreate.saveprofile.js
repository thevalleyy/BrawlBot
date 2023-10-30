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
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== "createProfileModal") return;

    const user = interaction.user;
    const bsid = interaction.fields.getTextInputValue("profileInput").toString().toLowerCase().replace("#", "");

    try {
        await db(`SELECT * FROM profile WHERE dcid = ${user.id}`).then(async (res) => {
            if (res[0]) return interaction.reply({ content: "Du hast bereits ein Profil.", ephemeral: true });

            // check if bsid is valid
            await fetch("https://brawltime.ninja/de/profile/" + bsid).then(async (res) => {
                if (res.status !== 200) return interaction.reply({ content: "Ungültige Profil ID.", ephemeral: true });

                await db(`INSERT INTO profile (dcid, regdate, bsid) VALUES (?, ?, ?)`, [user.id, Date.now().toString(), bsid]).then(async (res) => {
                    if (!res) return interaction.reply({ content: "Fehler beim Erstellen des Profils.", ephemeral: true });
                    return interaction.reply({
                        content: "Profil erfolgreich erstellt. Sieh es dir mit </profile:1168518938729123900> an!",
                        ephemeral: true,
                    });
                });
            });
        });
    } catch (e) {
        client.error(e, "saveprofile.js");
        return interaction.reply({ content: "Fehler beim Ausführen.", ephemeral: true });
    }
};
