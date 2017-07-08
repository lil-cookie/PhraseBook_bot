/**
 * Created by Helen on 08.07.2017.
 */
var TelegramBot = require('node-telegram-bot-api');
var token = '446870696:AAHOCXd1SZ_qfo8t0FnR13MZP36nZAAM0ZE';
var bot = new TelegramBot(token, {polling: true});

/*
bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    console.log(msg);
    bot.sendMessage(chatId, "Hello!", {caption: "I'm a bot!"});
});
*/



bot.onText(/\/translate (.+)/, function (msg, match) {
    var userId = msg.from.id;
    var text = match[1];

    var yaDetectLangCommonUrl = 'https://translate.yandex.net/api/v1.5/tr.json/detect?key=trnsl.1.1.20170504T180134Z.b9ccf53264e138fd.3d51a5a8a3f7c8b790704622cfb4d1ddf71f1a5b&hint=en,ru&text=';
    var yaTransCommonUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170504T180134Z.b9ccf53264e138fd.3d51a5a8a3f7c8b790704622cfb4d1ddf71f1a5b&lang=ru-en&text=';

    var yaDetLangRequest = yaDetectLangCommonUrl+text;
    var yaTransRequest = yaTransCommonUrl+text;

    var request = require("request");

    function LangReq(url, callback){
        var resp =  request({
            url: url,
            json: true
        },  function getResp (error, response, body) {
            if (!error && response.statusCode === 200) {
                //  bot.sendMessage(userId,text+' - '+body.lang);
                callback(body.lang);
            }
            else  {
                //bot.sendMessage(userId,'по вашему запросу - '+ text +' - ничего не нашлось(');
                callback(null);}
        });
    };


    function TransReq(url, callback){
        var resp =  request({
            url: url,
            json: true
        },  function getResp (error, response, body) {
            if (!error && response.statusCode === 200) {
                //  bot.sendMessage(userId,text+' - '+body.lang);
                bot.sendMessage(userId,text+' - '+body.text);
                console.log(body);
                callback(body.text);
            }
            else  {
                //bot.sendMessage(userId,'по вашему запросу - '+ text +' - ничего не нашлось(');
                callback(null);}
        });
    };


   LangReq(yaDetLangRequest,function(lang) {
        bot.sendMessage(userId,text+' - '+lang);

       TransReq(yaTransRequest,function(translation) {
           //console.log(lang);
           bot.sendMessage(userId,text+' - '+translation[0]);
       });
    });

    //bot.sendMessage(userId,text+' - '+notes[0]);
    //if (resp.response.code==200) {bot.sendMessage(userId,text+' - '+resp.body.lang);}
   // else  {bot.sendMessage(userId,'К сожалению, по вашему запросу - '+ text +' - ничего не нашлось(');}
    //bot.sendMessage(userId,text+' - '+request);
   // var code = resp.code;

});




bot.onText(/\/test (.+)/, function (msg, match) {
    var userId = msg.from.id;
    var text = match[1];

    bot.sendMessage(userId,notes[0][text]);

    //bot.sendMessage(userId,text+' - '+notes[0]);
    //if (resp.response.code==200) {bot.sendMessage(userId,text+' - '+resp.body.lang);}
    // else  {bot.sendMessage(userId,'К сожалению, по вашему запросу - '+ text +' - ничего не нашлось(');}
    //bot.sendMessage(userId,text+' - '+request);
    // var code = resp.code;
});





/*var request = require('request');
 request(yaDetLangRequest, function (error, response, body) {
 json=body;
 console.log('error:', error); // Print the error if one occurred
 console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 console.log('body:', body); // Print the HTML for the Google homepage.
 });*/

