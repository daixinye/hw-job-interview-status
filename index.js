const lib = require('./lib')
const Cache = require('simple-fs-cache')
const cache = new Cache()

class HW {
  constructor (username, password) {
    this._username = username
    this._password = password

    this._cacheKey = 'cookie-' + username
  }
  login () {
    return new Promise((resolve, reject) => {
      cache
        .get(this._cacheKey)
        .then(cookie => resolve(cookie))
        .catch(e => {
          lib
            .POST('https://uniportal.huawei.com/uniportal/login.do', {
              actionFlag: 'loginAuthenticate',
              lang: 'zh_CN',
              redirect:
                'http%3A%2F%2Fcareer.huawei.com%2Freccampportal%2Flogin_index.html%3Fredirect%3Dhttp%3A%2F%2Fcareer.huawei.com%2Freccampportal%2Fcampus4_index.html%3Fi%3D25301%23campus4%2Fcontent.html',
              redirect_local: '',
              redirect_modify: '',
              getloginMethod: null,
              uid: this._username,
              password: this._password,
              loginFlag: 'byUid'
            })
            .then(data => {
              const setCookie = data.headers['set-cookie']
              const cookies = setCookie.map(str => str.split(';').shift())
              const cookie = cookies.join(';')
              cache.set(this._cacheKey, cookie, 60 * 60)
              resolve(cookie)
            })
        })
    })
  }
  getStatus (cookie) {
    const URL =
      'http://career.huawei.com' +
      '/reccampportal/services/portal/portaluser/queryMyJobInterviewEvolve'
    return lib.GET(URL, cookie)
  }
}

module.exports = HW
