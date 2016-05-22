var express = require('express');
var app = express();
var colaPing = 'PING_TASKS';
var colaPong = 'PONG_TASKS';
var open = require('amqplib').connect('amqp://localhost');

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res){
  res.render('index');
});

app.get('/ping', function (req, res) {
  publisherPing().then(function(response){
    if(response){
      consumirNotificacionPong(res).then(function(){
        res.send("Mensaje Pong procesado");
      });
    }
  })
});

app.listen(4000, function () {
  console.log('Escuchando en el puerto 4000');
});

// Publisher
function publisherPing() {
  return open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(colaPing).then(function(ok) {
      console.log("Enviando mensaje a la cola ping...");
      return ch.sendToQueue(colaPing, new Buffer('PING_MESSAGE'));
    });
  }).catch(console.warn);
}

function consumirNotificacionPong(res){
  return open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(colaPong).then(function(ok) {
      console.log("Consumiendo mensaje de la cola pong...");
      return ch.consume(colaPong, function(msg) {
        if (msg !== null) {
          ch.ack(msg);
          console.log(msg.content.toString());
        }
      });
    });
  }).catch(console.warn);
}
