var express = require('express');
var sleep = require('sleep');
var app = express();
var colaPong = 'PONG_TASKS';
var colaPing = 'PING_TASKS';
var open = require('amqplib').connect('amqp://localhost');
var mensajesProcesados = 0;
var mensajesEnviados = 0;

app.listen(4001, function () {
  console.log('Escuchando en el puerto 4001');
  consumer();
});

app.get('/resumen', function (recolaPong, res) {
  var respuestaFinal = {
                        'Mensajes recibidos': mensajesProcesados,
                        'Mensajes enviados': mensajesEnviados
                        };
  res.send(respuestaFinal);
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
          setTimeout(function(){
            enviarNotificacionAPing(ch);
          },2000);
        }
      });
    });
  }).catch(console.warn);
}

function enviarNotificacionAPing(ch){
    ch.assertQueue(colaPong).then(function(ok) {
    var message = ch.sendToQueue(colaPong, new Buffer('PONG_MESSAGE'));
    mensajesProcesados++;
  });
}
