// const { REST } = require("@discordjs/rest");
// const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


/**
 *  Template
 */

module.exports = {
  data: new SlashCommandBuilder()
    .setName("updatewhois")
    .setDescription("Updates the list of users currently in the group."),

  async execute(interaction, client) {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++")
    console.log("+")
    console.log("+ Updating user data...")
    console.log(`+ User data update command run by ${interaction.user.tag} at: ${new Date().toLocaleString()}`);
    console.log("+")
    console.log("+++++++++++++++++++++++++++++++++++++++++++++")

    const ownerId = process.env.OWNER_ID;

    if (interaction.user.id !== ownerId) {
      return interaction.reply({
        content: "Sorry, this command can only be run by Alice.",
        ephemeral: false, 
      });
    }

    try {
      const response = await fetch("https://eiapi-production.up.railway.app/allMaj");
      const data = await response.json();
      fs.writeFileSync("src/data/maj.json", JSON.stringify(data, null, 2));

      await interaction.reply("User data updated successfully!");

    } catch (error) {
      console.log(error);

      interaction.reply({
        content: `Something went wrong.`,
      });
    }
  },
};
