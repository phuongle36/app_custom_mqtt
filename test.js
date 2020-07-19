var mqtt = require('mqtt');
var mongo = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost/';
var client = mqtt.connect('mqtt://127.0.0.1:1883');

client.on('connect', function () {
    client.subscribe('sensorTest');
});

client.on('message', function (topic, message) {
    var date = new Date();
    var list = [];
    var fullDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' +
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    var check = fullDate.split(' ');
    var checkDate = check[0].split('/');
    var checkTime = check[1].split(':');
    for (var a = 0; a < checkDate.length; a++) {
        if (checkDate[a].toString().length == 1) {
            checkDate[a] = '0' + checkDate[a];
        }
    }

    for (var a = 0; a < checkTime.length; a++) {
        if (checkTime[a].toString().length == 1) {
            checkTime[a] = '0' + checkTime[a];
        }
    }

    fullDate = checkDate[0] + '/' + checkDate[1] + '/' + checkDate[2] + ' ' +
    checkTime[0] + ':' + checkTime[1] + ':' + checkTime[2];
    var context = message.toString();
    console.log(context);

    context = context.split(' ');
    var kind = context[context.length - 1];

    if (kind == 'temperature') {
        for (var i = 1; i < context.length - 1; i++) {
            var split = context[i].split(',');

            if (split[0] == '') {
                split[0] = 0;
            }

            split[1] = split[1]/100;
            list.push({
                id: split[0].toString(),
                type: kind,
                value: split[1].toString()
            });
        }
    } else {
        context[0] = context[0]/100;
        list.push({
            id: '2',
            type: kind,
            value: context[0].toString()
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
        dbo.collection('temperatureSensor').insert(obj, function (err, res){
            if (err) throw err;
            console.log('1 document inserted');
            db.close();
        });
    });
});
