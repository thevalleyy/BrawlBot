const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDMPermission(false)
        .setDescription("Gibt das gespeicherte Profil eines Benutzers oder das eigene aus.")
        .setDescriptionLocalizations({
            "en-US": "Shows the saved profile of a user or your own.",
            "en-GB": "Shows the saved profile of a user or your own.",
        })

        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Der Benutzer, dessen Profil angezeigt werden soll.")
                .setDescriptionLocalizations({
                    "en-US": "The user to show the profile of.",
                    "en-GB": "The user to show the profile of.",
                })
                .setRequired(false)
        ),
};
