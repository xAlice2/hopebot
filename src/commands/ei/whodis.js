const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const tools = require("../../utils/tools");

module.exports = {
  callback: async (client, interaction) => {
    const searchWord = interaction.options.getString("query").toLowerCase();
    const isEphemeral = interaction.options.getBoolean("hidden") || false;

    if(searchWord.startsWith("secretsay ")) {
      await interaction.reply({ content: '\u200b', ephemeral: true}).then(async () => await interaction.deleteReply())
      await interaction.channel.send(interaction.options.getString("query").slice("secretsay ".length))
      return
    }

    const user = require("../../schemas/user");
    const groupSchema = require("../../schemas/group");
    const matchingEntries = await user.find({
      $or: [
        {
          discordName: {
            $regex: `${searchWord}.*`,
            $options: "i",
          },
        },
        {
          IGN: {
            $regex: `${searchWord}.*`,
            $options: "i",
          },
        },
        {
          ID: {
            $regex: `${searchWord}.*`,
            $options: "i",
          },
        },
      ],
    });

    console.log(`++++++++++++++++++++++++++++++++++++++++++++++`);
    console.log(`Lookup command results:`);
    console.log(`Command run by: ${interaction.user.username}`);
    console.log("Matching entries:", JSON.stringify(matchingEntries, null, 2));
    console.log("searchWord:", JSON.stringify(searchWord, null, 2));

    try {
      if (matchingEntries.length === 0) {
        await interaction.reply({
          content: `No matching entries found for \`${searchWord}\`.`,
          ephemeral: isEphemeral,
        });
        return;
      } else if (matchingEntries.length > 3) {
        const count = matchingEntries.length;

        await interaction.reply({
          content: `Too many entries found (${count}) for \`${searchWord}\`. Please refine your search.`,
          ephemeral: isEphemeral,
        });
        return;
      } else if (matchingEntries.length > 1) {
        const entriesList = matchingEntries
          .map((entry) => `${entry.discordName} - ${entry.IGN}`)
          .join("\n* ");

        await interaction.reply({
          content: `*Multiple entries found, please refine your search. (Discord name - IGN):* \n* ${entriesList}`,
          ephemeral: isEphemeral,
      });
        return;
      }

      matchingEntries.forEach(async (entry) => {
        const { group, discordName, ID, IGN, farmerRole, grade, EB, SE, PE } = entry;

        const mainChannel = await groupSchema.findOne({ name: group })
        const channelName = mainChannel ? mainChannel.channelName : "Unknown"

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
              value: `${tools.EBtoEBWithLetter(EB)}%`,
              inline: true,
            },
            {
              name: "SE",
              value: `${tools.EBtoEBWithLetter(SE, 5)}`,
              inline: true,
            },
            {
              name: "PE",
              value: String(PE),
              inline: true
            },
            {
              name: "Grade",
              value: `${grade.toUpperCase()}`,
            },
            {
              name: "Group",
              value: group + " - #" + channelName,
            }
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

  name: "whois",
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
