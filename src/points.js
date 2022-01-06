/*
    This file will handle all the functional commands for the points system
*/

const Viewer = require('../Models/Viewer');

// function that allows the user to redeem points and then fetches their remaining points
function redeemPoints(usrnm, amount) {
  const redeemAmount = parseInt(amount);

  return Viewer.findOne({
    where: {
      username: usrnm,
    },
  })
    .then((usrData) => {
      if (usrData.points < redeemAmount)
        return `@${usrnm}, you do not have enough points!`;
      else if (isNaN(redeemAmount))
        return `@${usrnm}, that is not a number. You tryna fool the gnome?`;
      else {
        usrData.points -= redeemAmount;
        usrData.save();
        return `@${usrnm} redeemed ${redeemAmount} points! and currently now has ${usrData.points}`;
      }
    })
    .catch((err) => {
      console.log(err);
      return `@${usrnm}, something went wrong....`;
    });
}

// function that fetches the users points from the database or, fetches points of a different user given otherUser isn't undefined
function getPoints(user, otherUser = '') {
    if(otherUser == '') {
        return Viewer.findOne({ where: { username: user }})
        .then(usrData => {
            return `@${user} currently has ${usrData.points} points!`
        }).catch(err => {
            console.log(err)
            return `Could not find ${user}`
        })
    } else {
        return Viewer.findOne({ where: { username: otherUser }})
        .then(usrData => {
            return `@${user}, ${otherUser} currently has ${usrData.points} points!`
        }).catch(err => {
            console.log(err)
            return `@${user}, could not find ${otherUser}`
        })
    }
}

// function will allow users to send points to other users given that the user exists
function sendPoints(user, amt, otherUser) {
    const amount = parseInt(amt)
    return Viewer.findOne({ where: { username: user }})
        .then(usrData => {
            if(isNaN(amount))
                return `@${user}, why are you trying to send ${otherUser} a non-number? You confuse the gnome..`

            return Viewer.findOne({ where: { username: otherUser.toLowerCase() }})
                .then(otherUsrData => {
                    if(usrData.points < amount)
                        return `@${user}, you do not have that many points, cmon lol`

                    usrData.points -= amount
                    usrData.save()
                    otherUsrData.points += amount
                    otherUsrData.save()

                    return `Pog! @${user} sent ${otherUser} ${amount} points!`
                    
                })
                .catch(err => {
                    console.log(err)
                    return `@${user}, the gnome couldn't find ${otherUser}..`
                })
        })
        .catch(err => {
            console.log(err)
            return `Something went wrong with that command, @${user}.. You have embarassed the gnome.`
        })
}

module.exports = {
    redeemPoints,
    getPoints,
    sendPoints
};
