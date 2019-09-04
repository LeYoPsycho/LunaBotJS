// main.js

let config          = require('./config.js');
let TwitterPackage  = require('twitter');
let fs              = require('fs');
let _               = require('lodash');

let Twitter         = new TwitterPackage(config);

let LunaAccountID   = '1129913281563496448';
let JonasAccountID  = '855035380105609216';
let MarvinAccountID = '1140983156696203264';
let DenizAccountID  = '4283257161';

let FactInterval    = 86400000;

console.log('Bot has started');

CreateStream();

function readFacts() {

}

function PostFact() {

}

function CreateStream() {
    //Create stream object
    let stream = Twitter.stream('statuses/filter', {follow: DenizAccountID});

    //Catch data event
    stream.on('data', (event) => {
        console.log('received data from stream');
        //doTheFunnyStuff(event);
        console.log(event);
    });

    //Catch error event
    stream.on('error', (error) => {
        console.log("Error:", error);
    });
    console.log("Waiting for server answer...");
}

function doTheFunnyStuff(responseObject) {
    //Check if server answer is independent tweet
    if (isTweet(responseObject)) {
        let statusString = '@' + responseObject.user.screen_name + ' Luna, ruhe jeds!';
        console.log('Independent tweet found, reply with sentence now...')
        Twitter.post('statuses/update', {status: statusString, in_reply_to_status_id: responseObject.id_str}, (error, data, response) => {
            if (error) {
                console.log("Error:", error);
            } else {
                console.log('Sentence "' + data.text + '" successfully posted');
                Twitter.post('favorites/create', {id: responseObject.id_str})
                .then((tweet) => {
                    console.log("Tweet successfully liked");
                })
                .catch((error) => {
                    console.log("Tweet could not be liked");
                });
            }
        });
    } else {
        console.log("Server answer is no independent tweet");
    }
}

function doTheMarvinStuff(responseObject) {
    if (isTweetOrReply(responseObject)) {
        let statusString = '@marvin20094 Marvin, ruhe jetzt! Kinder müssen jetzt ins Bett. Schlaf gut, Marvin!';
        console.log('Marvin has done stuff, now is the time for my funny stuff');
        Twitter.post('statuses/update', {status: statusString, in_reply_to_status_id: responseObject.id_str}, (error, data, response) => {
            if (error) {
                console.log("Error:", error);
            } else {
                console.log('Sentence "' + data.text + '" successfully posted');
            }
        });
    } else {
        console.log('Server answer is no Tweet or Reply');
    }
}

function isTweet(responseObject) {
    if(responseObject.in_reply_to_user_id_str == null && responseObject.retweeted_status == null) {
        return true;
    } else {
        return false;
    }
} 

function isTweetOrReply(responseObject) {
    if (responseObject.in_reply_to_user_id_str) {
        return false;
    } else {
        return true;
    }
}