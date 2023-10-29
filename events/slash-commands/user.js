const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    let isMember = false;
    const user = interaction.options.getUser("user") || interaction.user;

    if (interaction.guild.members.cache.get(user.id) != undefined) {
        isMember = true;
        var member = interaction.options.get("user")?.member || interaction.member;
    }

    await client.users.fetch(user.id, { force: true });

    const embed = new Discord.EmbedBuilder()
        .setThumbnail(user.avatarURL({ size: 4096 }))
        .setAuthor({
            name: user.username,
            url: `https://discord.com/users/${user.id}`,
            iconURL: user.avatarURL(),
        })
        .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
        })
        .setTimestamp()
        .addFields([
            { name: "Erwähnung", value: user.toString(), inline: true },
            { name: "Tag", value: "`" + user.tag + "`", inline: true },
            { name: "Bot", value: user.bot ? "✅" : "❌", inline: true },
            { name: "ID", value: "`" + user.id + "`", inline: true },
            {
                name: "Erstellt",
                value: `<t:${Math.round(user.createdTimestamp / 1000)}:R>`,
                inline: true,
            },
            {
                name: "Avatar",
                value: user.avatarURL() ? `[Link](${user.avatarURL({ size: 4096 })})` : "Kein Avatar",
                inline: true,
            },
            {
                name: "Badges",
                value:
                    user.flags.bitfield == 0
                        ? "Keine Badges"
                        : user.flags
                              .toArray()
                              .join(" ")
                              .replace("HypeSquadOnlineHouse2", "<:Hypesquad_brilliance_badge:1168291211874934834>")
                              .replace("HypeSquadOnlineHouse1", "<:Hypesquad_bravery_badge:1168291218585829386>")
                              .replace("HypeSquadOnlineHouse0", "<:Hypesquad_balance_badge:1168291210604056698>")
                              .replace("ActiveDeveloper", "<:ActiveDeveloperBadge:1168291219835728002>")
                              .replace("Staff", "<:Discordstaff:1168291213934350437>")
                              .replace("Partner", "<:DiscordPartnerBadge:1168291228652146839>")
                              .replace("BugHunterLevel1", "<:Bug_hunter_badge:1168291217252024380>")
                              .replace("BugHunterLevel2", "<:Bug_buster_badge:1168291232817098903>")
                              .replace("PremiumEarlySupporter", "<:Early_supporter_badge:1168291328006832188>")
                              .replace(
                                  "VerifiedBot",
                                  "<:9142discordverifiedbot1fromvega:1168291415353217075><:3099discordverifiedbot2fromvega:1168291227448381450>"
                              )
                              .replace("VerifiedDeveloper", "<:Verified_developer_badge:1168291221861564507>")
                              .replace("CertifiedModerator", "<:Moderator_Programs_Alumni:1168291223342157884>")
                              .replace("Hypesquad ", "<:HypeSquad_Event_Badge:1168291215289094245>"),

                inline: true,
            },
        ]);

    console.log(user.flags.toArray());
    if (user.hexAccentColor) {
        embed.addFields([
            {
                name: "hexAccentColor",
                value: user.hexAccentColor.toString(),
                inline: true,
            },
        ]);

        embed.setColor(user.hexAccentColor);
    }

    if (user.bannerURL()) {
        embed.addFields([
            {
                name: "Banner",
                value: `[Link](${user.bannerURL({ size: 4096 })})`,
                inline: true,
            },
        ]);
        embed.setImage(user.bannerURL({ size: 4096 }));
    }

    if (isMember) {
        if (member.premiumSinceTimestamp != null && member.premiumSinceTimestamp > Date.now())
            embed.addFields([
                {
                    name: "Boostet seit",
                    value: `<t:${Math.round(member.premiumSinceTimestamp / 1000)}:R>`,
                    inline: true,
                },
            ]);
        if (member.communicationDisabledUntilTimestamp != null && member.communicationDisabledUntilTimestamp > Date.now())
            embed.addFields([
                {
                    name: "Timeout läuft ab",
                    value: `<t:${Math.round(member.communicationDisabledUntilTimestamp / 1000)}:R>`,
                    inline: true,
                },
            ]);

        embed.addFields([
            {
                name: "Nickname",
                value: "`" + member.displayName + "`",
                inline: true,
            },
            {
                name: "Beigetreten",
                value: `<t:${Math.round(member.joinedTimestamp / 1000)}:R>`,
                inline: true,
            },

            {
                name: "Bannbar?",
                value: member.bannable ? "✅" : "❌",
                inline: true,
            },
            {
                name: "Kickbar?",
                value: member.kickable ? "✅" : "❌",
                inline: true,
            },
            {
                name: "Managebar?",
                value: member.manageable ? "✅" : "❌",
                inline: true,
            },
            {
                name: "Moderierbar?",
                value: member.moderatable ? "✅" : "❌",
                inline: true,
            },
            {
                name: "Regeln akzeptiert?",
                value: member.pending ? "❌" : "✅",
                inline: true,
            },

            {
                name: "Berechtigungen",
                value: "```" + member.permissions.toArray().join(", ") + "```",
                inline: false,
            },
            {
                name: "Rollen",
                value: member.roles.cache.map((role) => role.toString()).join(", "),
                inline: false,
            },
        ]);
    }
    interaction.reply({ embeds: [embed] });
};
