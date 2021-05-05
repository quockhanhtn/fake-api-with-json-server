const jsonServer = require('json-server')
const queryString = require('query-string')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()


// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);


// Add custom routes before JSON Server router
server.get('/echo', (req, res) => res.jsonp(req.query))


//#region body-parser
// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
    req.body.updatedAt = Date.now()
  }
  else if (req.method === 'PUT' || req.method === 'PATCH') {
    req.body.updatedAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})
//#endregion



//#region Custom response (output)
router.render = (req, res) => {
  let paras = queryString.parse(req._parsedUrl.query);

  const headers = res.getHeaders();
  const totalCountHeaders = headers['x-total-count'];

  console.log('\n-----------------------------\n');
  console.log(totalCountHeaders.__actions__[1].func.size());
  // console.log("-------------");
  // console.log(totalCountHeaders);
  // console.log("-------------");
  // console.log(totalCountHeaders.__wrapped__.length);

  if (req.method === 'GET' && totalCountHeaders) {
    const result = {
      data: res.locals.data,
      pagination: {
        _limit: Number.parseInt(paras._limit),
        _page: Number.parseInt(paras._page)
      }
    }
    return res.jsonp(result);
  }

  // default response
  res.jsonp(res.locals.data);
}
//#endregion


//#region Custom router
server.use('/api', router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
//#endregion



