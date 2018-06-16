/**
 * Created by Helen on 08.07.2017.
 
process.env["NTBA_FIX_319"] = 1;*/
var TelegramBot = require('node-telegram-bot-api');
var token = '446870696:AAHjg7_5VN_hwwP21oIWMvQDZqUWukwVXhU';
var bot = new TelegramBot(token, {polling: true});
var request = require("request");


bot.onText(/\/help (.+)/, function (msg, match) {
    
            bot.sendMessage(userId,'команды');
});

bot.onText(/\/ud (.+)/, function (msg, match) {
    var userId = msg.from.id;
    var text = match[1];

    var UDCommonUrl = 'http://api.urbandictionary.com/v0/define?term='

    var UDRequest = UDCommonUrl+encodeURI(text);
    console.log('===='+UDRequest);


        //   bot.sendMessage(userId,text+' - '+lang);
        UDReq(UDRequest,function(list) {
            //console.log(lang);
            var message = '';
            var num = 0;
            list.forEach(function(item) {
                    if (message.length+item.definition.length<4000) {
                    num++;
                    message+=num+'. '+item.definition+'\n';                       
                } else return false;
            });
            message=message.slice(0,-2)
            if (message == '') { bot.sendMessage(userId,'по вашему запросу - '+ text +' - ничего не нашлось'); } 
            else {  bot.sendMessage(userId,text+' - '+message);} 
        });
    });


bot.onText(/\/t (.+)/, function (msg, match) {
    var userId = msg.from.id;
    var text = match[1];

    var yaDetectLangCommonUrl = 'https://translate.yandex.net/api/v1.5/tr.json/detect?key=trnsl.1.1.20170504T180134Z.b9ccf53264e138fd.3d51a5a8a3f7c8b790704622cfb4d1ddf71f1a5b';//&hint=en,ru';
    var yaTransCommonUrl = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170504T181631Z.5cffb45738337a99.d503a4cd6b54e2d3c09573b880a6e2803c481583';
    //var yaTransCommonUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170504T180134Z.b9ccf53264e138fd.3d51a5a8a3f7c8b790704622cfb4d1ddf71f1a5b';


    var yaDetLangRequest = yaDetectLangCommonUrl+'&text='+encodeURI(text);
    console.log('===='+yaDetLangRequest);
    var yaTransRequest = yaTransCommonUrl+'&text='+encodeURI(text);
    lang=null;

    LangReq(yaDetLangRequest,function GetYaTranslate (lang) {
        if (lang=='ru')
        {
         /*   var prefLang = text;    
            prefLang.split('(').pop().split(')').shift(); 
            if (prefLang.length()==2)
            {
                 yaTransRequest+='&lang=ru-'+prefLang;
                 console.log(lang+  yaTransRequest);
            }
            else {  */             
                 yaTransRequest+='&lang=ru-en';
                 console.log(lang+  yaTransRequest);
          /*  }*/

        }
        else {
            yaTransRequest+= '&lang='+lang+'-ru';
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
            if (message == '') { bot.sendMessage(userId,'по вашему запросу - '+ text +' - ничего не нашлось'); } 
            else {bot.sendMessage(userId,text+' ('+lang+')'+' - '+message);} 
        });
    });
});

function UDReq(url, callback){
    var resp =  request({
        url: url,
        json: true
    },  function getResp (error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log('------'+body.list);
            callback(body.list);
        }
        else  {
            //console.log('++++++'+body.code,body.list);
            //bot.sendMessage(userId,'по вашему запросу - '+ text +' - ничего не нашлось');
            callback(null);}
    });
};


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
            //bot.sendMessage(userId,'по вашему запросу - '+ text +' - ничего не нашлось');
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
            //bot.sendMessage(userId,'по вашему запросу - '+ text +' - ничего не нашлось');
            callback(null);}
    });
};