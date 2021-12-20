# Curso de Closures y Scope en JavaScript

# Scope

## ¿Qué es el scope y cómo funciona el Global Scope?

El Scope se define como el alcance que tiene una variable dentro del código. O en otras palabras, el scope es el que se encarga de decidir a que bloques de código va a acceder una variable. Vamos a hablar de Scope Local y Scope Local ( Y sus variantes)

Las variables con scope global pueden ser accedidas desde cualquier lugar en el script.

> node src/scope/global.js

## Local Scope

Las variables con scope local solo pueden ser accedidas dentro de un bloque de código o de una función.

> node src/scope/local.js

## Function Scope

> node src/scope/function.js

## Block Scope

> node src/scope/block.js

Mientras lo llamemos dentro de un juego de llaves {} la variable está en un bloque.

# Closure

## ¿Qué es un closure?

Un closure es la combinación de una función y el ámbito léxico en la cual ha sido declarada esta función. Un Closure recuerda el ámbito en el cual ha sido creado.

> node src/closures/closure.js

## Ámbito léxico en closures

Podemos crear nuevos closures, crendo un nuevo scope.

> node src/closures/lexical.js

## Cómo crear variables privadas con closures

Javascript, por su naturaleza no fomenta el uso de datos privados pero por medio de los closures podemos crear valores que pueden ser accedidos por medio de métodos y que no pueden ser métodos y que no van a ser accesibles fuera de esta función.

> node src/closures/private.js

## Loops

Podemos crear closures de diferentes maneras e incluso crearlos de manera involuntaria.

> node src/closures/loops.js

# Hoisting

## ¿Qué es el hoisting?

Un punto muy importante al estar trabajando con javascript es el concepto de hoisting, el levantamiento de declaraciones.

> node src/hoisting/index.js

Esto sucede porque el motor de javascript antes de empezar a interpretar lee todas las asignaciones, se pasan a memoria, se ajustan o adaptan según sea el caso de forma que haga todas las declaraciones antes de empezar a interpretar y ejecutar funciones.

# Debugging

## Debugging

El código de src/debu/index.js hay que copiarlo al explorador con inspect.
