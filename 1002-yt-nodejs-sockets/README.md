# Sockets in Node

Cuando te metes a trabajar un servidor que acepta varias peticiones debes hacer programación paralela... lo cual implica que hay que trabajar con hilos y NodeJS tiene un event loop que nos permite olvidarnos un poco de los hilos.

Un socket es una coneción TCP/IP con otra máquina. La comunicación es bidireccional. Y es como sí las máquinas estuvieran directamente conectadas. Y esto sucede a través de procesos. Una maquina tienen un proceso con un socket y la otra tiene un proceso en otro socket. Cada proceso corre en un puerto y se están comunicando entre sí.

1. Creamos un directorio creado sockets
2. Creamos un client.js y un server.js

## Hola mundo de los sockets

El server.js sería algo así:

```js
const { Server } = require("net");

const server = new Server();

server.on("connection", (socket) => {
  console.log(
    `New connection from ${socket.remoteAddress}:${socket.remotePort}`
  );
  socket.setEncoding("utf-8");
  socket.on("data", (data) => {
    //console.log(data);
    socket.write(data);
  });
});

server.listen({ port: 8000, host: "0.0.0.0" }, () => {
  console.log(`Listening on port 8000`);
});
```

Y el client sería algo así:

```js
const { Socket } = require("net");

const socket = new Socket();

socket.connect({ host: "localhost", port: 8000 });

socket.write("Hola");

socket.setEncoding("utf-8");
socket.on("data", (data) => {
  console.log(data);
});
```
