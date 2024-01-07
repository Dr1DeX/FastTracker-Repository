var amqp = require('amqplib')
var uuid = require('uuid');
var SOCKER_OPEN = 1;

const queue = 'to_socket';

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    });
}

(async () => {
    var connected = false
    const RMQ_HOST=process.env.RMQ_HOST || '127.0.0.1'
    const RMQ_PORT=process.env.RMQ_PORT || 5672
    const RMQ_USER=process.env.RMQ_USER || 'mirai'
    const RMQ_PASS=process.env.RMQ_PASS || 'davog1337'
    while (!connected) {
        await sleep(1000);
        console.log('RabbitMQ connection attempt')
        try {
            const connection = await amqp.connect("amqp://"+RMQ_USER+":"+RMQ_PASS+"@"+RMQ_HOST+":"+RMQ_PORT);
            const channel = await connection.createChannel();

            process.once('SIGINT', async() => {
                await channel.close();
                await connection.close();
            });

            await channel.assertQueue(queue, {durable: false});
            await channel.consume(
                queue,
                (message) => {
                    if (message) {
                        console.log('Received refresh message');
                        for (const [key,ws] of Object.entries(clients)) {
                            if (ws.readyState === SOCKER_OPEN) {
                                ws.send(message.content.toString());
                            } else {
                                delete clients[key];
                            }
                        }
                    }
                },
                { noAck: true }
            );
            connected = true;
            console.log('Connected to RabbitMQ, waiting for messages');
        } catch (err) {
            console.warn(err);
        }
    }
})();

function getCookiesMap(cookiesString) {
    return cookiesString.split(';')
    .map(function(cookiesString) {
        return cookiesString.trim().split('=');
    })
    .reduce(function(acc, curr) {
        acc[curr[0]] = curr[1];
        return acc;
    }, {});
}

console.log('Client-side started');
var Msg = '';
var clients = {};
var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 8010});
    wss.on('connection', function(ws, req) {
        if (req.headers.cookie) {
            var cookies = getCookiesMap(req.headers.cookie);
            var sessionid = cookies['sessionid'];
            var sockedid = uuid.v4();
            console.log(sessionid);
            clients[sockedid] = ws;
            console.log('New connection from %s', sessionid);
            ws.on('message', function(message) {
                console.log('Received from client: %s', message);
                ws.send('Server received from client: ' + message);
            });
        } else { console.log('New connection');}
    })