// 封装ajax请求
const api = 'https://fv215b183.cn/lostandfind/'
function request(opt){
  wx.request({
    method:opt.method || 'GET',
    url:api + opt.url,
    header:{
      'content-type': 'application/x-www-form-urlencoded'//默认请求头
    },
    data:opt.data,
    success:function(res){
      opt.success(res.data)
    },
    fail:function(res){
      opt.fail(res)
    }
  })
}
module.exports.request = request