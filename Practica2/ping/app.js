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

app.listen(4000, function () {
  console.log('Escuchando en el puerto 4000');
});

app.get('/ping', function (req, res) {
  publisherPing().then(function(response){ //respuesta de la ultima promesa encadenada sendToQuee
    if(response){
      consumirNotificacionPong(res).then(function(){
        res.send("OK");
      });
    }
  })
});

// Publisher
function publisherPing() {// retorna toda la promesa encadenada
  return open.then(function(conn) { // abto conexion encansulado como promesa
    return conn.createChannel(); // encanado
  }).then(function(ch) {
    return ch.assertQueue(colaPing).then(function(ok) { // verifica que esta cola exista
      console.log("Enviando mensaje a la cola ping...");
      return ch.sendToQueue(colaPing, new Buffer('PING_MESSAGE')); // envia a la cola
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
          ch.ack(msg); //akcnolge ya cogi este mensaje ya se puede borrar
          console.log(msg.content.toString());
        }
      });
    });
  }).catch(console.warn);
}
