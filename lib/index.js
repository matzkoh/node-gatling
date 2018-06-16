const http = require('http');
const https = require('https');
const { URL } = require('url');
const { dedent, noop, immediate, forever } = require('./util');

class Gatling {
  constructor(method, url) {
    if (!url) {
      url = method;
      method = 'GET';
    }

    this.method = method.toUpperCase();
    this.target = new URL(url);
    this.requestCount = 0;
    this.successCount = 0;
    this.requestErrorCount = 0;
    this.responseErrorCount = 0;
    this.lastResponseCount = 0;
    this.startedAt = 0;
    this.endedAt = 0;
    this.lastInfoTimestamp = 0;
    this.maxQps = 0;
    this.working = false;
    this.init();
  }

  init() {
    const { protocol, hostname, port, pathname, search } = this.target;
    const Agent = protocol === 'https:' ? https.Agent : http.Agent;
    this.agent = new Agent({ keepAlive: true });
    this.options = {
      method: this.method,
      host: hostname,
      port: port || (protocol === 'https:' ? 443 : 80),
      path: pathname + search,
      agent: this.agent,
      headers: {},
    };
    this.name = this.agent.getName(this.options);
    this.lastInfo = [{ currentQps: 0 }, { currentQps: 0 }, { currentQps: 0 }, { currentQps: 0 }];
  }

  setUserAgent(ua) {
    this.options.headers['User-Agent'] = ua;
    return this;
  }

  info() {
    const time = Date.now() - this.lastInfoTimestamp;
    this.lastInfoTimestamp += time;

    const count = this.successCount + this.responseErrorCount - this.lastResponseCount;
    this.lastResponseCount += count;

    const qpsList = [...this.lastInfo.map(info => info.currentQps), (count * 1000) / time];
    const currentQps = qpsList.reduce((a, b) => a + b) / qpsList.length;
    this.maxQps = Math.max(this.maxQps, currentQps);

    const obj = {
      sockets: Object.keys(this.agent.sockets[this.name] || {}).length,
      request: this.requestCount,
      success: this.successCount,
      error: this.requestErrorCount + this.responseErrorCount,
      currentQps,
      maxQps: this.maxQps,
      elapsed: (this.lastInfoTimestamp - this.startedAt) / 1000,
    };

    this.lastInfo.shift();
    this.lastInfo.push(obj);

    return obj;
  }

  start(count = Infinity) {
    const { request } = this.target.protocol === 'https:' ? https : http;
    this.working = true;
    this.startedAt = Date.now();

    const onReqError = () => this.requestErrorCount++;
    const onResError = () => this.responseErrorCount++;
    const onResEnd = () => this.successCount++;
    const onResponse = res => {
      this.requestCount++;
      res.on('data', noop);
      res.once('error', onResError);
      res.once('end', onResEnd);
    };

    (async () => {
      this.info();

      while (0 < count--) {
        if (!this.working) {
          return;
        }

        request(this.options)
          .once('response', onResponse)
          .once('error', onReqError)
          .end();

        await immediate();
      }

      this.stop();
    })();

    return this;
  }

  stop() {
    this.working = false;
    this.endedAt = Date.now();
  }

  processHook() {
    process.on('SIGINT', () => this.stop());
    return this;
  }

  async printInfo() {
    this.processHook();

    return forever(100, () => {
      const info = this.info();
      console.clear();
      console.log(dedent`
         target: ${this.method} ${this.target.href}
        elapsed: ${info.elapsed.toFixed(1)} s
        sockets: ${info.sockets}
        request: ${info.request}
        success: ${info.success}
          error: ${info.error}
            qps: ${info.currentQps.toFixed(2)}
        max qps: ${info.maxQps.toFixed(2)}

        Press Ctrl+C to exit
      `);

      if (!this.working && !info.sockets) {
        return false;
      }
    });
  }
}

module.exports = { Gatling };
