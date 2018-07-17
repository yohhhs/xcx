var API_URL = 'https://www.topasst.com/web'

const GET = (url, params) => {
  return request('GET', url, params)
}
const POST = (url, params) => {
  return request('POST', url, params)
}

const request = (method, url, params) => {
  let promise = new Promise((resolve, reject) => {
    wx.request({
      url: API_URL + url,
      data: params || {},
      method: method,
      header: {
        'Content-Type': method == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
      },
      success(res) {
        resolve(res.data)
      },
      fail() {
        reject()
      }
    })
  })
  return promise
}

module.exports = {
  GET: GET,
  POST: POST
}