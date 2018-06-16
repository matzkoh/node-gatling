[![CircleCI](https://img.shields.io/circleci/project/github/matzkoh/node-gatling.svg)](https://circleci.com/gh/matzkoh/node-gatling)
[![David](https://img.shields.io/david/matzkoh/node-gatling.svg)](https://david-dm.org/matzkoh/node-gatling)
[![npm](https://img.shields.io/npm/v/@matzkoh/node-gatling.svg)](https://www.npmjs.com/package/@matzkoh/node-gatling)
![node](https://img.shields.io/node/v/@matzkoh/node-gatling.svg)
![License](https://img.shields.io/npm/l/@matzkoh/node-gatling.svg)

# node-gatling

## What is this?

A tool that send huge number of http requests.

## How to use

```js
const { Gatling } = require('node-gatling');

(async () => {
  const gun = new Gatling('http://example.com/');

  await gun.start().printInfo();
})();
```

Also in [sample.js](sample.js).

```sh
$ node sample.js
```

```sh
sockets: 169
request: 16265
success: 16265
  error: 0
    qps: 1526.00
max qps: 1594.00
```

- `sockets`
  - number of socket connections that is in use
- `request`
  - number of requests
- `success`
  - number of responses
- `error`
  - number of error responses
- `qps`
  - current qps (queries per second)
- `max qps`
  - max qps in this Gatling

## Features

- Specify http method
  - `new Gatling(method, url)`
- Change UA
  - `gatling.setUserAgent(ua)`
- Intercept
  - `gatling.stop()`
