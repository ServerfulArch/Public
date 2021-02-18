
# Serverful/Public
## A file serving extension for the Serverful core

[[Contribute](#issues-contributing--license)] [[Documentation](https://github.com/ServerfulArch/Core/blob/v4/Documentation/Index.md)]

> A file serving extension for the Serverful core


# Main Features
* Automatic file serving of a directory.

## Links
* [Documentations](https://github.com/ServerfulArch/Public/blob/master/Documentation/Index.md)
* [Github](https://github.com/Serverful/Public)

## Install/Import
`npm install ServerfulArch/Public`
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

# Issues, Contributing & License
Before making an issue for a bug or feature submittion, please ensure that it hasn't already been created [on the repository](https://github.com/ServerfulArch/Public/issues).

This module is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0).
