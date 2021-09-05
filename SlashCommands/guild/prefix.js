const { Client, Interaction } = require("discord.js");

module.exports = {
  name: "prefix",
  description: "change bot prefix",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  // just for telling that u can also add options
  execute: async (client, interaction) => {
    try {
      interaction.reply({content: "Prefix Command is Not Ready Yet"});
    } catch (err) {
      console.log("Something Went Wrong => ",err);
    }
  },
};