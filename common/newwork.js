var API_URL = 'https://www.topasst.com/web'

var requestHandler = {
  params: {},
  success: function (res) {
  },
  fail: function () {
  },
}

function GET(url, requestHandler) {
  request('GET', url, requestHandler)
}
function POST(url, requestHandler) {
  request('POST', url, requestHandler)
}

function request(method, url, requestHandler) {
  var params = requestHandler.params;

  wx.request({
    url: API_URL + url,
    data: params,
    method: method,
    header: {
      'Content-Type': method == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
    },
    success: function (res) {
      requestHandler.success(res)
    },
    fail: function () {
      requestHandler.fail()
    },
    complete: function () {
      // complete
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST
}