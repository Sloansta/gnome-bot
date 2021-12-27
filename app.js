require('dotenv').config()
const tmi = require('tmi.js')
const commands = require('./commands.json')
const chan = process.env.TWITCH_CHANNEL

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

    if(randomNum(20) <= 1)
        client.say(chan, `@${tags.username} OwO`)

    console.log(msg)
    if(msg.charAt(0) == "!") {
        for(let i = 0; i < commands.length; i++) {
            if(commands[i].title.toLowerCase() == msg.toLowerCase())
                 client.say(chan, `@${tags.username}, ${commands[i].message}`)
        }
     }
})

// function for things other than commands 
function randomNum(x) {
    return Math.floor(Math.random() * x)
}