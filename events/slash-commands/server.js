const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const guild = interaction.guild;
    await guild.fetch();
    await guild.bans.fetch().catch(() => {});
    await guild.scheduledEvents.fetch().catch(() => {});

    let amountOfWebhooks = 0;
    await guild
        .fetchWebhooks()
        .then((webhooks) => (amountOfWebhooks = webhooks.size))
        .catch(console.error);

    if (!guild.available)
        return interaction.reply({
            content: "Der Server ist aktuell nicht erreichbar.",
            ephemeral: true,
        });

    const embed = new Discord.EmbedBuilder()
        .setThumbnail(guild.iconURL({ size: 4096 }))
        .setColor(config.color["default"])
        .setAuthor({
            name: guild.name,
            url: `https://discord.com/channels/${guild.id}`,
            iconURL: guild.iconURL(),
        })
        .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
        })
        .setTimestamp()
        .addFields([
            { name: "Name", value: guild.name, inline: true },
            { name: "ID", value: "`" + guild.id + "`", inline: true },
            { name: "Beschreibung", value: guild.description || "Keine vorhanden", inline: true },
            {
                name: "Erstellt",
                value: `<t:${Math.round(guild.createdTimestamp / 1000)}:R>`,
                inline: true,
            },
            { name: "Besitzer", value: `<@${guild.ownerId}>`, inline: true },
            {
                name: "Serversprache",
                value: `:flag_${guild.preferredLocale.replace("en-", "").toLowerCase()}:`,
                inline: true,
            },
            {
                name: "Max. Mitglieder",
                value: "`" + guild.maximumMembers + "`",
                inline: true,
            },
            {
                name: "Mitglieder",
                value: "`" + guild.memberCount + "`",
                inline: true,
            },
            {
                name: "Kanäle",
                value: "`" + guild.channels.cache.size + "`",
                inline: true,
            },
            {
                name: "Emojis",
                value: "`" + guild.emojis.cache.size + "`",
                inline: true,
            },
            {
                name: "Sticker",
                value: "`" + guild.stickers.cache.size + "`",
                inline: true,
            },
            {
                name: "Events",
                value: "`" + guild.scheduledEvents.cache.size + "`",
                inline: true,
            },
            {
                name: "Webhooks",
                value: "`" + amountOfWebhooks + "`",
                inline: true,
            },
            {
                name: "Bans",
                value: "`" + guild.bans.cache.size + "`",
                inline: true,
            },
            {
                name: "Boosts",
                value: "`" + `${guild.premiumSubscriptionCount} (Lvl: ${guild.premiumTier})` + "`",
                inline: true,
            },
            {
                name: "Shard-ID",
                value: "`" + `${guild.shard.id} (${guild.shard.ping}ms)` + "`",
                inline: true,
            },
            {
                name: "Bitrate",
                value: "`" + `${guild.maximumBitrate}kbps` + "`",
                inline: true,
            },
            {
                name: "Akronym",
                value: "`" + guild.nameAcronym + "`",
                inline: true,
            },
            {
                name: "Discord-Partner?",
                value: guild.partnered ? "✅" : "❌",
                inline: true,
            },
            {
                name: "Discord-Verifiziert?",
                value: guild.verified ? "✅" : "❌",
                inline: true,
            },
        ]);

    if (guild.vanityURLCode)
        embed.addFields([{ name: "Vanity-Code", value: `[${guild.vanityURLCode}](https://discord.gg/${guild.vanityURLCode})`, inline: true }]);

    embed.addFields([
        {
            name: "Rollen",
            value: guild.roles.cache.map((role) => role.toString()).join(", "),
            inline: false,
        },
        {
            name: "Features",
            value: guild.features.length ? "```" + guild.features.join(", ") + "```" : "Keine vorhanden",
            inline: false,
        },
    ]);

    interaction.reply({ embeds: [embed] });
};
