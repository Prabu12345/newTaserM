module.exports = {
    name: "ping",
    descrption: "Replies with Pong!",
    execute: async (client, message, args, PREFIX) => {
      message.channel.send("Pong!");
    }
  }