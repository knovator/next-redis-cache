const caching = require('./caching');
const { pathToRegexp } = require("path-to-regexp");

/**
 * 
 * @param {string} path url 
 */
function refactorPath (path){
  if(path === '*'){
    return '(.*)'
  }
  return path
}

const opts = {
  strict: false,
  sensitive: false,
  end: true
}


class NextCache {
  /**
   * 
   * @param {object} redisClient redisInstance
   * @param {object} app next app
   * @param {object} config custom configuration
   */
  constructor(redisClient, app, config = {}) {
    let { includes = [], excludes = ["*"], ...restConfig } = config;
    includes = includes.length && includes.map(function (path) {
      const newPath = refactorPath(path)
      return pathToRegexp(newPath, [], opts);
    })
    excludes = excludes.length && excludes.map(function (path) {
      let newPath = refactorPath(path)
      if (includes.length && newPath === "(.*)") return null;
      return pathToRegexp(newPath, [], opts);
    })
    this.redis = redisClient || null;
    this.app = app;
    this.config = {
      includes: includes, // array
      excludes: excludes, // array
      defaultExpire: null, // seconds
      expire: {}, // object of path and seconds pair
      log: false, //boolean
      cache: true, //boolean
      prefix: "__next-redis-cache__",
      ...restConfig
    };
  }

  /**
   *
   * @param {object} redisClient redisInstance
   * set redis client with manually by calling init method.
   * Warning - if client is already set through instance creation.
   * Error - if client isn't exist in argument.
   */
  init(redisClient) {
    if (!redisClient) {
      throw new Error(
        "Redis client is require!! NextCache is triggering init without passing client."
      );
    }
    if (this.redis) {
      console.warn(
        "Redis client is already defined once, setting up new client will shadow previous client!"
      );
    }
    this.redis = redisClient;
  }

  /**
   * middleware
   * @param {object} req request
   * @param {object} res response
   * @param {function} next callback
   */
  middleware(req, res, next) {
    return caching({
      redis: this.redis,
      config: this.config,
      app: this.app, 
      req, 
      res, 
      next
    });
  }

  /**
   * 
   * @param {object} req request
   * @param {object} res response
   */
  handler(req, res) {
    return caching({
      redis: this.redis,
      config: this.config,
      app: this.app, 
      req,
      res,
    });
  }
}

module.exports = NextCache;
