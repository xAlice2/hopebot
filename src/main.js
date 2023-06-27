require("dotenv").config();
const {
  Client,
  IntentsBitField,
  Partials,
} = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const mongoose = require('mongoose');


// Create a new client instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

(async () => {
  try {

    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGODB_URI, { keepAlive: true });
    console.log('Connected to DB.');

    if(process.argv[2] == 'test')
      await client.login(process.env.TEST_TOKEN);
    else
      await client.login(process.env.TOKEN);
    eventHandler(client);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})()

process.on('SIGINT', async function () { 
  await mongoose.disconnect().then(() => {
    console.log("Disconnected from DB.")  
  })
  await (await client.users.fetch(process.env.USER_ALERT_UPTIME)).send(`${client.user.tag} is shutting down.`)
  process.exit(0)
  //schedule.gracefulShutdown().then(() => process.exit(0))
})
