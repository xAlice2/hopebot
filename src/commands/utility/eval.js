const { SlashCommandBuilder } = require("@discordjs/builders");
const { ApplicationCommandOptionType, } = require("discord.js");
const math = require("mathjs");

/**
 *  Go here to read up on units acceptable:
 * https://mathjs.org/docs/datatypes/units.html
 *
 *  *Note: scratchpad not supported.
 *
 *  TODO: adjust so that it can handle C & F instead of degC & degF
 */

module.exports = {
  callback: async (client, interaction) => {
    let input = interaction.options.getString("expression");

    try {
      const evaluated = math.evaluate(input);
      await interaction.reply({ content: `The answer is \`${evaluated}\`` });
    } catch (e) {
      interaction.reply({
        content: `Something went wrong. Unable to evaluate expression \`${input}\`.`,
      });
    }
  },

  name: "calculate",
  description: "Calculates a given expression",
  options: [
    {
      name: "expression",
      description: "eg. 1.2 / (3.3 + 1.7)  or  10 degC to degF",
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
