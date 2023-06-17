const { devs, prefix } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const { exec } = require("child_process");

module.exports = async (client, message) => {
  if (message.channel.id == '807641608538292254' && Math.floor(Math.random() * 1000) == 0) { //#the_majeggstics, 1 in 1000 chance to react with ✅
    await message.react('✅')
    await (await client.users.fetch('675476792475254815')).send(message.url)
  }
  if (!message.content.startsWith(prefix)) return;

  if (devs.includes(message.author.id) && message.content.toLowerCase().startsWith(prefix + "restart")) {
    await message.delete()

    return exec("pm2 restart Wonky", (error, stdout, stderr) => {
      if (error) return console.log(`Error restarting Wonky: ${error.message}`);
    });
  }

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === message.content.split(' ')[0].replace(prefix, '')
    );

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: 'Only developers are allowed to run this command.',
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.testOnly) {
      if (!(interaction.guild.id === process.env.TEST_SERVER)) {
        interaction.reply({
          content: 'This command cannot be ran here.',
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: 'Not enough permissions.',
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have enough permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }

    await commandObject.callback(client, message);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};
