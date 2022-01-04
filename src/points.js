/*
    This file will handle all the functional commands for the points system
*/

const Viewer = require('../Models/Viewer')

function handlePointCommand(usrnm, msg) {
    const msgArr = msg.split(' ')
    if(msgArr[0] == ';redeem') {
        const redeemAmount = parseInt(msgArr[1])

        return Viewer.findOne({
            where: {
                username: usrnm
            }

        }).then(usrData => {
            if(usrData.points < redeemAmount)
                return `@${usrnm}, you do not have enough points!`

            else if(isNaN(redeemAmount))
                return `@${usrnm}, that is not a number. You tryna fool the gnome?`

            else {
                usrData.points -= redeemAmount
                usrData.save()
                return `@${usrnm} redeemed ${redeemAmount} points! and currently now has ${usrData.points}`
            }
            
        }).catch(err => {
            console.log(err)
            return `@${usrnm}, something went wrong....`
        })
    }
}

module.exports = handlePointCommand