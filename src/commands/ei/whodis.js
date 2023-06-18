const { SlashCommandBuilder } = require("@discordjs/builders");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const tools = require("../../utils/tools");
let { data } = require("../../data/maj.json");
const fs = require("fs");

module.exports = {
  callback: async (client, interaction) => {
    const searchWord = interaction.options.getString("query");
    const isEphemeral = interaction.options.getBoolean("ephemeral") || false;

    const jsonFile = require("../../data/maj.json");

    const matchingEntries = jsonFile.filter((entry) => {
      const { discordName = "", ID = "", IGN = "" } = entry;
      return (
        discordName.toLowerCase().includes(searchWord.toLowerCase()) ||
        ID.toLowerCase().includes(searchWord.toLowerCase()) ||
        IGN.toLowerCase().includes(searchWord.toLowerCase())
      );
    });

    console.log(`++++++++++++++++++++++++++++++++++++++++++++++`);
    console.log(`Lookup command results:`);
    console.log(`Command run by: ${interaction.user.username}`);
    console.log("Matching entries:", JSON.stringify(matchingEntries, null, 2));
    console.log("searchWord:", JSON.stringify(searchWord, null, 2));
    // console.log(JSON.stringify(jsonFile, null, 2));

    try {
      if (matchingEntries.length === 0) {
        await interaction.reply(
          `No matching entries found for \`${searchWord}\`.`
        );
        return;
      } else if (matchingEntries.length > 3) {
        const count = matchingEntries.length;

        await interaction.reply(
          `Too many entries found (${count}) for \`${searchWord}\`. Please refine your search.`
        );
        return;
      } else if (matchingEntries.length > 1) {
        const entriesList = matchingEntries
          .map((entry) => `${entry.discordName} - ${entry.IGN}`)
          .join("\n* ");

        await interaction.reply(
          `*Multiple entries found, please refine your search. (Discord name - IGN):* \n* ${entriesList}`
        );
        return;
      } 

      matchingEntries.forEach(async (entry) => {
        const { discordName, ID, IGN, farmerRole, grade, EB } = entry;
        // const convertedEB = tools.EBtoEBWithLetter(EB);
        // console.log(`convertedEB: ${convertedEB}`)

        const embed = new EmbedBuilder()
          .setTitle("Search Results")
          .addFields(
            {
              name: "Discord ID",
              value: `<@${ID}>`,
            },
            {
              name: "Discord Name",
              value: `${discordName}`,
              inline: true,
            },
            {
              name: "IGN",
              value: `${IGN}`,
              inline: true,
            },
            {
              name: "Farmer Role",
              value: `${farmerRole}`,
              inline: false,
            },
            {
              name: "EB",
              value: `${await tools.EBtoEBWithLetter(EB)}%`,
              inline: false,
            },
            {
              name: "Grade",
              value: `${grade.toUpperCase()}`,
              inline: false,
            },
            // {
            //   name: "EB",
            //   value: `${await tools.EBtoEBWithLetter(EB)}%`,
            // }
          )

          .setThumbnail("https://i.imgur.com/2Fo1vQd.png")
          .setColor("#ffc800")
          .setFooter({
            text: `${interaction.user.username}`,
            iconURL: "https://i.imgur.com/gL8tTYn.png",
          })
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: isEphemeral });
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "Something went wrong.",
      });
    }
  },

  name: "whodis",
  description: "Returns data pertaining to the matched query.",
  options: [
    {
      name: "query",
      description:
        'Partial words are acceptable, case insensitive. e.g., "jan" for JaneDoe.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "hidden",
      description: "Choose whether the response should be hidden.",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
};
