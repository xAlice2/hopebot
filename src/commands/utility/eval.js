const { SlashCommandBuilder } = require("@discordjs/builders");
const math = require("mathjs");

/**
 *  Go here to read up on units acceptable:
 * https://mathjs.org/docs/datatypes/units.html
 * 
 *  *Note: scratchpad not supported.
 */

module.exports = {
  data: new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Calculates a given expression")
    .addStringOption((option) =>
      option
        .setName("expression")
        .setDescription("eg. 1.2 / (3.3 + 1.7)  or  10 degC to degF")
        .setRequired(true)
    ),
  async execute(interaction, client) {
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
};
