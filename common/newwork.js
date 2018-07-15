var API_URL = 'https://www.topasst.com/web'

var requestHandler = {
  params: {},
  success: function (res) {
  },
  fail: function () {
  },
}
const GET = (url, requestHandler) => {
  request('GET', url, requestHandler)
}
const POST = (url, requestHandler) => {
  request('POST', url, requestHandler)
}

const request = (method, url, requestHandler) => {
  var params = requestHandler.params;

  wx.request({
    url: API_URL + url,
    data: params,
    method: method,
    header: {
      'Content-Type': method == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
    },
    success (res) {
      requestHandler.success(res.data)
    },
    fail () {
      requestHandler.fail()
    },
    complete () {
      // complete
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST
}