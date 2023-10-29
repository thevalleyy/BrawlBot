const { ChannelType } = require("discord.js");
const Discord = require("discord.js");
const config = require("../config.json");

module.exports = async (client, message) => {
    if (message.channel.type !== ChannelType.DM) return;
    if (message.author.id == config.owner) return;
    if (message.author.bot) return;

    try {
        message.client.users.fetch(config.owner, false).then((user) => {
            const embedDM = new Discord.EmbedBuilder()
                .setTitle("Nachricht von " + message.author.username + ":")
                .setThumbnail(message.author.avatarURL())
                .setDescription(message.content.substring(0, 2048))
                .setFooter({
                    text: message.author.tag + ": " + message.author.id,
                })
                .setTimestamp()
                .setColor(config.color.default);

            user.send({ embeds: [embedDM] });
            message.react("📨");
        });
    } catch (error) {
        client.error(error, "dm.js");
    }
};
