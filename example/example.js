const { Gatling } = require('..');

(async () => {
  const gun = new Gatling('https://example.com/');

  await gun.start(10000).printInfo();
})();
