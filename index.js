/**
 * Created by Helen on 08.07.2017.
 
process.env["NTBA_FIX_319"] = 1;*/
var TelegramBot = require('node-telegram-bot-api');
var token = '446870696:AAHjg7_5VN_hwwP21oIWMvQDZqUWukwVXhU';
var bot = new TelegramBot(token, {polling: true});
var request = require("request");
var langTO='en';

var YT_token = 'trnsl.1.1.20170504T180134Z.b9ccf53264e138fd.3d51a5a8a3f7c8b790704622cfb4d1ddf71f1a5b';
var YT_CommonUrl = 'https://translate.yandex.net/api/v1.5/tr.json';


 bot.onText(/\/setlang (.+)/, function (msg, match) {
    var chatId = msg.from.id;
    langTO = match[1];
    console.log(msg);
    bot.sendMessage(chatId,'Язык на который будет осуществляться перевод изменен на - '+langTO);
});


/*send translation of message on any message /(.+)/*/
bot.onText(/(^(?!\/).+)/, function (msg, match) {
    var userId = msg.from.id;
    var text = msg.text;
    
    //console.log(text.replace(/(\r\n|\n|\r)/gm," "));
    //text = text.replace(/(\r\n|\n|\r)/gm," ");
    //var yaLangListRequest= 'https://translate.yandex.net/api/v1.5/tr/getLangs?key='+YT_token+'&ui='+langTO;

    var yaTransRequest = YT_CommonUrl+'/translate?key='+YT_token+'&text='+encodeURI(text);
    yaTransRequest+='&lang='+langTO;
    console.log(langTO+yaTransRequest);

        TransReq(yaTransRequest,function(translation) {
            if (translation == '') { bot.sendMessage(userId,'по вашему запросу - \"'+ text +'\" - ничего не нашлось'); } 
            else {bot.sendMessage(userId,'('+langTO+')'+' '+translation);} 
        });
});





function TransReq(url, callback){
    var resp =  request({
        url: url,
        json: true
    },  function getResp (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body.text);
        }
        else  {
            //bot.sendMessage(userId,'по вашему запросу - '+ text +' - ничего не нашлось');
            callback(null);}
    });
};


bot.onText(/\/getlang/, function (msg, match) {
    var chatId = msg.from.id;

    var yaLangListRequest= YT_CommonUrl+'/getLangs?key='+YT_token+'&ui='+langTO;
    console.log(yaLangListRequest);

    var message = '';
    var num = 0;

    LangListReq(yaLangListRequest,function(langs) {

        for (var key in langs) {
          // этот код будет вызван для каждого свойства объекта
          // ..и выведет имя свойства и его значение
          num++;
          message+= key + " - " + langs[key] +'\n';  
          console.log( "Код языка: " + key + " Язык: " + langs[key] );
        }
           // bot.sendMessage(chatId, message); 
            bot.sendMessage(chatId, message); 
        });
});

function LangListReq(url, callback){
    var resp =  request({
        url: url,
        json: true
    },  function getResp (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body.langs);
        }
        else  {
            //bot.sendMessage(userId,'по вашему запросу - '+ text +' - ничего не нашлось');
            callback(null);}
    });
};

