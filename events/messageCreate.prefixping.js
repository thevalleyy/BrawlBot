const Discord = require("discord.js");
module.exports = (client, message) => {
    if (message.author.bot || message.guild === null || message.channel.type == Discord.ChannelType.DM) return;

    if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) {
        message.reply(
            `Hallo \`${message.author.username}\`, ich nutze **Slash-Commands**! \nFür weitere Infos, nutze </help about:1167571429760442495>`
        );
    }
};
