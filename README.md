
# Serverful/Public

> An extension to automate file serving in a specific directory.


# Features
* Automatic file serving of a directory.

## Links
* [Documentations](https://github.com/ServerfulArch/Public/blob/master/Documentation/Index.md)
* [Github](https://github.com/Serverful/Public)

## Installation
`npm install @serverful/public`
```js
const Public = require("@serverful/public");
// ...
```


# Usage
Serve `/public/*` resources automatically.
```js
const MyServer = new Serverful(80);
MyServer.Gateway("public", Public("./WebContent/Public/"));
```


This module is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0).
