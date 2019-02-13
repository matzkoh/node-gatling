[![CircleCI](https://img.shields.io/circleci/project/github/matzkoh/node-gatling.svg)](https://circleci.com/gh/matzkoh/node-gatling)
[![Renovate](https://badges.renovateapi.com/github/matzkoh/node-gatling)](https://renovatebot.com/)
[![npm](https://img.shields.io/npm/v/@matzkoh/node-gatling.svg)](https://www.npmjs.com/package/@matzkoh/node-gatling)
![node](https://img.shields.io/node/v/@matzkoh/node-gatling.svg)
![License](https://img.shields.io/npm/l/@matzkoh/node-gatling.svg)

# node-gatling

## What is this?

A tool that send huge number of http requests.

## How to use

```js
const { Gatling } = require('..');

(async () => {
  const gun = new Gatling('https://example.com/');

  await gun.start(10000).printInfo();

  // WARN: Infinity
  // await gun.start().printInfo();
})();
```

Also in [example/example.js](example/example.js).

```sh
$ node example/example.js
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
