const config = require('config');
const mailgun = require("mailgun-js");
const RSMQWorker = require( "rsmq-worker" );
const worker2 = new RSMQWorker(config.QUEUENAME2, {interval:.1});
const  rsmq  = config.rsmq;

console.log('ready to consume');

    worker2.on('message', function(msg, next, msgid){
        console.log('Message: ' + msg + 'has arrived!');
            if(msg){
                console.log('message dequeued')
                const emailNotification = JSON.parse(msg)
                const sender = emailNotification.sender
                const recipient = emailNotification.recipient
                const body = emailNotification.message
                const domain = config.DOMAIN_NAME; 
                const apiKey = config.API_KEY; 
                const mg = mailgun({apiKey: apiKey, domain: domain});
                const email = {
	                from: 'Excited User <summittinuade@gmail.com>', 
	                to: recipient,
	                subject: 'Notification from slack',
	                text: sender + ': ' + body
                };
                mg.messages().send(email, function (error, body) {
	                console.log(body);
                }); 
            }
            else{
                console.log('no message queue')
            }
            next();
        })
        

worker2.on('error', function( err, msg ){
    console.log( "ERROR", err, msg.id );
});
worker2.on('exceeded', function( msg ){
console.log( "EXCEEDED", msg.id );
});
worker2.on('timeout', function( msg ){
    console.log( "TIMEOUT", msg.id, msg.rc );
});
worker2.start();

    
