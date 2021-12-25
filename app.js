require('dotenv').config()
const tmi = require('tmi.js')
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
    switch (msg) {
        case '!help':
            client.say(chan, `@${tags.username}, I'm a new bot, so
            I am currently working on the commands. Sorry about that :/ 
            If you need help, please talk to the gnome that is streaming!`)
            break;
    
        default:
            console.log(msg)
            break;
    }
})

// function for things other than commands 
function randomNum(x) {
    return Math.floor(Math.random() * x)
}