const blacklist = require("../../data/blacklist.json");
const config = require("../../config.json");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
        const user = interaction.options.get("user");
        if (!user) {
            if (blacklist.length == 0) return interaction.reply({ content: "Die Blacklist ist leer.", ephemeral: true });
            let text = "";
            blacklist.forEach((id) => {
                text += `* <@${id}> (${id})\n`;
            });

            return interaction.reply({ content: text.substring(0, 2048), ephemeral: true });
        }

        const id = user.user.id;

        if (id == config.owner || id == client.user.id)
            return interaction.reply({ content: `\`${user.user.username}\` kann nicht geblacklistet werden.`, ephemeral: true });
        if (blacklist.includes(id)) {
            const index = blacklist.indexOf(id);
            if (index > -1) blacklist.splice(index, 1);
            interaction.reply({ content: `\`${user.user.username}\` wurde von der Blacklist entfernt.`, ephemeral: true });
        } else {
            blacklist.push(id);
            interaction.reply({ content: `\`${user.user.username}\` wurde zur Blacklist hinzugefügt.`, ephemeral: true });
        }

        require("fs").writeFileSync("./data/blacklist.json", JSON.stringify(blacklist));
    } catch (e) {
        client.error(e, "blacklist.js");
    }
};
