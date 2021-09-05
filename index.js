const { Client, Intents } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

const { readdirSync } = require("fs");

const handlers = readdirSync("./handlers/").filter((f) => f.endsWith(".js"));

handlers.forEach((hanlder) => {
  require(`./handlers/${hanlder}`)(client);
});

client.login('MjcwMDc0OTgxNzAwOTkzMDI0.WHsU7Q.tY_YF61g1HLSjniFFZq5QR3olR4');