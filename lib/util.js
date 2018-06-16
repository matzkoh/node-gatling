const noop = () => {};
const nextTick = () => new Promise(resolve => process.nextTick(resolve));
const immediate = () => new Promise(resolve => setImmediate(resolve));
const forever = async (ms, fn) => {
  let t0 = Date.now();

  for (;;) {
    await immediate();

    const time = Date.now() - t0;

    if (time < ms) {
      continue;
    }

    t0 += ms;

    if ((await fn(time)) === false) {
      return;
    }
  }
};

const dedent = (strings, ...args) => {
  strings = strings.slice();
  strings[0] = strings[0].replace(/^\n/, '');
  strings[strings.length - 1] = strings[strings.length - 1].replace(/\n(?:(?!\n)\s)*$/, '');
  const all = strings.join('');
  const indents = all.match(/^(?:(?!\n)\s)+/gm);
  if (indents) {
    const indent = Math.min(...indents.map(s => s.length));
    const reg = new RegExp(`^(?:(?!\\n)\\s){${indent}}`, 'gm');
    strings = strings.map(s => s.replace(reg, ''));
  }
  return String.raw({ raw: strings }, ...args);
};

module.exports = { dedent, noop, nextTick, immediate, forever };
