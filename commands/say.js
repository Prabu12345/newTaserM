module.exports = {
    name: "say",
    description: "Says what to say",
    execute: async (client, message, args, PREFIX) => {
      // check if no values provided
      if (!args[0]) return;
  
      message.channel.send(args.join(" "));
    },
};