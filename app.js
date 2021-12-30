require('dotenv').config()
const tmi = require('tmi.js')
const commands = require('./commands.json')
const Viewer = require('./Models/Viewer')
const db = require('./config/connection')
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

    if(randomNum(50) <= 1)
        client.say(chan, `@${tags.username} OwO`)

    console.log(msg)
    if(msg.charAt(0) == "!") {
        for(let i = 0; i < commands.length; i++) {
            if(commands[i].title.toLowerCase() == msg.toLowerCase())
                 client.say(chan, `@${tags.username}, ${commands[i].message}`)
        }
     }

     if(msg.toLowerCase() == ';points')
        getPoints(tags.username).then(data => {
            client.say(chan, data)
        })
})

// get this function working, points should be displayed when user types command
function getPoints(user) {
    return Viewer.findOne({ where: {username: user}})
        .then(usrData => {
            return `${user} currently has ${usrData.points} points!`
        }).catch(err => {
            console.log(err)
            return `Could not find ${user}`
        })
}

// function that checks if the viewer is already in the database or not
function checkViewerExist(username) {
    return Viewer.count({ where: {username: username}})
        .then(count => {
            if(count != 0)
                return true
            return false
        })
}

// function for things other than commands 
function randomNum(x) {
    return Math.floor(Math.random() * x)
}