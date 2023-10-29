const Discord = require("discord.js");
const config = require("../../config.json");
const fs = require("node:fs");

module.exports = async (client, interaction) => {
    const allCommands = client.cmdlist;

    if (interaction.isAutocomplete()) {
        const filtered = allCommands.filter((choice) => choice.includes(interaction.options.getFocused().toLowerCase())).slice(0, 25);
        await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
        return;
    }

    const iconurl = interaction.guild.iconURL();
    if (interaction.options._subcommand == "about") {
        const embed1 = new Discord.EmbedBuilder()
            .setColor(config.color["default"])
            .setTitle("Hilfe-Menü")
            .setTimestamp()
            .setFooter({
                text: interaction.guild.name,
                iconURL: interaction.guild.iconURL(),
            })
            .addFields([
                {
                    name: "Über mich",
                    value: "Hi! Mithilfe von mir kannst du Statistiken, Infos, Brawler, und noch viel mehr von deinem BrawlStars-Profil anzeigen. \nFür Hilfe zu den Commands kannst du gerne </help command:1167571429760442495> verwenden. \nFür mehr Infos: </ping:1167571429970161664>. \nBei Bugs bitte mir eine DM senden, danke :) \nViel Spaß!",
                    inline: true,
                },
                {
                    name: "​",
                    value: "**Mitgeholfen bei der Umsetzung dieses Bots haben:**",
                    inline: false,
                },
                {
                    name: "🧠 thevalleyy",
                    value: "Programmierung, Konzeption, Umsetzung",
                    inline: true,
                },
                {
                    name: "🖥️ Chaoshosting",
                    value: "Bereitstellung des Servers.",
                    inline: true,
                },
            ]);
        interaction.reply({ embeds: [embed1] });
        return;
    }

    if (interaction.options._subcommand == "command") {
        const cmd = interaction.options._hoistedOptions[0].value.toString();
        const cmdjson = client.cmds[cmd + ".js"];
        if (!cmdjson) return interaction.reply({ content: "Dieser Befehl existiert nicht.", ephemeral: true });

        const embed = new Discord.EmbedBuilder().setTitle(`/${cmd}`).setColor(config.color["default"]);

        embed.addFields([
            {
                name: "Beschreibung",
                value: cmdjson.data.description ? `\`\`\`${cmdjson.data.description.toString()}\`\`\`` : `\`\`\`Keine\`\`\``,
                inline: true,
            },
        ]);

        if (cmdjson.data.default_member_permissions) {
            embed.addFields([
                {
                    name: "Berechtigungen",
                    value: `\`\`\`${new Discord.PermissionsBitField(cmdjson.data.default_member_permissions.toString()).toArray()}\`\`\``,
                    inline: true,
                },
            ]);
        }

        d = Number(cmdjson.cooldown ? cmdjson.cooldown : config.cooldown_standard);
        var h = Math.floor(d / 3600);
        var m = Math.floor((d % 3600) / 60);
        var s = Math.floor((d % 3600) % 60);

        var hDisplay =
            +h > 0
                ? +h == 1
                    ? +m > 0
                        ? `eine Stunde, `
                        : +h == 1
                        ? `eine Stunde`
                        : `${h} Stunden`
                    : +m > 0
                    ? `${h} Stunden, `
                    : `${h} Stunden`
                : ``;
        var mDisplay =
            +m > 0
                ? +m == 1
                    ? +s > 0
                        ? `eine Minute, `
                        : +m == 1
                        ? `eine Minute`
                        : `${m} Minuten`
                    : +s > 0
                    ? `${m} Minuten, `
                    : `${m} Minuten`
                : ``;
        var sDisplay = +s > 0 ? (+s == 1 ? `eine Sekunde` : `${s} Sekunden`) : ``;

        embed.addFields([
            {
                name: "Cooldown",
                value: `\`\`\`${hDisplay + mDisplay + sDisplay}\`\`\``,
                inline: true,
            },
        ]);

        embed.addFields([
            {
                name: "DM-Permission",
                value: cmdjson.data.dm_permission ? `<:checkmarkEmbed:1168247147033014353>` : `<:crossEmbed:1168247150174543982>`,
                inline: true,
            },
        ]);

        fs.stat("./events/slash-commands/" + cmdjson.data.name + ".js", async (err, stats) => {
            if (err) {
                client.error(err, "help.js");
                await embed.addFields([
                    {
                        name: "Filesize (code)",
                        value: `\`\`\`n/a\`\`\``,
                        inline: true,
                    },
                ]);
            } else {
                await embed.addFields([
                    {
                        name: "Filesize (code)",
                        value: `\`\`\`${await stats.size} bytes\`\`\``,
                        inline: true,
                    },
                ]);
            }

            fs.stat("./scommands/" + cmdjson.data.name + ".js", async (err, stats) => {
                if (err) {
                    client.error(err, "help.js");
                    await embed.addFields([
                        {
                            name: "Filesize (builder)",
                            value: `\`\`\`n/a\`\`\``,
                            inline: true,
                        },
                    ]);
                } else {
                    await embed.addFields([
                        {
                            name: "Filesize (builder)",
                            value: `\`\`\`${await stats.size} bytes\`\`\``,
                            inline: true,
                        },
                    ]);
                }

                // i dont fucking know why i have to add the code here, it just works

                if (cmdjson.data.options[0]) {
                    // there are options
                    const optionList = [];
                    let options = "";

                    if (cmdjson.data.options[0].options) {
                        // this is a nested command
                        for (let i = 0; i < cmdjson.data.options.length; i++) {
                            const option = cmdjson.data.options[i];
                            optionList.push(option);
                        }

                        optionList.map((option) => {
                            options += `/${cmdjson.data.name} ${option.name}: ` + `\n\tBeschreibung: ${option.description} `;

                            if (option.options[0]) {
                                option.options.map((subOption) => {
                                    options +=
                                        `\n\t${subOption.name}: ` +
                                        `\n\t\tBeschreibung: ${subOption.description} ` +
                                        `\n\t\tTyp: ${subOption.type
                                            .toString()
                                            .replace("11", "Anhang")
                                            .replace("10", "Nummer")
                                            .replace("9", "Rolle oder Benutzer")
                                            .replace("8", "Rolle")
                                            .replace("7", "Kanal")
                                            .replace("6", "Benutzer")
                                            .replace("5", "Boolescher Wert")
                                            .replace("4", "Integer")
                                            .replace("3", "Zeichenfolge")
                                            .replace("2", "SubcommandGroup")
                                            .replace("1", "Subcommand")} ` +
                                        `\n\t\tErforderlich: ${subOption.required ? "Ja" : "Nein"} ` +
                                        `${subOption.choices ? "\n\t\tAuswahlmöglichkeiten: Ja" : ""} ` +
                                        `${subOption.autocomplete ? "\n\t\tAutocomplete: Ja" : ""} \n\n`;
                                });
                            }
                        });
                    } else {
                        for (let i = 0; i < cmdjson.data.options.length; i++) {
                            const option = cmdjson.data.options[i];
                            optionList.push(option);
                        }

                        optionList.map((option) => {
                            options +=
                                `${option.name}: ` +
                                `\n\tBeschreibung: ${option.description} ` +
                                `\n\tTyp: ${option.type
                                    .toString()
                                    .replace("11", "Anhang")
                                    .replace("10", "Nummer")
                                    .replace("9", "Rolle oder Benutzer")
                                    .replace("8", "Rolle")
                                    .replace("7", "Kanal")
                                    .replace("6", "Benutzer")
                                    .replace("5", "Boolescher Wert")
                                    .replace("4", "Integer")
                                    .replace("3", "Zeichenfolge")
                                    .replace("2", "SubcommandGroup")
                                    .replace("1", "Subcommand")} ` +
                                `\n\tErforderlich: ${option.required ? "Ja" : "Nein"} ` +
                                `${option.choices ? "\n\tAuswahlmöglichkeiten: Ja" : ""} ` +
                                `${option.autocomplete ? "\n\tAutocomplete: Ja" : ""} \n\n`;
                        });
                    }

                    embed.addFields([
                        {
                            name: cmdjson.data.options.length > 1 ? "Argumente" : "Argument",
                            value: `\`\`\`${options}\`\`\``,
                        },
                    ]);
                } else {
                    embed.addFields([
                        {
                            name: "Argumente",
                            value: "```Keine```",
                            inline: true,
                        },
                    ]);
                }

                embed
                    .setFooter({
                        text: interaction.guild.name,
                        iconURL: iconurl,
                    })
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
            });
        });
    }
    return;
};
