const { Interaction } = require("discord.js");


module.exports = {
  callback: async (interaction) => {
      const sent = await interaction.reply({ content: 'Pong! :flying_disc:', fetchReply: true });
      await interaction.editReply(`:ping_pong: PingPong!\n:stopwatch: Uptime: ${Math.round(interaction.client.uptime / 60000)} minutes\n:sparkling_heart: Websocket heartbeat: ${interaction.client.ws.ping}ms.\n:boomerang: Roundtrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  },

  name: "ping",
  description: "Plays ping pong with Keeper.",
};
