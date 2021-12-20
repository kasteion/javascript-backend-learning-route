# Introducción al Flujo de Desarollo de Software con CodeStream

## Flujo de trabajo y principio Shift Left

**¿Qué es el flujo (Flow)**

El flujo es como un estado en que se está trabajando y ni siquiera nos damos cuenta que está pasando el tiempo.

El flujo de trabajo es una secuencia de tareas organizandas de cierta manera para lograr la mejor eficiencia. El flujo de trabajo trata de la manera en que deben enlazarse las tareas para lograr mejor productividad.

Antigo - Cascada - Un departamento trabajando despues de otro.

Moderno - Ágil - Un flujo continuo, todos los departamentos trabajando unos con otros, tareas superpuestas comunicación.

**El principio Shift Left**

Al movere el enfoque de la calidad al momento de la izquierda (anterior) para comprimir el ciclo, logramos mejor calidad y mejor rendimiento. Que la calidad este incorporada desde el principio.

Porque corregir errores en producción es 100 veces más caro que corregir errores en desarrollo o diseño.

**Implementación del flujo moderno**

Personal:

- Pull Request
- Issue tracker
- Comentarios

Equipo:

- Pull Request
- Issue tracker
- Comentarios
- Feedback
- Request
- Code Chat
- Transparencia

Organización

- Pull Request
- Issue Tracker
- Comentarios
- Feedback Request
- Code Chat
- Transparencia
- Documentación
- Administración
- Análisis

**Frecuencia de colaboración**

- Tradicional: Se hace una revisión de código al terminar el desarrollo.

- Moderno: se hacen muchas revisiones de código pequeñas a medida que se va desarrollando el código. Para eso necesitamos herramientas distintas al pull request.

**Prácticas de Ingeniería de Google**

- Documentado y disponible en https://google.github.io/eng-practices

- Revisiones de código en menos de 24 horas (Promedio Google: en menos de 4 horas.)

- Revisiones con menos código: Change Lists (CL) digeribles rápidamentes, menos de 100 líneas (Promedio Google: 24 líneas).

**Cómo aplicar Shift Left en desarrollo**

- Colaboración hiper-frecuente: Más preguntas antes, más comentarios antes.

- Integración de las herramientas para evitar cambio de contexto: No saltar de una herramienta a otra.

- La calidad se incorpora en el proceso: Tener consenso y aplicar revisiones lo antes posible.

## El editor de texto moderno

El editor de texto es el eje. Trabajamos todo el día en el editor de texto, ya sea vs code, intelij, pycharm, android studio. Pero también utilizamos otras herramientas, que no están integradas al editor. Como GitHub, Jira, Slack, Email. Esto produce cambios de contextos y los cambios de contexto reducen la productivdad.

**Integración de herramientas**

Las herramientas más utilizadas juntas son GitHub, Jira, Slack y por supuesto el editor. La idea es que todo funcine a través del mismo punto de integración (El editor).

Todos los editores de texto moderno son extensibles: VS Code, IntelliJ IDEA (y todos los editores de JetBrains), PyCharm, Visual Studio, Android Studio. La idea esencial es mejorar la productividad eliminando pasos innecesarios.

**Sin integración**

1. Escribir código
2. Alt-tab a terminal
3. git status
4. Verificar los cambios archivo por archivo en el editor
5. git diff
6. git branch -b feature/new-branch
7. Atl-tab a Chrome
8. Encontrar la tab de jira
9. Ir a la lista de issues
10. Encontrar el issue en cuestión
11. copiar, alt-tab back to terminal.
12. git commit -am 'Commit messages goes here # jira-ticket'
13. git pull
14. git push
15. Copiar el url de la terminal
16. Alt-tab a Chrome, pegar
17. Crear un titulo para el PR y una descripción. Return
18. Agregar un revisor al PR
19. Alt-tab a Sclack
20. @mention al supervisor para avisarle qué estás esperando

Aparte pueden surgir distracciones que no son parte del flujo. Y retomar la concentración luego de una distracción puede tomar hasta 25 minutos.

**Con integración**

1. Hacer click en el ticket para generar una rama y empezar a trabajar
2. Escribir código
3. Realizar revisión, agregar y commita cada archivo en el panel SCM del editor.
4. Sincronizar los cambios a GitHub.
5. Hacer click en el New Pull Reuqest (el título y descripción se crean automáticamente con referencia al ticket de Jira).
6. Agregar el revisor al PR.

**Beneficios de la integración en el editor**

- Ahorras tiempo.
- Reduces distracciones
- Tienes acceso a todo el código en todo momento.
- Mejoras la calidad.
- Mejoras la comunicación.
- NO tienes que cambiar de herramienta.

## Práctica: Instalación de CodeStream

1. Instalar la extensión CodeStream
2. Clonar un proyecto de GitHub.
3. En el panel de Codestream...

- Logearnos a GitHub
- Logearnos a Jira (En Issues)

# El Flujo moderno

## Productividad

**Moderno**

- Herramientas integradas en el editor.
- Revisión de código en el PR y en cualquier línea de código.
- Revisión de código antes del commit.
- Más automatizado
- Menos cambio de contexto.
- Comunicación integrada
- Documentación integrada.

**Flujo Branch tradicional**

1. Create a Branch
2. Add commits
3. Open Pull Request
4. Discuss and Review
5. Merge and Deploy

**Flujo Branch moderno**

-- Con un solo click --

1. Asignar ticket
2. Crear branch
3. Notificar al equipo
4. Escribir código
   a. Pedir comentarios
   b. Obtener sugerencias
   c. Explicar dirección
5. Sugerencias (Comunicación Informal)
   a. Antes de un pull request
   b. Comunicación informal
   c. Documenta el proceso
6. Revisón de código pre-PR
   a. Antes de un pull request
   b. Comunicación formal
   c. Se incorpora al PR
7. Aprobación final
   a. Antes de un pull Request
   b. Aprobación final
   c. Reducción de pasos

## GitHub en tu editor

**¿Por qué integrar GitHub en tu editor?**

- ¿Por qué trabajar en GitHub.com?
- ¿Por qué tener que saltar de GitHub.com a tu editor, ida y vuelta, para entender el código?
- ¿Por qué se puede comentar solamente sobre los cambios en este PR?
- ¿Por qué comparar archivos dentro de un sitio web en vez del editor?

**Beneficios de la integración**

- Eliminación del cambio de contexto.
- Check out a una branch en un solo clic.
- Ejecutar una compilación durante la revisión
- Saltar a la definición
- Tus atajos de telcado, temas y personalizaciones preferidos.
- La herramienta "diff" nativa de tu editor.
- El contexto completo de tu repositorio.
- Agregar comentarios en cualquier parte del repositorio relacionado con cualquier revisión de código.

**Navegación: CodeStream**

Tiene seis secciones:

1. Pull Request
2. Feedback Request
3. Issues (Jira, Trello)
4. Code Marks
5. My Team
6. Work In Progress

**Eficiencia del PR en tu editor**

Desde el panel de codeStream puedes:

- Agregar comentarios
- Crear issues en Jira
- Crear un Feedback Request
- Crear un Pull Request

## Feedback Request

El feedback request es una práctica relacionada con el concepto de pull request. Se realiza antes en el flujo para poder atomizar (Reducir la cantidad de líneas a revisar para poder terminar antes, pedir sugerencias sobre el código) la colaboración. Permite pedir feedback, es decir, comentarios sobre código en cualquier estado de tu repositorio y es mucho más fácil para el revisor.

El feedback request es una revisión de código ligera antes del pull request. Para recibir comentarios sobre cualuqier parte del código, incluso antes de un commit.

**Principios de colaboración shift left**

1. Antes es mejor que después.
2. Colaboración atomizada.
3. Más consulta de aprobación.
4. Reducir fricción administrativa.
5. Compartir conocimientos.

Para tener un feedback request necesitamos al menos otra persona trabajando en el mismo flujo.

**Integración de proyectos/tareas en VS Code**

- Incluye funcionalidad completa.
- Tres propósitos:
  - Automatización
  - Uniformidad
  - Comunicación
- Permite integrar más de una aplicación en la misma lista de tareas
  - Por ejemplo, Jira, Trello y GitHub Issues

**Ventajas de tener un issue tracker integrado**

- Agregar un ticket mientras escribes o revisas código.
- Conectar el ticket directamente al código.
- Notificar a la persona indicada que hay un ticket y dirigirlo al lugar correcto.
- No tener que cambiar de aplicación o contexto.
- Crear un registro de los tickets asociados al código mismo.

## Tu herramineta de comunicación de código

Otro tipo de paradigma en el que hay más consulta que aprobación. Una mayor discusión informal que se presenta con un concepto nuevo, como es el code chat.

**Code Chat**

El code chat es mensajería de quipo diseñada para trabajar con líneas y bloques de código. Detecta los cambios y diferencias en distintas versiones del mismo bloque. Contiene la meta-data para evolucionar con el código. Se intera con Slack, Pull Request, Jira. Luego se transforma en documentación de forma automática para favorecer a toda la organización.

**Propósito del Code Chat**

- Colaboración informal atomizada.
- Permite hacer preguntas y sugerencias sobre cualquier parte del código.
- Conecta distnitas partes del código.
- Conecta distintos bloques de código.
- Documenta el código.
- Explica decisiones ya tomadas.

**Codemarks**

Cada vez que se crea una unidad de comunicación en CodeStream se crea un "codemark". Un codemark es un enlace entre la información sobre el código (metadata) y el bloque de código al que se refiere.

Un codemark puede ser un mensaje, un issue o un permalink (enlace permanente). Los codemarks son exportables.

**Code Chat: resumen**

- El code chat facilita la colaboración informal.
- Se integra con los sistemas de comunicación exitentes.
- Se adecúa a la evolución y las diferencias del código.
- Se utiliza en cualquier parte del repositorio.

# Comunicación dentro del editor

## Trabajo remoto y transparencia

El trabajo remoto y la transparencia tienen que adoptarse en la organización para fomentar el cambio de paradigma.

**El trabajo remoto**

- La nueva norma es el trabajo remoto (Y tienes que comunicarse de manera distinta.)
- Muchas empresas están decidiendo hacer la transición permanente.
- Se terminó la comunicación informal en persona. Y eso trae sus ventajas y desventajas.
- ¿Qué herramientas hacen falta para adaptarse? Si no el trabajo se vuelve con poca comunicación y eso trae consecuencias para la productividad.

**Transparencia**

- Es una filosofía de trabajo.
- Quiere decir que estamos abiertos a compartir conocimiento.
- Estamos abiertos a mostrar trabajo con defectos.
- Saber qué está haciendo el equipo.
- Mostrar lo que estás haciendo tú.

**De transparencia a visibilidad**

- La visibilidad es la implementación de la transparencia.
- Hay tecnologías que permiten tener visibilidad.
  - Calendario
  - Status en Slacks / Teams / etc.
  - Zoom Call
- Live View en CodeStream

**Resumen**

- El trabajo remoto está aquí y ya no creemos que esto cambie. Hay que acostumbrarnos, tener las herramientas y tener un ambiente cómodo.
- La implementación de una filosofía de transparencia es imporntante en el flujo moderno. La trasparencia se implementa con visibilidad.
- La visibilidad se crea con herramientas de trabajo.
- Live View está integrado en CodeStream

## Práctica: documentación automática del flujo

Los codemarks se utilizan para tener conversaciones informales y eficientes sobre el código, pero también sirven para la creación automática para referencia de todos los miembros del equipo.

Con codestream la documentación no se queda obsoleta, sino que va evolucionando conforme evoluciona el código.

## El flujo de trabajo moderno

**El problema de la documentación**

- La mayoría de los equipos de desarrollo no documentan sus proyectos.
- Menos del 20% de los desarrolladores usan la documentación interna para resolver preguntas.
- Al empezar un trabajo nuevo, los desarrolladores pasan el 75% del tiempo estudiando el código.
- Nadie sabe de antemano qué pregunta tendrá el otro.

**La documentación es parte del flujo moderno**

- El flujo domerno apunta a la eficiencia.
- Muchos líderes de desarrollo responden a las mismas preguntas una y otra vez.
- Al usar Slack o MS Teams se pierde el contexto y el contenido.
- Al integrar Code Chat se mantiene el contexto y el contenido en el código.
- El capturar y preservar el conocimiento es parte del activo (asset) de la organización.

**¿Qué debe capturarse?**

- Todas las actividades relacionadas con la base de código de la organización puede capturarse y después podemos decidir si es útil o no...
  - Comentarios
  - Mensajes
  - Issues
  - Errores en producción
  - Sugerencias
  - Diagramas
  - Frecuencia de colaboración
- Todos los metadatos relacionados con el código.

**Donde debe vivir la documentación**

- Debe vivir con el código mismo:

  - Utilidad
  - Conectividad
  - Accesibilidad
  - Interactividad

- Debe ser exportable a otros formatos:
  - Sistema de documentación
  - Sistema de analíticos

**Documentación On Demand**

1. En lugar de pensar qué documentar, fomentar las preguntas.
2. En lugar de esperar al pull request, fomentar las sugerencias.
3. En lugar de armar documentos de inducción (onboarding), dejar que el nuevo desarrollador explique lo que necesita.

**Menu de Codemarks**

- Podemos compartirlo
- Podemos Seguirlo (El sistema nos notificara si hay adiciones en las conversaciones.)
- Podemos copiar el enlace y pegarlo donde nos resulte útil.
- Podemos archivarlo si ya no resulta útil
- Podemos inyectarlo en el código.
- Podemos reposicionarlo si el código ha cambiado pero el codemark sigue siendo útil.
- Se pueden agregar más bloques de código al mismo codemark porque es código relacionado.
- Se le pueden dar tags a los codemarks para agrupar los codemarks y crear una relación entre ellos y saltar de uno a otro, esto se puede convertir en un plan de inducción o un onboard para un nuevo desarrollador.
- Se pueden fitrar y buscar los codemarks.

## RESUMEN

El flujo moderno se trata de la integración de las herramientas que utilizamos todo el tiempo a nuestro editor para lograr mayor productividad. Ejemplo... integrar Github, Jira, Slack a VSCode.

La integración del flujo moderno se consigue en tres etapas:

1. Primero se puede hacer personalmente
   - Pull Request
   - Issue Tracker
   - Comentarios
2. Convencer a alguien o a todo el equipo.
   - Feedback Request
   - Code Chat
   - Transparencia
3. La organización puede tener el mismo beneficio.
   - Documentación
   - Administración
   - Análisis

**El flujo moderno evoluciona así**

Pull Request (Formal) -> Feedback Request (No tan formal) -> Code Chat (Informal) -> Documentación

# El futuro...

## El futuro del desarrollo de software

1. El cambio a desarrollo remoto será permanente.
2. Git es el presente y el futuro.
3. Los environments vendrán precargados con los repositorios.
4. Los environments y los lenguajes de programación se volverán más especializados.
5. Las barreras entre el desarrollo local , el desarrollo cloud, el desarrollo en pares y el desarrollo en equipo, irán desapareciendo.
6. el desarollo de software será más colaborativo y más transparente. AI será tu copiloto.
