var express = require('express');
var app = express();
var q = 'tasks';
var open = require('amqplib').connect('amqp://@localhost');

app.get('/ping', function (req, res) {
  res.send('Mensaje enviado a la cola!');
  publisher();
});

app.listen(4000, function () {
  console.log('Escuchando en el puerto 4000');
});

// Publisher
function publisher() {
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
      console.log("Enviando mensaje a la cola...");
      return ch.sendToQueue(q, new Buffer('PING_MESSAGE'));
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
