/**
 * Created by Helen on 08.07.2017.
 
process.env["NTBA_FIX_319"] = 1;*/
var TelegramBot = require('node-telegram-bot-api');
var authModule = require('./config');
var TelegramToken = authModule.TelegramToken;//'446870696:AAHjg7_5VN_hwwP21oIWMvQDZqUWukwVXhU';
var bot = new TelegramBot(TelegramToken, {polling: true});
var request = require("request");
var langTO='en';


var YT_token = authModule.YT_token;//'trnsl.1.1.20170504T180134Z.b9ccf53264e138fd.3d51a5a8a3f7c8b790704622cfb4d1ddf71f1a5b';
var YT_CommonUrl = 'https://translate.yandex.net/api/v1.5/tr.json';


 bot.onText(/\/setlang (.+)/, function (msg, match) {
    var chatId = msg.from.id;
    var langWantTO = match[1].trim();
    //console.log(langWantTO+'  '+msg);

    var yaLangListRequest= YT_CommonUrl+'/getLangs?key='+YT_token+'&ui='+langWantTO;
    console.log(yaLangListRequest);

    var message = '';
    var num = 0;
    var supportedLangs;

    LangListReq(yaLangListRequest,function(langs) { supportedLangs=langs; 
        if (supportedLangs[langWantTO] == '') { bot.sendMessage(chatId,'Выбранный Вами язык не поддерживается');}
        else  { console.log(supportedLangs[langWantTO]);  
                langTO = langWantTO;
                bot.sendMessage(chatId,'Язык на который будет осуществляться перевод изменен на - '+supportedLangs[langWantTO]);}
    });
});


/*send translation of received message on any message /(.+)/*/
bot.onText(/(^(?!\/).+)/, function (msg, match) {
    var chatId = msg.from.id;
    var text = msg.text;
    
    //console.log(text.replace(/(\r\n|\n|\r)/gm," "));
    //text = text.replace(/(\r\n|\n|\r)/gm," ");
    //var yaLangListRequest= 'https://translate.yandex.net/api/v1.5/tr/getLangs?key='+YT_token+'&ui='+langTO;

    var yaTransRequest = YT_CommonUrl+'/translate?key='+YT_token+'&text='+encodeURI(text);
    yaTransRequest+='&lang='+langTO;
    console.log(langTO+yaTransRequest);

        TransReq(yaTransRequest,function(translation) {
            if (translation == '') { bot.sendMessage(chatId,'по вашему запросу - \"'+ text +'\" - ничего не нашлось'); } 
            else {bot.sendMessage(chatId,/*'('+langTO+')'+' '+*/''+translation);} 
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
        else  {callback(null);}
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
        else  { callback(null);}
    });
};

