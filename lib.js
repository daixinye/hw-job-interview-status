const http = require('http')
const https = require('https')
const url = require('url')

module.exports = {
  GET (URL, cookie) {
    return new Promise((resolve, reject) => {
      const { hostname, pathname, search } = new url.URL(URL)
      const options = {
        hostname,
        path: pathname + search,
        headers: {
          Host: 'career.huawei.com',
          Connection: 'keep-alive',
          'Cache-Control': 'max-age=0',
          'Upgrade-Insecure-Requests': 1,
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8,ja;q=0.7',
          Cookie: cookie
        }
      }

      http.get(options, res => {
        res.setEncoding('utf-8')

        let rawData = ''
        res.on('data', chunk => (rawData += chunk))
        res.on('end', () => {
          rawData = JSON.parse(rawData, 0, 4)
          resolve(rawData)
        })
        res.on('error', e => reject(e))
      })
    })
  },
  POST (URL, postData, cookie = '') {
    return new Promise((resolve, reject) => {
      const { hostname, pathname, search } = new url.URL(URL)
      let body = []
      for (let key in postData) {
        body.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(postData[key])}`
        )
      }
      body = body.join('&')

      const options = {
        hostname,
        path: pathname + search,
        port: 443,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
          Cookie: cookie
        }
      }
      const req = https.request(options, res => {
        let data = ''
        res.setEncoding('utf8')
        res.on('data', chunk => {
          data += chunk
        })
        res.on('end', () => resolve({ headers: res.headers, body: data }))
        res.on('error', e => reject(e))
      })

      req.write(body)
      req.end()
    })
  }
}
