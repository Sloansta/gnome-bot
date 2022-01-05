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
function getPoints(user, otherUser) {
    if(otherUser == undefined) {
        return Viewer.findOne({ where: {username: user}})
        .then(usrData => {
            return `@${user} currently has ${usrData.points} points!`
        }).catch(err => {
            console.log(err)
            return `Could not find ${user}`
        })
    } else {
        return Viewer.findOne({ where: {username: otherUser}})
        .then(usrData => {
            return `@${user}, ${otherUser} currently has ${usrData.points} points!`
        }).catch(err => {
            console.log(err)
            return `@${user}, could not find ${otherUser}`
        })
    }
}

module.exports = {
    redeemPoints,
    getPoints
};
