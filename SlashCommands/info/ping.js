const { Client, Interaction } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Get Ping of Bot",
  type: "CHAT_INPUT",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
      const mesg = await interaction.reply({ content: "Pong!", fetchReply: true });

      await interaction.editReply({ content: `Pong!\nBot Latency: \`${mesg.createdTimestamp - interaction.createdTimestamp}ms\`, Websocket Latency: \`${client.ws.ping}ms\`` });
    } catch (err) {
      console.log("Something Went Wrong => ", err);
    }
  },
};