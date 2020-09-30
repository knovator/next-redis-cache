const validatePath = require('./validatePath');

/**
 * 
 * @param {boolean} shouldLog wether to show or not
 * @param {string} content printing message
 */
function logger(shouldLog, content) {
    shouldLog && console.log(content)
}

/**
 * 
 * @param {object} req request
 * @param {object} res response
 */
function caching({redis, config, app, req, res, next}) {
    const { log, includes, excludes } = config;
    const { path, query } = req
    const isPathValidated = validatePath(path, includes, excludes)
    if(isPathValidated){
        logger(log, `${path} : ${new Date()}`)
        const key = `__express__${req.originalUrl || req.url}`
        /** 
         * try to get already cached page from redis store.
         * if err occur on getting page - will render error component via app
         * if cache found will render page from their directly.
         * else render page as per current route via app and set to redis for future request.
         */
        return redis.get(key, async function(err, cachedHtml) {

            if(err){
                return app.renderError(e, req, res, path, query)
            }

            if(cachedHtml){
                logger(log, `HIT: ${path} : ${new Date()}`)
                return res.send(cachedHtml)
            } 

            try {
                const html = await app.renderToHTML(req, res, path, query)
                redis.setex(key, 172800, html)
                logger(log, `MISSED: ${path} : ${new Date()}`)
                return res.send(html)
            } catch (error) {
                return app.renderError(error, req, res, path, query)
            }
            
        });
    } else if(next) {
        return next();
    } 
    const handler = app.getRequestHandler()
    return handler(req, res, path, query);
}

module.exports = caching;