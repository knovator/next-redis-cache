var NextCache = require('../index');

const cacheHandler = new NextCache("hello");

cacheHandler.handler();
cacheHandler.middleware();
// cacheHandler.#caching;
console.log(cacheHandler);