var express = require('express');
var sleep = require('sleep');
var app = express();
var colaPong = 'PONG_TASKS';
var colaPing = 'PING_TASKS';
var open = require('amqplib').connect('amqp://localhost');
var mensajesRecibidos = 0;
var mensajesEnviados = 0;

app.get('/resumen', function (recolaPong, res) {
  var respuestaFinal = {'Mensajes recibidos': mensajesRecibidos,
                        'Mensajes enviados': mensajesEnviados
                        };
  res.send(respuestaFinal);
});

app.listen(4001, function () {
  console.log('Escuchando en el puerto 4001');
  consumer();
});

// Consumer
function consumer() {
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(colaPing).then(function(ok) {
      return ch.consume(colaPing, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          ch.ack(msg);
          mensajesEnviados++;
          console.log("Estoy en PONG");
          setTimeout(function(){enviarNotificacionAPing(ch);},2000);
        }
      });
    });
  }).catch(console.warn);
}

function enviarNotificacionAPing(ch){
    ch.assertQueue(colaPong).then(function(ok) {
    var message = ch.sendToQueue(colaPong, new Buffer('PONG_MESSAGE'));
    mensajesRecibidos++;
  });
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
