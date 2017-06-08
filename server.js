"use strict";
const express = require('express');
const app = express();
const twitter = require('twitter');
const keys = require('./env.js');
const sentiment = require('sentiment');
const _ = require('lodash');
const moment = require('moment');
const firebase = require('firebase');
const roadsObj = require('./config/roads.json');

let Roadarray = [];
for (let road in roadsObj) {
  Roadarray.push({ road: road, lat: roadsObj[road].lat, lon: roadsObj[road].lon })
}

//node server connection
const server = app.listen(keys.ports.node_port, () => {
  console.log('listening on port:' + keys.ports.node_port);
});

//socket Io connection
var io = require('socket.io').listen(server);

//Firebase db connection
var Fdb = firebase.initializeApp({
  apiKey: keys.firebase.apiKey,
  authDomain: keys.firebase.authDomain,
  databaseURL: keys.firebase.databaseURL,
  storageBucket: keys.firebase.databaseURL,
  messagingSenderId: keys.firebase.messagingSenderId
});

var Fdatabase = Fdb.database();

app.use(express.static('public'));

//establish socket connection
io.sockets.on('connection', function () {
  console.log("CONNECTED !");
});

var twitterkeys = {
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
};

// Twitter streaming and Sentiment Analysis
const twit = new twitter(twitterkeys);
twit.stream('statuses/filter', { 'track': 'ma3Route' }, function (stream) {
  stream.on('data', function (data) {
    var tweet = JSON.stringify(data.text);
    for (var i = 0; i < Roadarray.length; i++) {
      if (_.includes(tweet, Roadarray[i].road) == true) {
        var s = sentiment(tweet);
        var currdatetime = moment().format('h:mm:ss a');
        var timeSec = moment().format('x');
        var sentimentanalysis;
        if (s.score == 0) {
          sentimentanalysis = "neutral";
        }
        else if (s.score < 0) {
          sentimentanalysis = "negative";
        }
        else if (s.score > 0) {
          sentimentanalysis = "positive"
        }
        var tweetObject = {
          text: tweet,
          timestamp: currdatetime,
          time: timeSec,
          sentiment: sentimentanalysis,
          name: Roadarray[i].road,
          lat: Roadarray[i].lat,
          lon: Roadarray[i].lon
        }

        var newTweetKey = firebase.database().ref().child('tweets').push().key;

        //Socket.io display tweets on HTML Page
        io.emit("tweet", tweetObject);

        //save the tweet to firebase db
        var updates = {};
        updates['/tweets/' + newTweetKey] = tweetObject;
        Fdatabase.ref().update(updates);

        //log results to command line
        console.log(currdatetime);
        console.log(Roadarray[i].road);
        console.log(Roadarray[i].lat + "lon:" + Roadarray[i].lon);
        console.log("Tweet: " + tweet);
        console.log("Sentiment: " + s.score)

        setTimeout(function () {
          location.reload()
        }, 2000);
      }
    }

    //Retweets sentiment analysis
    // if((data.retweeted_status != undefined)){
    //   var retweet = JSON.stringify(data.retweeted_status.text);
    //  for (var i=0; i<Roadarray.length; i++){
    //   if(_.includes(retweet,Roadarray[i].road)){
    //     var s = sentiment(retweet);
    //     var currdatetime = moment().format('h:mm:ss a');
    //     var timeSec = moment().format('x');
    //     var sentimentanalysis;
    //     if(s.score == 0){
    //       sentimentanalysis = "neutral";
    //     }
    //     else if(s.score < 0){
    //       sentimentanalysis = "negative";
    //     }
    //     else if(s.score > 0){
    //       sentimentanalysis = "positive"
    //     }
    //   var tweetObject = {
    //     text:retweet,
    //     timestamp: currdatetime,
    //     time: timeSec,
    //     trial: trial,
    //     sentiment: sentimentanalysis,
    //     name:Roadarray[i].road,
    //     lat:Roadarray[i].lat,
    //     lon:Roadarray[i].lon
    //   }

    //     //Socket.io display tweets on HTML Page
    //     io.emit("tweet", tweetObject);

    //     //save the tweet to firebase db
    //     var updates = {};
    //     updates['/tweets/'+ newTweetKey] = tweetObject;
    //     Fdatabase.ref().update(updates); 

    //    // log results to command line
    //     console.log(currdatetime);
    //     console.log(trial);
    //     console.log("Retweet: "+ retweet);
    //     console.log("Sentiment: "+ s.score)
    //     console.log(Roadarray[i].lat+"lon:"+Roadarray[i].lon);
    //   }
    // }
    // }
  });

  // console log error
  stream.on('error', function (error) {
    console.log("error occured:" + error);
  });
});



