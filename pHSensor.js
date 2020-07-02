var mqtt = require('mqtt');
var mongo = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost/';
var client = mqtt.connect('mqtt://192.168.1.17:1883');

client.on('connect', function () {
    client.subscribe('pHSensor');
});

client.on('message', function (topic, message) {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var fullDate = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    message = message.split(' ');
    var context1 = message[0].toString();
    context1 = context1/100;
    context1 = context1.toString();
    var context2 = message[1].toString();
    context2 = context2/100;
    context2 = context2.toString();

    var obj = {
        topic: topic,
        temp: context1,
        pH: context2,
        date: fullDate
    };

    mongo.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db('test2');
        dbo.collection('pHSensor').insertOne(obj, function (err, res){
            if (err) throw err;
            console.log('1 document inserted');
            db.close();
        });
    });

    console.log(topic + ' ' + context + ' '+ fullDate);
});
