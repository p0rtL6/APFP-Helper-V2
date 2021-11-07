const { SlashCommandBuilder, userMention } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fetch = require("node-fetch");

const urlParams = [
    "images.unsplash.com",
    "i.imgur.com",
    "cdn.discordapp.com",
    "media.discordapp.net",
]; // Whitelisted Urls

module.exports = {
    data: new SlashCommandBuilder() // Actual command, referenced for use in other files
        .setName("pfp")
        .setDescription("Request a Profile Picture")
        .addStringOption(option =>
            option
                .setName("static")
                .setDescription("Your static image link")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("animated")
                .setDescription("Your animated image link")
                .setRequired(true)
        ),
    async execute(interaction) {
        // Handle interaction from dispatch
        const { user } = interaction;

        const blacklisted = interaction.member.roles.cache.some(
            role => role.name === "APFP Blacklist"
        ); // Checks if user has privelege to request
        if (blacklisted)
            return interaction.reply({
                content: "You are blacklisted from requesting",
                ephemeral: true,
            });

        const static = interaction.options.getString("static");
        const animated = interaction.options.getString("animated");

        var staticUrl;
        var animatedUrl;

        try {
            // Check validity of Url before use, also allows for easier parsing
            staticUrl = new URL(static);
        } catch {
            return interaction.reply({
                content: "Static link is invalid",
                ephemeral: true,
            });
        }
        try {
            // Check validity of Url before use, also allows for easier parsing
            animatedUrl = new URL(animated);
        } catch {
            return interaction.reply({
                content: "Animated link is invalid",
                ephemeral: true,
            });
        }

        if (urlParams.indexOf(staticUrl.host) === -1)
            return interaction.reply({
                content: "Static link is not whitelisted",
                ephemeral: true,
            }); // Check whitelist
        if (urlParams.indexOf(animatedUrl.host) === -1)
            return interaction.reply({
                content: "Animated link is not whitelisted",
                ephemeral: true,
            }); // Check whitelist

        // Fetch image url and check content type to ensure a valid image
        const staticRes = await fetch(staticUrl);
        if (staticRes.headers.get("content-type").split("/")[0] !== "image")
            return interaction.reply({
                content: "Static Link is not a valid image",
                ephemeral: true,
            });
        const animatedRes = await fetch(animatedUrl);
        if (animatedRes.headers.get("content-type").split("/")[0] !== "image")
            return interaction.reply({
                content: "Animated Link is not a valid image",
                ephemeral: true,
            });

        const embed = new MessageEmbed()
            .setColor("#FFFFFF")
            .setAuthor(user.id, user.avatarURL(true))
            .setThumbnail(staticUrl)
            .setImage(animatedUrl)
            .setDescription("Request created for " + userMention(user.id));

        // Approve / Deny buttons
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("approve")
                .setLabel("Approve")
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId("deny")
                .setLabel("Deny")
                .setStyle("DANGER")
        );

        const logChannel = interaction.guild.channels.cache.find(
            channel => channel.name === "apfp-log"
        ).id;
        const channel = interaction.guild.channels.cache.get(logChannel);
        await interaction.reply({
            content: `Your background request has been created and can be viewed in <#${logChannel}>`,
            ephemeral: true,
        });
        await channel.send({ embeds: [embed], components: [row] });
    },
};
