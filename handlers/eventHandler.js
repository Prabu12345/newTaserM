const {readdirSync} = require("fs");

module.exports = (client) => {
  const eventsDirs = readdirSync("./events")

  eventsDirs.forEach(evtDir => {
    const eventsFiles = readdirSync(`./events/${evtDir}/`).filter(f => f.endsWith(".js"))

    eventsFiles.forEach(file => {
      const event = require(`../events/${evtDir}/${file}`);
      const eventName = file.split(".")[0].trim();

      client.on(eventName, event.bind(null, client))
    })
  })
}