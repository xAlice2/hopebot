const { Client, Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		// uncomment the line below to force namechange on startup
		// client.user.setUsername("Keeper");
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

