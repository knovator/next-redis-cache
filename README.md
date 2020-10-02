# Next Redis Cache

Next Redis Cache is a Next.js compitable library for caching server rendered pages to serve faster then ever. 


## Installation

Use the package manager [npm](https://npmjs.com/) or yarn to install next-redis-cache.

```bash
npm install next-redis-cache --save
```

with yarn package manager.

```bash
yarn add next-redis-cache
```


## Usage

To use this package you need to run your app with custom server, read more from here about [next.js custom server](https://nextjs.org/docs/advanced-features/custom-server).

Once you have next.js custom server setup with your app.

### Use as a middleware

`server.js`

```js
const express = require('express')
const next = require('next')
const NextRedisCache = require('next-redis-cache')


const port = process.env.PORT || 3000
const development = process.env.NODE_ENV !== 'production'
const app = next({ dev: development })
const handler = app.getRequestHandler()
const client = redis.createClient()

const nextRedisCache = new NextRedisCache(client, app, {
  includes: ['/'],  // routes to include for caching
})

app
  .prepare()
  .then(() => {
    const server = express()

    server.get('*', nextRedisCache.middleware, (request, response) =>
      handler(request, response)
    )

    /* starting server */
    return server.listen(port, error => {
      if (error) throw error
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch(error => new Error("Server isn't responded", error))

```

### Use as a handler

- To use Next Redis Cache as a request handler just replace Next.js app's handler with nextRedisCache.handler in above snippet, as give in-below.

`server.js`

```js
    server.get('*', (request, response) =>
      nextRedisCache.handler(request, response)
    )
```

Here, Instance of NextRedisCache initialized with three arguments as following.

|  Name  |          Type         | Required | Default |
|:------:|:---------------------:|:--------:|:--------:|
| Client |      Redis Client     |    ✅    |          |
|   App  |      Next.js App      |    ✅    |          |
| Config | [Configuration  Object](https://github.com/RajnishKatharotiya/next-redis-cache#configuration) |    ❌    |    {}    |


## Configuration
Next Redis Cache comes with some extra controls to manage your redis database and page's caching. ( it's all in your hand ). 

All you need to know about config object.

| Key           | Detail                                                                                                                  | Type             | Example             | Default        |
|---------------|-------------------------------------------------------------------------------------------------------------------------|------------------|---------------------|----------------|
| includes      | Collection of specific routes which should be cache.                                                                    | Array            | ['/', '/blogs/*']   | []             |
| excludes      | Collection of specific routes which shouldn't be cache.                                                                 | Array            | ['/cart', '/*.css'] | [*]            |
| defaultExpire | Expiration time to expire you cache after a particular time. Note: `null` value of this key will set cache permanently. | Number (Seconds) | 3000                | null           |
| expire        | To define different expiration time for different routes.                                                               | Number (Seconds) | 3000                | null           |
| cache         | To disable caching permanently by setting it false.                                                                     | Boolean          | true                | true           |
| prefix        | To identify your cache in store by unique prefix.                                                                       | String           | "__my-cache__"      | "__my-cache__" |
| log           | Log timing of get/set to monitor caching                                                                                | Boolean          | true                | false          |

Note : includes and excludes is using [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) to validate routes.

## Contributing
Pull requests are welcome. For major/valid changes or task from to-do, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
 
### To Do
- Define Test Cases 


## License
[MIT](https://choosealicense.com/licenses/mit/)