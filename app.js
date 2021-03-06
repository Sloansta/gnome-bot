require('dotenv').config()
const tmi = require('tmi.js')
const commands = require('./commands.json')
const Viewer = require('./Models/Viewer')
const db = require('./config/connection')
const { redeemPoints, getPoints, sendPoints } = require('./src/points')
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

db.sync({ force: false }).then(() => {
    client.connect().catch(console.error)
})

client.on('message', (channel, tags, msg, self) => {
    if(self) return

    checkViewerExist(tags.username).then(data => {
        if(data) {
            // this will increment a users points if the user exists, eventually
           Viewer.findOne({
               where: {username: tags.username}
           }).then(usr => {
               if(msg.charAt(0) != '!' && msg.charAt(0) != ';') 
                    usr.points++

               usr.save()
           })

         } else {
            Viewer.create({
                username: tags.username,
                points: 0
            }).then(dbViewerData => console.log(dbViewerData))
              .catch(err => {
                  console.log(err)
              })
        }
    })

    // just for fun lol
    if(randomNum(50) <= 1)
        client.say(chan, `@${tags.username} OwO`)

    console.log(msg)
    if(msg.charAt(0) == "!") {
        for(let i = 0; i < commands.length; i++) {
            if(commands[i].title.toLowerCase() == msg.toLowerCase())
                 client.say(chan, `@${tags.username}, ${commands[i].message}`)
        }
     }

    // checks to see if a functional command is being called ';'
    if(msg.charAt(0) == ';') {
        const msgArr = msg.split(' ')
        functionCommands(tags.username, msgArr)
    }

})

// function that checks if the viewer is already in the database or not
function checkViewerExist(username) {
    return Viewer.count({ where: {username: username}})
        .then(count => {
            if(count != 0)
                return true
            return false
        })
}

// function that is called when a functional command is indicated ';'
function functionCommands(usr, msgArr) {
    switch(msgArr[0]) {
        case ';redeem':
            redeemPoints(usr, msgArr[1]).then(data => {
                client.say(chan, data)
            })
            break
        case ';points':
            if(msgArr.length == 1) {
                getPoints(usr).then(data => {
                    client.say(chan, data)
                })
            } else {
                const otherUser = msgArr[1].toLowerCase()
                getPoints(usr, otherUser).then(data => {
                    client.say(chan, data)
                })
            }
            break
        case ';send':
            const receivingUser = msgArr[2].toLowerCase()
            const amount = msgArr[1]
            sendPoints(usr, amount, receivingUser).then((data) => {
            client.say(chan, data)
            })
            break
        default: 
            client.say(chan, `@${usr}, that is not a valid command!`)
            break
    }
}
// function for things other than commands 
function randomNum(x) {
    return Math.floor(Math.random() * x)
}