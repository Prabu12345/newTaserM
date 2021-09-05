module.exports = {
    name: "kick",
    descrption: "kicks The User!",
    execute: async (client, message, args, PREFIX) => {
      // check if no user specified
      if (!args[0]) {
        return message.channel.send(":x: Must Provide a User");
      }
  
      const userId = message.mentions.users.first().id;
      const userToKick = message.guild.members.cache.get(userId);
  
      if (!userToKick) {
        return message.channel.send(":x: Invalid User");
      }
  
      userToKick
        .kick({ reason: "Kicked by " + message.member.displayName })
        .then(() => {
          return message.channel.send(":white_check_mark: User Kicked Succesfully");
        })
        .catch((err) => {
          console.log(`Error => ${err}`);
          return message.channel.send(":x: Unable to kick the user");
        });
    },
  };