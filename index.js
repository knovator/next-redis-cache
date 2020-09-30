var caching = require('./caching');

class NextCache {

  /**
   * 
   * @param {object} redisClient redisInstance
   */
  constructor(redisClient) {
    this.redis = redisClient || null;
    this.config = {
      includes: [], // string | array
      excludes: "*", // string | array
      expire: null, // number | object
      disableCaching: false
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
    if(this.config.disableCaching){
        return next()
    }
    caching(req, res);
  }

  /**
   * 
   * @param {object} req request
   * @param {object} res response
   */
  handler(req, res) {
    caching(req, res);
  }
}

module.exports = NextCache;
