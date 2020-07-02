var mqtt = require('mqtt');
var mongo = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost/';
var client = mqtt.connect('mqtt://192.168.1.17:1883');

client.on('connect', function () {
    client.subscribe('sensorTest');
});

client.on('message', function (topic, message) {
    var date = new Date();
    var list = [];
    var fullDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' +
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    var context = message.toString();

    context = context.split(' ');

    for (var i = 1; i < context.length; i++) {
        var split = context[i].split(',');

        if (split[0] == '') {
            split[0] = 0;
        }

        split[1] = split[1]/100;
        list.push({
            id: split[0].toString(),
            temperature: split[1].toString()
        });
    }

    var obj = {
        topic: topic,
        date: fullDate,
        device: list
    };

    console.log(obj);

    mongo.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db('test2');
        dbo.collection('temperatureSensor').insertOne(obj, function (err, res){
            if (err) throw err;
            console.log('1 document inserted');
            db.close();
        });
    });
});
