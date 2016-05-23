# Desarrollo de Software Basado en Componentes

## Practica 1

## Hypermedia as the Engine of Application State

* Lenguaje: Python 3.5.1
* API: [Spotify API]

### Comando
```sh
$ py previewCancion.py
```

[Spotify API]: <https://developer.spotify.com/web-api/>

## Practica 2

## Message Driven Ping Pong

* Lenguaje: JavaScript
* Broker: RabbitMQ
* Libreria: [AMQP.NODE]

[AMQP.NODE]: <https://github.com/squaremo/amqp.node>

### Comandos

```sh
$ npm install
```

PING

```sh
$ cd Practica2/ping
$ node app.js
```

PONG

```sh
$ cd Practica2/pong
$ node app.js
```

Como usar la aplicacion:

* Ingresar a la URL [http://localhost:4000/](http://localhost:4000/) para realizar peticiones
* Ingresar a [http://localhost:4001/resumen](http://localhost:4001/resumen) para ver el resumen de las peticiones
