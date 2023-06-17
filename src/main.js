require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");
const eventHandler = require("./handlers/eventHandler");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

(async () => {
  try {
    //   mongoose.set('strictQuery', false);
    //   mongoose.connect(process.env.MONGODB_URI, { keepAlive: true });
    //   console.log('Connected to DB.');

    if (process.argv[2] == "test") await client.login(process.env.TEST_TOKEN);
    else await client.login(process.env.TOKEN);
    eventHandler(client);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();

/**
   * Mongo stuff 
   * 
   
  process.on('SIGINT', async function () { 
    await mongoose.disconnect().then(() => {
      console.log("Disconnected from DB.")  
    })
    process.exit(0)
    //schedule.gracefulShutdown().then(() => process.exit(0))
  })

   */
