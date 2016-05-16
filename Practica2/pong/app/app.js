var express = require('express');
var sleep = require('sleep');
var app = express();
var q = 'tasks';
var open = require('amqplib').connect('amqp://@localhost');

app.get('/pong', function (req, res) {
  res.send('PONG!');
  consumer();
});

app.listen(4001, function () {
  console.log('Escuchando en el puerto 4001');
});

// Consumer
function consumer() {
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    sleep.sleep(5);
    return ch.assertQueue(q).then(function(ok) {
      return ch.consume(q, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          ch.ack(msg);
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
