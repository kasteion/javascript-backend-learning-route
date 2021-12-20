# GLOBALS - NO WINDOW !!!

`__dirname` = Path to current directory
`__filename` = file name
require = function to use modules (CommonJS)
module = info about current module (file)
process = info about env where the program is being executed.

# Modules Setup

Node uses CommonJS, so every file is a module (by default)

Modules = Encapsulated Code (Only share the minimum)

```js
// ./utils.js
const sayHi = (name) => {
  console.log(`Hello there ${name}`);
};

module.exports = {
  sayHi,
};
```

```js
const { sayHi } = require("./utils.js");
```

# Built-in modules

Examples:

**os module**

```js
const os = require("os");

// info about current user
const user = os.userInfo();

// method returns the system uptime in seconds
const uptime = os.uptime();

const currentOS = {
  name: os.type(),
  release: os.release(),
  totalMem: os.totalmem(),
  freeMem: os.freemem(),
};
```

**path module**

**fs module**

**http module**
