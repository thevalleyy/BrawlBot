const config = require("../../config.json");
const mysql = require("mysql2");
const util = require("util");
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");

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
    if (!interaction.isChatInputCommand()) return;
    const user = interaction.options.get("user")?.user || interaction.user;

    try {
        await db(`SELECT * FROM profile WHERE dcid = ${user.id}`).then(async (res) => {
            if (!res[0]) {
                if (user.id == interaction.user.id) {
                    const buttonList = [new ButtonBuilder().setCustomId("createProfile").setLabel("Erstellen").setStyle("Primary").setEmoji("📝")];
                    const row = new ActionRowBuilder().addComponents(buttonList);
                    return interaction.reply({ content: "Du hast noch kein Profil.", components: [row], ephemeral: true });
                } else {
                    return interaction.reply({ content: `\`${user.tag}\` hat noch kein Profil.`, ephemeral: true });
                }
            }

            const embed = new EmbedBuilder()
                .setTitle("Profil von " + user.tag)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields([
                    {
                        name: "Brawlstars ID",
                        value: res[0].bsid,
                        inline: true,
                    },
                    {
                        name: "Registriert seit",
                        value: `<t:${Math.floor(res[0].regdate / 1000)}:D>`,
                        inline: true,
                    },
                ])
                .setFooter({
                    text: "ID: " + res[0].id,
                    iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setTimestamp()
                .setColor(config.color.default);

            interaction.reply({ embeds: [embed] });
            //TODO: bearbeiten button einfügen, brawlstars name einfügen, wenn bot einem server joint, dann db eintrag erstellen, brawlerliste automatisch aktualisieren
        });
    } catch (e) {
        client.error(e, "profile.js");
        return interaction.reply({ content: "Fehler beim Ausführen des Ausdrucks.", ephemeral: true });
    }
};
