const api = 'https://fv215b183.cn/lostandfind/'
function upload(opt) {
 wx.uploadFile({
   method:opt.method || 'GET',
   url: api + opt.url,
   header: {
     'content-type':'multipart/form-data'
   },
   filePath: opt.filepath,
   name: 'file',
   formData:{
     key:opt.key,
     imageId:opt.imgid
   },
   success:function(res) {
     opt.success(res.data)
   }
 })
}
module.exports.upload = upload