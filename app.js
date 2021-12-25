require('dotenv').config()
const tmi = require('tmi.js')

const client = new tmi.Client({
    options: {debug: true, messageLogLevel: "info"},
    connection:  {
        reconnect: true,
        secure: true
    },

    identity: {
        username: `${process.env.TWITCH_USERNAME}`,
        password: `${process.env.TWITCH_OAUTH}`
    },
    channels: [`${process.env.TWITCH_CHANNEL}`]
})

client.connect().catch(console.error)

client.on('message', (channel, tags, msg, self) => {
    if(self) return

    console.log(msg)
})

// function for things other than commands 
function randomNum(x) {
    return Math.floor(Math.random() * x)
}