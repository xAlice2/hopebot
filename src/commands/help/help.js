const {
  SlashCommandBuilder,
  client,
  Interaction,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  callback: async (client, interaction) => {
    console.log(`running help command`);

    const embed = new EmbedBuilder()
      .setTitle("Command Glossary")
      .setDescription("List of available commands")
      .addFields(
        {
          name: "\u200B",
          value: " ",
        },
        {
          name: "/help",
          value: "dial 1-800-loonybin",
          inline: true,
        },
        {
          name: "/ping",
          value: "shows my ping delay",
          inline: true,
        },
        {
          name: "/calculate",
          value:
            "evaluates a given expression\n\n**eg.**\n*1.2 / (3.3 + 1.7)*\n*SUM(1,2,3,4,5)*\n*10 degC to degF*",
        }
      )
      .setThumbnail("https://i.imgur.com/0jp0UkD.png")
      .setColor("#ffc800")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },

  name: "help",
  description: "Shows a list of available commands",
};
