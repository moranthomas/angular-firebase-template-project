var https = require('https');
var firebaseHost = "fir-database-quickstart-100fb.firebaseio.com";

function firebaseGet(key) {

    return new Promise((resolve, reject) => {

        var options = {
            hostname: firebaseHost,
            port: 443,
            path: key + ".json",
            method: 'GET'
        };

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                resolve(JSON.parse(body))
            });
        });
        req.end();
        req.on('error', reject);
    });
}

function firebasePut(key, value) {

    return new Promise((resolve, reject) => {

        var options = {
            hostname: firebaseHost,
            port: 443,
            path: key + ".json",
            method: 'PUT'
        };

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                resolve(body)
            });
        });
        req.end(JSON.stringify(value));
        req.on('error', reject);
    });
}


exports.handler = (event, context, callback) => {

    // this is the object we will return to Motion AI in the callback
    var responseJSON = {
        "response": "", // what the bot will respond with
        "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
        "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
        "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
        "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
        "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
        "nextModule": null // OPTIONAL: the ID of a module to follow this Node JS module
    }


    //Invoke PUT function
    //firebasePut("/users/userId/email", 'thomas@superman.com').then(data => {


    //Invoke GET function
    firebaseGet("/Articles").then(data => {

        //console.log('response received', data);
        //ALEX: quite horrible in my opinion, but that'll do for our POC
        // Transform response Object to Array of objects

        let articles = Object.keys(data).map((k) => data[k]);

        //Populate the bot cards so that it'll show the articles
        responseJSON.cards = [];

        articles.forEach(article => {
            // console.log('ARTICLE LOOP', responseJSON);
            responseJSON.cards.push({
                cardTitle: article.title,
                buttons: [{
                    buttonText: 'Read the post',
                    buttonType: 'url',
                    target: 'https://saascriptions.io'
                }]
            });

        });

        console.log('RESPONSE', responseJSON);



        // callback to return data to Motion AI (must exist, or bot will not work)
        callback(null, responseJSON);
        // callback to return data to Motion AI (must exist, or bot will not work)

    })


};
