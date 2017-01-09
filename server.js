"use strict";
const express = require('express');
const app = express();
const twitter = require('twitter');
const keys = require('./env.js');
const sentiment = require('sentiment');
const _ = require('lodash');
const moment = require('moment');
const firebase = require('firebase');


//node server connection
const server = app.listen(keys.ports.node_port, () => {
  console.log('listening on port:'+ keys.ports.node_port);
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


//array representing roads and their coordinates
var Roadarray = [{
road: 'Muranga',
lat: -1.2692651,
lon: 36.8319739
},
{
road: 'Kangemi',
lat:-1.2692739,
lon:36.7495519
},
{
road:'jogoo',
lat: -1.2977564,
lon:36.8699819
},
{
road:'Naivasha',
lat:-1.2809229,
lon:36.7366022
},
{
road:'Mombasa',
lat:-1.329856,
lon:36.8726665
},
{
road:'Banda',
lat:-1.3673224,
lon:36.7675825
},
{
road:'Rongoi',
lat:-0.1705283,
lon:35.8552598
},
{
road:'matatu',
lat:-1.21909,
lon:36.7387533
},
{
road:'Thika',
lat:-1.2296072,
lon:36.8797007
},
{
road:'Magadi',
lat:-1.3966855,
lon:36.7488186
},
{
road:'Karai',
lat:-1.2556684,
lon:36.6255869
},
{
road:'kenol',
lat:-1.3690902,
lon:37.2256372
},
{
road:'nalvasha',
lat: -0.7171778,
lon:36.4310251
},
{
road:'kinungi',
lat:-0.8027911,
lon:36.5331781
},
{
road:'ngong',
lat:-1.299507,
lon:36.790264
},
{
road:'langata',
lat:-1.3363068,
lon:36.7757238
},
{
road:'Waiyaki',
lat:-1.2629683,
lon:36.7646968
},
{
road:'Uhuru',
lat:-1.2879084,
lon:36.8181147
},
{
road:'university',
lat:-1.2812349,
lon:36.8162432
},
{
road:'Likoni',
lat:-4.0929017,
lon:39.6614446
}];

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
twit.stream('statuses/filter', {'track':'ma3Route'}, function (stream) {
  stream.on('data', function(data){
     var tweet = JSON.stringify(data.text);
      for (var i=0; i<Roadarray.length; i++){
        if(_.includes(tweet,Roadarray[i].road)== true){
          var s = sentiment(tweet);
          var currdatetime = moment().format('MMMM Do YYYY, h:mm:ss a');
          var sentimentanalysis;
          if(s.score == 0){
            sentimentanalysis = "neutral";
          }
          else if(s.score < 0){
            sentimentanalysis = "negative";
          }
          else if(s.score > 0){
            sentimentanalysis = "positive"
          }
        var tweetObject = {
          text:tweet,
          timestamp: currdatetime,
          sentiment: sentimentanalysis,
          lat:Roadarray[i].lat,
          lon:Roadarray[i].lon
        }

          var newTweetKey = firebase.database().ref().child('tweets').push().key;

          //Socket.io display tweets on HTML Page
          io.emit("tweet", tweetObject);

          var updates = {};
          updates['/tweets/'+ newTweetKey] = tweetObject;

          //save the tweet to firebase db
          Fdatabase.ref().update(updates);
          console.log(currdatetime);

          console.log(Roadarray[i].road);
          console.log(Roadarray[i].lat+"lon:"+Roadarray[i].lon);
          console.log("Tweet: "+ tweet);
          console.log("Sentiment: "+ s.score)
        }
      }
      
      //Retweets sentiment analysis
      if((data.retweeted_status != undefined)){
        var retweet = JSON.stringify(data.retweeted_status.text);
       for (var i=0; i<Roadarray.length; i++){
        if(_.includes(retweet,Roadarray[i].road)){
          var s = sentiment(retweet);
          var currdatetime = moment().format('MMMM Do YYYY, h:mm:ss a');
          var sentimentanalysis;
          if(s.score == 0){
            sentimentanalysis = "neutral";
          }
          else if(s.score < 0){
            sentimentanalysis = "negative";
          }
          else if(s.score > 0){
            sentimentanalysis = "positive"
          }
        var tweetObject = {
          text:retweet,
          timestamp: currdatetime,
          sentiment: sentimentanalysis,
          lat:Roadarray[i].lat,
          lon:Roadarray[i].lon
        }

          //Socket.io display tweets on HTML Page
          io.emit("tweet", tweetObject);

          var updates = {};
          updates['/tweets/'+ newTweetKey] = tweetObject;

          //save the tweet to firebase db
          Fdatabase.ref().update(updates); 
         
          console.log(currdatetime);
          console.log("Retweet: "+ retweet);
          console.log("Sentiment: "+ s.score)
          console.log(Roadarray[i].lat+"lon:"+Roadarray[i].lon);
        }
      }
      }
  });
  stream.on('error', function(error){
    console.log("error occured:"+ error);
  });
});



