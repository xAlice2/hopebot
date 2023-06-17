const {
  Interaction,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  callback: async ( Client, interaction) => {
    console.log(`running uptime command`);

    const ms = interaction.client.uptime;
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (1000 * 60)) % 60).toString();
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
    const uptime = `${days}d ${hrs}h ${min}m ${sec}s`;

    console.log(`Uptime command run. Current uptime is: ${uptime}`);

    await interaction.reply(`I have been online for: *${uptime}*`);
  },

  name: "uptime",
  description: "Replies with bot uptime.",
};
