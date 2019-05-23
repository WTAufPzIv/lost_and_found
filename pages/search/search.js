var jsondata = require('../../utils/classname.js')
const ajax = require('../../utils/ajax.js')
Page({
  data: {
    note:'校园卡',
    screenHeight: 0,
    statusBarHeight: 0,
    his:[],
    text:'',
    hisdis:'none',
    found:"none",
    notfound:"none",
    result:[],
    opacity:0,
    pageNum:1,
    key:'',
    total:0,
    type:'',
    pageNum:1,
    keyWord:''
  },
  getrand:function(min,max){
    var rang = max - min;
    var rand = Math.random();
    var num = min+Math.round(rand * rang);
    return num;
  },
  onLoad:function(e){
    this.setData({
      type:e.type
    })
    var that = this
    var arr = wx.getStorageSync('his') || [];
    var flag = wx.getStorageSync('key') || ''
    if(flag == ''){
      wx.showModal({
        title: '未登录',
        content: '请先授权登录',
        showCancel:false,
        confirmColor:'#FFD84D',
        success:function(res){
          if(res.confirm){
            wx.navigateBack({
              delete:1
            })
          }
        }
      })
    }
    else{
      this.setData({
        key:flag
      })
    }
    if(arr.length > 0){
      this.setData({
        his:arr
      })
    }
    console.log(arr)
    this.setData({
      result: resultjson.result
    })
  },
  onReady: function () {
    console.log(this.getrand(0, 10))
    var that = this;
    this.setData({
      screenHeight: wx.getSystemInfoSync().windowHeight,
      note: jsondata.classList[that.getrand(1, 10)]
    })
    console.log(wx.getSystemInfoSync().windowHeight)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.statusBarHeight);
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
  },
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  goSearch:function(){
    var that = this
    if (this.data.text.match(/^[ ]*$/)){
      this.setData({
        text: ''
      })
      wx.showToast({
        title: '输入不合法',
        image:"../../img/fail.png",
        duration: 2000
      })
      
    }
    else{
      var arr = wx.getStorageSync('his') || [];
      var flag = -1;
      if (arr.length > 0) {
        for (var j in arr) {
          if (arr[j] == this.data.text) {
            flag = j;
            arr.splice(j, 1);
          }
        }
      }
      
      
      arr.push(this.data.text);
      this.setData({
        his: arr,
        keyWord:that.data.text
      })
      wx.setStorage({
        key: 'his',
        data: arr
      })
     

      // var arr1 = wx.getStorageSync('his') || [];
      // if (arr1.length > 0) {
      //   this.setData({
      //     his: arr1
      //   })
      // }
     
    // 接受后台搜索数据
    console.log(this.data.type)
    
    wx.showLoading({
      title: '搜索中',
    })
      ajax.request({
        method: 'POST',
        url: that.data.type == 'lost'?'lost/search':'find/search',
        data: {
          keyWord: that.data.text,
          pageNum: that.data.pageNum,
          pageSize: 10,
          key: that.data.key
        },
        success: function (res) {
          console.log(res)
          wx.hideLoading()
          var flag = that.data.type == 'lost' ? res.data.lostList : res.data.findList
          if (flag.length > 0) {
            var t = that
            that.setData({
              opacity:0,
              found: "flex",
              notfound:'none'
            },()=>{
              setTimeout(function(){
                t.show();
              },100)
            })
          }
          else {
            var t = that
            that.setData({
              opacity: 0,
              notfound: 'flex',
              found:'none'
            }, () => {
              setTimeout(function () {
                t.show();
              }, 100)
            })
          }
          console.log(res)
          that.setData({
            result: that.data.type == 'lost'?res.data.lostList:res.data.findList,
            total:res.data.total
          })
        }
      })
    }
  },
  show:function(){
    var that = this;
    var start = this.data.opacity
    var interval = setInterval(function(){
      if(that.data.opacity < 1){
        that.setData({
          opacity:start+0.1
        })
      }
      else{
        clearInterval(interval);
      }
      start = that.data.opacity
    },1)
  },
  changeInput:function(e){
    this.setData({
      text: e.detail.value
    })
  },
  delhis:function(){
var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除历史记录？',
      success(res) {
        if (res.confirm) {
          wx.removeStorage({
      key: 'his'
    })
    that.setData({
      his: []
    })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  openhis:function(){
    if(this.data.hisdis == "none"){
      this.setData({
        hisdis:"flex"
      })
    }
  },
  closehis:function(){
    if(this.data.hisdis == "flex"){
      this.setData({
        hisdis:'none'
      })
    }
  },
  detail:function(e){
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: this.data.type == 'lost'?'../detail/detail?id='+ e.currentTarget.id+'&type=lost':'../detail/detail?id='+e.currentTarget.id + '&type=found'
    })
  },
  gohisSearch:function(e){
    this.setData({
      keyWord:e.currentTarget.id
    })
    var that = this
    wx.showLoading({
      title: '搜索中',
    })
    ajax.request({
      method: 'POST',
      url: that.data.type == 'lost' ? 'lost/search' : 'find/search',
      data: {
        keyWord: e.currentTarget.id,
        pageNum: that.data.pageNum,
        pageSize: 10,
        key: that.data.key
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        var flag = that.data.type == 'lost' ? res.data.lostList : res.data.findList
        if (flag.length > 0) {
          var t = that
          that.setData({
            opacity: 0,
            found: "flex",
            notfound: 'none'
          }, () => {
            setTimeout(function () {
              t.show();
            }, 100)
          })
        }
        else {
          var t = that
          that.setData({
            opacity: 0,
            notfound: 'flex',
            found: 'none'
          }, () => {
            setTimeout(function () {
              t.show();
            }, 100)
          })
        }
        console.log(res)
        that.setData({
          result: that.data.type == 'lost' ? res.data.lostList : res.data.findList,
          total: res.data.total
        })
      }
    })
  },
  loadMore: function () {
    var page = this.data.pageNum
    var arr = this.data.result
    var that = this
    if (this.data.total == page) {
      wx.showToast({
        title: '到底啦',
        image: '../../img/warning.png'
      })
    }
    else {
      wx.showLoading({
        title: '加载中',
      })
      ajax.request({
        method: 'POST',
        url: that.data.type == 'lost' ? 'lost/search' : 'find/search',
        data: {
          pageNum: page+1,
          pageSize: 10,
          keyWord: that.data.keyWord,
          key: that.data.key
        },
        success: function (res) {
          console.log(res)
          var flag = that.data.type == 'lost' ? res.data.lostList : res.data.findList
          if (flag.length == 0) {
            wx.hideLoading()
            wx.showToast({
              title: '到底了',
              image:'../../img/warning.png'
              
            })
            that.setData({
              pageNum: page+1
            })
          }
          else {
            for (var i in flag) {
              arr.push(flag[i])
              that.setData({
                result: arr,
                pageNum: page+1
              })
            }
            wx.hideLoading()
          }
        }
      })
    }
  }
})