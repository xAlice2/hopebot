const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const tools = require("../../utils/tools");
// const fs = require("fs");

module.exports = {
  callback: async (client, interaction) => {
    console.log("+++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+");
    console.log("+ Updating user data...");
    console.log(
      `+ User data update command run by ${
        interaction.user.tag
      } at: ${new Date().toLocaleString()}`
    );
    console.log("+");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++");

    const ownerId = process.env.OWNER_ID;

    if (interaction.user.id !== ownerId) {
      return interaction.reply({
        content: "Sorry, this command can only be run by Alice.",
        ephemeral: false,
      });
    }
    // await interaction.reply("Please wait, user database is being updated.");

    // Send the initial reply with the loading bar
    const loadingMessage = await interaction.reply(
      "Please wait, user database is being updated.\n:rooster::rooster::rooster::rooster:"
    );

    try {
      const response = await fetch(
        "https://eiapi-production.up.railway.app/allMaj"
      );
      const userData = await response.json();

      //   await tools.updateUsersWithProgress(userData);

      // Update users in the database
      await tools.updateUsersWithProgress(userData, loadingMessage);

      // Edit the reply with the final message
      await interaction.editReply("All user data successfully updated!");
      // await interaction.editReply("All user data successfully updated!");
    } catch (error) {
      console.log(error);

      interaction.reply({
        content: "Something went wrong.",
      });
    }
  },

  name: "updatewhois",
  description: "Updates the user database. Restricted command.",
};
