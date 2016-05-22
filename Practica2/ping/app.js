var express = require('express');
var app = express();
var colaPing = 'PING_TASKS';
var colaPong = 'PONG_TASKS';
var open = require('amqplib').connect('amqp://localhost');
var mensajeFinal;

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

app.get('/ping', function (req, res) {
  publisher().then(function(response){
    if(response){
      notificacionPong(res).then(function(){
        res.send("Mensaje Pong recibido");
      });
    }
  })
});

app.listen(4000, function () {
  console.log('Escuchando en el puerto 4000');
});

// Publisher
function publisher() {
  return open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(colaPing).then(function(ok) {
      console.log("Enviando mensaje a la cola ping...");
      return ch.sendToQueue(colaPing, new Buffer('PING_MESSAGE'));
    });
  }).catch(console.warn);
}

function notificacionPong(res){
  return open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(colaPong).then(function(ok) {
      console.log("Consumiendo mensaje de la cola pong...");
      return ch.consume(colaPong, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          ch.ack(msg);
          mensajeFinal = msg.content.toString();
        }
      });
    });
  }).catch(console.warn);
}

/*

Cliente da un comando para PING que emita un PING_MESSAGE

PING_MESSAGE se envia a un Broker

PONG recibe el PING_MESSAGE por medio del Broker

PONG simula un retraso de 2 segundos

PONG emite un PONG_MESSAGE al Broker

PING cuando reciba un PONG_MESSAGE completa el request http

PONG da respuesta al Cliente

PONG responde las consutlas por http cuantos PING_MESSAGE a contestado y recibido

*/
