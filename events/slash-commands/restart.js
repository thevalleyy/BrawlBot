const config = require("../../config.json");
const process = require("process");
const { spawn } = require("child_process");

module.exports = (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.user.id != config.owner)
        return interaction.reply({
            content: "Du hast keine Berechtigung, diesen Befehl auszuführen.",
            ephemeral: true,
        });

    interaction.reply("Neustart wird ausgeführt...").then(() => {
        // restart script

        const commandToRestart = "npm run start";

        const child = spawn(commandToRestart, {
            shell: true,
            detached: true,
            stdio: "ignore",
        });

        // Unreference the child process to allow the current process to exit
        child.unref();

        // Exit the current process
        process.exit();
    });
};
