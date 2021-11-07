const { SlashCommandBuilder } = require("@discordjs/builders");
const CRUD = require("../handlers/Database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delpfp")
        .setDescription("Delete your Profile Picture"),
    async execute(interaction) {
        const id = interaction.member.id;
        if (await CRUD.read(id)) CRUD.del(id);
        await interaction.reply({
            content: "Your profile picture has been removed",
            ephemeral: true,
        });
    },
};
