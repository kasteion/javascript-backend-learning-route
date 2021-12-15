# Fundamentos del desarrollo Web

## Ying y Yang de una aplicación: frontend y backend

**Frontend**

HTML, CSS y JavaScript.

Librerías de CSS:
- Bootstrap
- Foundation
- Tailwind

Librerías y Frameworks JS:
- React
- Angular
- Vue
- Svelte

Diseño UI (Adobe XD, Sketch, Figma) y UX

**Backend**

- JavaScript - Node, Nest
- PHP - Laravel
- Java - Spring
- Go
- Rust
- Ruby - Ruby on Rail
- Python - Fast API, Flask, Django

## Framework vs. Librería

Un framework es más opinionado, es un conjunto de reglas y recetas. Librerías, reglas, pasos y recetas.

Con una librería no tenemos necesariamente las reglas y recetas. Así que debemos descubrir un poco el camino.

## Cómo se conecta el frontend con el backend: API y JSON

API = Application Programming Interface. 

Una parte del backend que permite comunicación con el frontend.

SOAP = Simple Object Access Protocol, mueve la información entre backend y frontend con XML (Extensible Markup Language)

REST = Representational State Transfer, regularmente mueve la información en formato JSON (Javascript Object Notation)

## El lenguaje que habla Internet: HTTP

HTTP = Hypertext Transfer Protocol

```yml
# Request

GET / HTTP/1.1
Host: developer.mozilla.org
Accept-Language: fr

# Response

HTTP/1.1 200 OK
Date: Sat, 09 Oct 2010 14:28:02 GMT
Server: Apache
Last-Modified: True, 01 Dec 2009 20:18:22 GMT
ETag: "51142bc1-7449-479b075b28981b"
Accept-Ranges: bytes
Content-Length: 29769
Content-Type: text/html

<!DOCTYPE html... >
```

## ¿Cómo es el flujo de desarrollo de una aplicación web?

**En mi Computadora (Entorno local)**

**git** - Nuestro sistema de control de versiones

**Code Editor** - Por ejemplo: Visual Studio Code

**Browser**: - Si estoy haciendo algo web pues tambien allí lo estoy revisando

**Remote Repo**

Pr ejemplo GitHub, GitLab, etc

**CI / CD**

Continuous Integration & Continuous Delivery

Testing Automatizado y Deployment a diferentes ambientes.

**En el Server**

Es Producción, tiene un dominio, un web server, una base de datos.

## El hogar de tu código: el servidor

Cloud:

**IaaS - Infrastructure as a Service**
Cpu, Ram, Disk, Operating System.

AWS
Microsoft Azure
Digital Ocean

Dos Tipos: VPS (Virtual Private Server) y Shared Hosting

**PaaS - Platform as a Service**
Database Service, Firewall Service, App Service, Just Deploy.

Google App Engine
Firebase
Heroku

**SaaS - Software as a Service**
Quieres una aplicación que ya exista. 

Google Docs
Slack
Office 365

# Diseño de una API

## Proyecto: diseño y bosquejo de una API

CRUD - Create Read Update Delete

A un CRUD se le puede traer a la vida con una API que también es el motor de la aplicación.

En Python para construir una API podemos hacerlo con:

- Fast API
- Django -> REST Framework
- Flask

**Endpoint**

Tambien denominado route o path. Es una url del proyecto.

http://tweeter.com/api/tweets

## Proyecto: diseñando los endpoints de los Tweets

**Endpoints**

GET /tweets -> list all tweets
GET /tweets/{tweet_id} -> list one tweet

POST /tweets -> Create a tweet

PUT /tweets/{tweet_id} -> Update a tweet

DELETE /tweets/{tweet_id} -> Delete a tweet

## Proyecto: diseñando los endpoints para los usuarios

**Endpoints**

GET /users -> list all users
GET /users/{user_id} -> list one user

POST /users -> Create a user
POST /signup

PUT /users/{user_id} -> Update a user

DELETE /users/{user_id} -> Delete a user

# Conclusiones

## Qué lenguaje y framework escoger para backend

Python:
    - Django
    - Flask
    - Fast API

JavaScript:
    - Express
    - NestJS

PHP:
    - Laravel
    - Symfony

Java:
    - Spring

Go:
    - Gin
    - Beego

Ruby:
    - Rails