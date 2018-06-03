/**
 * Created by Helen on 08.07.2017.
 */
var TelegramBot = require('node-telegram-bot-api');
var token = '446870696:AAHOCXd1SZ_qfo8t0FnR13MZP36nZAAM0ZE';
var bot = new TelegramBot(token, {polling: false});
var request = require("request");

/*костыль для автозапросов к серверу, возвращающих страничку с кодом 200.
с целью предотвращения падений по таймауту по обращениям к серверу на бесплатном хероку.*/
// берём Express
var express = require('express');
// создаём Express-приложение
var app = express();
// создаём маршрут для главной страницы
app.get('/autoget', function(req, res) {
    res.sendfile('somepage.html');
});
// запускаем сервер на порту 8080
app.listen(8080);



bot.onText(/\/t (.+)/, function (msg, match) {
    var userId = msg.from.id;
    var text = match[1];

    var yaDetectLangCommonUrl = 'https://translate.yandex.net/api/v1.5/tr.json/detect?key=trnsl.1.1.20170504T180134Z.b9ccf53264e138fd.3d51a5a8a3f7c8b790704622cfb4d1ddf71f1a5b';//&hint=en,ru';
    var yaTransCommonUrl = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170504T181631Z.5cffb45738337a99.d503a4cd6b54e2d3c09573b880a6e2803c481583';

    var yaDetLangRequest = yaDetectLangCommonUrl+'&text='+encodeURI(text);
    console.log('===='+yaDetLangRequest);
    var yaTransRequest = yaTransCommonUrl+'&text='+encodeURI(text);
    lang=null;

    LangReq(yaDetLangRequest,function GetYaTranslate (lang) {
        if (lang=='ru')
        {
            yaTransRequest+='&lang=ru-en';
            console.log(lang+  yaTransRequest);
        }
        else {
            yaTransRequest+= '&lang=en-ru';
            console.log( lang+ yaTransRequest);
        }

        //   bot.sendMessage(userId,text+' - '+lang);
        TransReq(yaTransRequest,function(def) {
            //console.log(lang);
            var message = '';

            def.forEach(function(item) {
                //var trs =;
                item.tr.forEach(function(item2) {
                    message+=item2.text+', ';
                });
            });
            message=message.slice(0,-2)
            bot.sendMessage(userId,text+' - '+message);
        });
    });



});





function LangReq(url, callback){
    var resp =  request({
        url: url,
        json: true
    },  function getResp (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('------'+body.lang);
            callback(body.lang);

        }
        else  {
            console.log('++++++'+body.code,body.lang);
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
            callback(body.def);
        }
        else  {
            //bot.sendMessage(userId,'по вашему запросу - '+ text +' - ничего не нашлось(');
            callback(null);}
    });
};