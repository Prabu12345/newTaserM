const mongoose = require("mongoose")

module.exports = async (client) => {
    console.log("Bot is Now Ready as", client.user.tag);
    await mongoose.connect('mongodb+srv://admin:lakilaki@cluster0.yvw90.mongodb.net/guaa?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}