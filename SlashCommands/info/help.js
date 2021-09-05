const { Client, Interaction } = require("discord.js");

module.exports = {
  name: "help",
  description: "Some Help To User",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  // just for telling that u can also add options
  execute: async (client, interaction) => {
    try {
      interaction.reply({content: "Help Command is Not Ready Yet", ephemeral: true});
    } catch (err) {
      console.log("Something Went Wrong => ",err);
    }
  },
};