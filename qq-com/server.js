var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  console.log('发请求过来啦！路径（带查询参数）为：' + pathWithQuery)

  if (path === '/') {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(fs.readFileSync('./public/index.html'))
    response.end()
  } else if (path === '/qq.js') {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
    response.write(fs.readFileSync('./public/qq.js'))
    response.end()
  } else if (path === '/friends.json') {
    response.statusCode = 200
    response.setHeader('Content-Type', 'application/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', 'http://zk.com:9991')
    response.write(fs.readFileSync('./public/friends.json'))
    response.end()
  } else if (path === '/friends.js') {
    //jsonp定向分享   其他限制这里不做实现
    console.log(request.headers["referer"])
    if (request.headers["referer"].indexOf("http://zk.com:9991") === 0) {
      response.statusCode = 200
      response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
      // const string = fs.readFileSync('./public/friends.js').toString()  优化
      const string = `window['{{xxx}}']({{ data }})`
      const data = fs.readFileSync('./public/friends.json').toString()
      const string2 = string.replace('{{ data }}', data).replace('{{xxx}}', query.callback)
      response.write(string2)
      response.end()
    } else {
      response.statusCode = 404
      response.end()
    }
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(`你输入的路径不存在对应的内容`)
    response.end()
  }

})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)
