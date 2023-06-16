const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, EmbedBuilder } = require("discord.js");
let { data } = require("../../data/maj.json");
const { convertToLargeNumber, convertToDecimalNumber } = require("../../utils/countDigits.js");

const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Returns data pertaining to the matched user.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription(
          'Partial words are acceptable. e.g., "/Jan*" for JaneDoe.'
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const searchWord = interaction.options.getString("query");
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
        await interaction.reply(`No matching entries found for \`${searchWord}\`.`);
        return;
      }

      if (matchingEntries.length > 1) {
        const entriesList = matchingEntries
          .map((entry) => `${entry.discordName} - ${entry.IGN}`)
          .join("\n");

          await interaction.reply(`*Multiple entries found, please refine your search.*\n${entriesList}`);
          return;
      }

      matchingEntries.forEach((entry) => {
        const { discordName, ID, IGN, farmerRole, grade, EB } = entry;
        // const convertedEB = convertToDecimalNumber(EB.toString()).toFixed(2);
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
            },
            {
              name: "Farmer Role",
              value: `${farmerRole}`,
            },
            {
              name: "EB",
              value: `${EB}`,
            },
            {
              name: "Grade",
              value: `${grade.toUpperCase()}`,
            },
            {
              name: "IGN",
              value: `${IGN}`,
            }
          )

          .setThumbnail("https://i.imgur.com/2Fo1vQd.png")
          .setColor("#ffc800")
          .setFooter({
            text: `${interaction.user.username}`,
            iconURL: "https://i.imgur.com/cjcaNo0.png",
          })
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "Something went wrong.",
      });
    }
  },
};

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("lookup")
//     .setDescription("Returns data pertaining to the matched user.")
//     .addStringOption((option) =>
//       option
//         .setName("query")
//         .setDescription(
//           'Wildcards are acceptable. e.g., looking for JaneDoe with "/Jan*"'
//         )
//         .setRequired(true)
//     ),
//   async execute(interaction) {
//     const searchQuery = interaction.options.getString("query");
//     const jsonFile = require("../../data/maj.json"); // Load the JSON file

//     const matchingEntries = jsonFile.filter((entry) => {
//       const { discordName, ID, IGN } = entry;
//       return (
//         discordName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         IGN?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     });

//     console.log(`++++++++++++++++++++++++++++++++++++++++++++++`)
//     console.log(`lookup command results:`)
//     console.log(`Matching entries: ${matchingEntries}`)
//     console.log(`searchQuery: ${searchQuery}`)
//     console.log(`jsonFile: ${jsonFile}`)

//     try {
//       if (matchingEntries.length === 0) {
//         await interaction.reply("No matching entries found.");
//         return;
//       }

//       matchingEntries.forEach((entry) => {
//         const { discordName, ID, IGN, farmerRole, grade, EB } = entry;

//         const embed = new MessageEmbed()
//           .setTitle("Search Results")
//           .addField("ID", ID)
//           .addField("Discord Name", discordName)
//           .addField("Farmer Role", farmerRole)
//           .addField("EB", EB.toString())
//           .addField("Grade", grade)
//           .addField("IGN", IGN);

//         interaction.reply({ embeds: [embed] });
//       });
//     } catch (error) {
//         console.error('Lookup command failed:', error);
//       interaction.reply({
//         content: `Something went wrong. ${error.message}`,
//       });
//     }
//   },
// };

// Command to search the JSON file
// const searchCommand = new SlashCommandBuilder()
//   .setName('lookup')
//   .setDescription('Searches the JSON file for entries')
//   .addStringOption(option =>
//     option.setName('query')
//       .setDescription('The search query')
//       .setRequired(true));

// client.on('interactionCreate', async (interaction) => {
//   if (!interaction.isCommand() || interaction.commandName !== 'lookup') return;

//   const searchQuery = interaction.options.getString('query');
//   const jsonFile = require('src/data/maj.json'); // Load the JSON file

//   const matchingEntries = jsonFile.filter(entry => {
//     const { discordName, ID, IGN } = entry;
//     return (
//       discordName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       IGN.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   });

//   if (matchingEntries.length === 0) {
//     await interaction.reply('No matching entries found.');
//     return;
//   }

//   matchingEntries.forEach(entry => {
//     const {
//       discordName,
//       ID,
//       IGN,
//       farmerRole,
//       grade,
//       EB
//     } = entry;

//     const embed = new Discord.MessageEmbed()
//       .setTitle('Search Results')
//       .addField('ID', ID)
//       .addField('Discord Name', discordName)
//       .addField('Farmer Role', farmerRole)
//       .addField('EB', EB.toString())
//       .addField('Grade', grade)
//       .addField('IGN', IGN);

//     await interaction.reply({ embeds: [embed] });
//   });
// });

// Register the slash command
// client.on('ready', async () => {
//   try {
//     await client.guilds.cache.get('your_guild_id').commands.set([searchCommand.toJSON()]);
//   } catch (error) {
//     console.error('Failed to register slash command:', error);
//   }
// });
