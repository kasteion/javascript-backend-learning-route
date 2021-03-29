# Introducción

## ¿Qué son las estructuras de datos?

Como trabajar y desarrollar estructuras de datos practicamente con JavaScript. Las estructuras de datos son algo que vamos a utilizar mucho y nos va a ayudar a resolver muchos problemas.

Una estructura de dato nos permite ordenar de cierta forma la información mediante un lenguaje de programación.

Las estructuras de datos son colecciones de valores, las relaciones entre ellos y las funciones u operaciones que se pueden aplicar a los datos.

## Memoria y cómo se guardan los datos

La memoria es como una cuadricula con varios memory slots. En un memory slot podemos guardar un byte (que son 8 bits). Todo lo que guardamos lo tenemos que representar en binario.

Cuando se guardan los datos en la memoria, esto se hace de forma aleatoria. Sabemos donde se guarda la información gracias a las direcciones o address.

Los sistemas operativos pueden ser de 32 o 64 bits, esto es la cantidad de bits que se pueden utilizar para guardar información.

# Arrays y strings

## Arrays

Empezamos a ver estructuras de datos. Los arrays son una colección de información. Es como una lista de datos en que generamos un índice para cada inforamción que guardamos y estas están guardadas de forma consecutiva.

**Métodos**

- **push**: Agregar un elemento al final del array
- **pop**: Borra el último elemento
- **unshift**: Agrega un elemento al inicio del array
- **shift**: Borra el primer elemento del array
- **splice**: Agrega un elemento en una parte del array

Hay dos tipos de Arrays los estáticos y los dinámicos. Javascript maneja por default los arrays dinámicos, nosotros no decidimos que tan largo es el array. Lenguajes como C necesitan que declaremos la longitud del array y eso ya no se puede modificar.

En un arreglo estático, si queremos mutar la longitud del arreglo tenemos que copiar toda la información a otra posición de memoria y asignarle más espacio y luego borrar la que teníamos ocupada con el arreglo.

En un arreglo dinámico, javascript le va a indicar a la memoria que necesita un array de 3 elementos pero pide 6 por si llega a crecer. Al momento de crecer el array más de 6 elementos... tienen que buscar un espacio con 12 espacios para tener para crecer el array.

Ahora vamos a hacer un array nosotros con una clase...

## Construyendo nuestro Array

> mkdir array
>
> touch array/array.js

```javascript
class MyArray {
  constructor() {
    this.length = 0;
    this.data = {};
  }

  get(index) {
    return this.data[index];
  }

  push(item) {
    this.data[this.length] = item;
    this.length++;
    return this.data;
  }
}
```

## Eliminando elementos del Array

## Strings

Los strings de por sí no son una estructura de datos, pero la forma en que se guardan son como una estructura de datos. Un string en realidad es inmutable. No podemos manipularlos y hacerlo requiere que se busque un nuevo espacio en memoria, se copie al nuevo espacio y se borre el anterior.

```javascript
const saludo = "Hola";
```

Es como que:

```javascript
const saludo = ["H", "o", "l", "a"];
```

# Hash Tables

## Hash Tables

Ahora veremos formalmente una estructura de datos. En algunos lenguajes de programación ya vienen las hash tables.

- **JavaScript**: Objetos o maps es lo que más se le parece. Les falta un paso pero son muy similares.
- **Python**: Diccionarios.
- **Java**: Maps.
- **Go**: Maps.
- **Ruby**: Hashes.

Las hash tables son similares a los objetos porque también manejan este concepto de key value.

```json
{
  "nombre": "Diego",
  "nacionalidad": "Mexicano"
}
```

La diferencia es un paso extra que se convierte en una caja negra. Esto es poder generar un hash que se convierte en el address que permite acceder al valor que estamos guardando. Para ingresar un valor al hash le tengo que pasar la clave a la hash function para que me de un address, igual para acceder al valor tengo que pasarle la key a la hash function para que me de el hash y pueda retornar la clave y valor. Esta combinación de hash, clave valor se conoce como bucket.

**Métodos**

- **insert**: Inserta un elemento en la tabla.
- **search**: Busca un elemento por key.
- **delete**: Borra un elemento.

**Colisión de Hash Table**

Es cuando la hash table me devuelve el mismo hash para dos keys distintos. Entonces termino con dos keys en el mismo bucket. Y no hay forma de evitar esto. Así es como funcionan, dependiendo de cuantos buckets libres tenga es la forma que me va a regresar el hash para guardar la información y casí siempre es imposible evitar que exista una colisión.

Lo que es importante es saber como podemos tratar una colisión. Porque una colisión cuando tenemos dos valores en el mismo bucket se puede tratar con otra estructura de datos llamada linked list.

## Construyendo una Hash Table

## Implementando el método Get

# Linked List

## Linked List

Una linked list tiene nodos. Tenemos el nodo principal que es el head. Luego tenemos varios nodos y el último nodo es el tail. La linked list tiene punteros a los otros elementos.

**Métodos**

- **prepend**: Agregar un Nodo al inicio
- **append**: Agregar un Nodo al final
- **Lookup/search**: Buscar un Nodo
- **insert**: Insertar un Nodo en la lista
- **delete**: Borrar un nodo

Aquí no podemos darle una key a la lista sino que tenemos que buscar el nodo recorriendo el arreglo.

**Singly Linked List**

Cada nodo tiene el valor y el next que apunta al siguiente nodo. Cada nodo solo conoce al nodo siguiente y no se puede regresar. Si queremos regresar tenemos que empezar un loop desde el principio.

## Construyendo una Singly Linked List

Con esta estructura de datos puede ser díficil acceder a la información. Porque no le podemos pasar un índice y retornar el valor sino que debemos siempre recorrer la lista.

## Agregar nodos a la lista

## Agregar nodos intermedios

## Doubly Linked List

Las doubly linked list podemos ir en ambas direcciones. De la cabeza a la cola y de la cola a la cabeza.

El Nodo es: {
value
prev
next
}

# Stacks

## Staks

O Pila. O LIFO. (Last In First Out)

**Métodos**

- **pop**: Remover el último elemento.
- **push**: Agregar un elemento al final.
- **peek**: Tomal el último elemento de la linea.

## Construyendo un Stack

# Queues

## Queues

O Fila. O FIFO (First In First Out)

**Métodos**

- **enqueue**: Agregar un elemento a la fila de la línea.
- **dequeue**: remover el primer elemento de la línea.
- **peek**: Tomar el primer elemento de la línea.

## Construyendo un Queue

# Trees

## Trees

En un tree tenemos un nodo que se convierte en el nodo principal, raiz, root.

Hay nodos que son padres porque tienen nodos hijos. Y obviamente hay nodos hijos, nodos hermanos, nodos hojas, sub árboles.

Root, Parent, Child, Leaf, Sibling, Sub Tree.

**Binary trees (perfect binary tree)**

Todos los nodos tienen 2 hijos. La misma cantidad de nodos de los dos lados. Un árbol balanceado.

**Binary Search Trees (Balance Tree)**

Son árboles binarios perfectos. Peeero todos los números que disminuyen van del lado izquierdo y todos los que aumentan van del lado derecho. Son buenos para busquedas rápidas.

**Binary Search Trees (Unbalanced tree)**

Esto es cuando el árbol no esta creciendo de forma balanceada. Sino que se esta yendo para un lado más que para otro. Pero hay algoritmos que nos ayudan a balancear el árbol.

**Métodos**

- **seach**: Buscar por un nodo.
- **insert**: Insertar un nodo.
- **delete**: Borrar un nodo.

## Construyendo un Binary Search Tree

# Graphs

## Graphs

Los grafos son como una cobinación de otras estructuras de datos para construir una conexión entre los nodos. Los grafos son nodos interconectados y hay diferentes formas en que podemos conectarlos.

Un grafo tiene ciertas cosas importantes:

- Nodos (Vértice).
- Edge (Borde): Son las conexiones entre los grafos.

**Grafos dirigidos y no dirigidos**

- Dirigidos: Los grafos dirigidos quieren decir que un nodo nos lleva a otro nodo y ese a otro y ese a otro. Ejemplo: Tweeter.
- No dirigidos: Son nodos interconectados pero puedo ir y regresar entre diferentes nodos. Ejemplo: Facebook.

**Grafos ponderados y no ponderados**

- Ponderados: Cuando en los vertices tenemos pesos.
- No Ponderados: Cuando en los vertices no le asignamos pesos.

**Grafos cíclicos y acíclicos**

- Cíclico: Si empiezo en un nodo puedo recorrer el grafo y regresar al nodo origina.
- Acíclico: No hay camino que me permita regresar al nodo en el que empecé.

## Representando grafos en código

Digamos que queremos representar el siguiente grafo:

```javascript
/*
    2 - 0
   / \
  1 - 3

*/
```

Hay 3 formas de representar grafos:

**Edge List**

Representa las conexiones que existen en el grafo como arrays.

```javascript
const graph = [
  [0, 2],
  [2, 3],
  [2, 1],
  [1, 3],
];
```

**Adjacent List**

El índice 0 solo conecta con el 2
El índice 1 conecta con el 2 y 3
El índice 2 conecta con el 0, 1, y 3
El índice 3 conecta con el 1 y 2

```javascript
const graph = [[2], [2, 3], [0, 1, 3], [1, 2]];
```

Pero también podemos representarlo en un objeto o una hash table:

```javascript
const graph = {
  0: [2],
  1: [2, 3],
  2: [0, 1, 3],
  3: [1, 2],
};
```

**Adjacent Matrix**

La tercer forma de representar sería un Adjacent Matrix...
Los grafos ponderados ya se tendrían que representar así.

```javascript
const graph = [
  [0, 0, 1, 0],
  [0, 0, 1, 1],
  [1, 1, 0, 1],
  [0, 1, 1, 0],
];
```

Para el ejemplo vamos a estar trabajando con un adjacent list como objeto.

## Construyendo un grafo

# Cierre

## Conclusiones
