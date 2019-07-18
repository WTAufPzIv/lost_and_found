var ajax = require('../../../utils/ajax.js')
Page({
  data: {
    screenHeight: 0,
    statusBarHeight: 0,
    empty: 'none',
    empty: 'flex',
    mypost: [],
    opacity: 0,
    key: '',
    needLogin: 'flex',
    pageNum: 1,
    type: 'left',
    total: 1,
    setArray: ['编辑启示', '关闭启示'],
    setIndex: 0
  },
  onLoad: function() {
    var that = this
    var flag = wx.getStorageSync('key') || ''
    if (flag == '') {
      this.setData({
        needLogin: 'flex'
      })
    } else {
      this.setData({
        needLogin: 'none',
        key: flag
      })
      wx.showLoading({
        title: '加载中',
      })
      ajax.request({
        method: 'POST',
        url: 'lost/mylosts',
        data: {
          pageNum: 1,
          pageSize: 10,
          key: that.data.key
        },
        success: function(res) {
          wx.hideLoading();
          console.log(res)
          if (res.data.lostList.length == 0) {
            that.setData({
              empty: 'flex',
              notempty: 'none',
            })
          } else {
            that.setData({
              empty: 'none',
              notempty: 'flex',
              mypost: res.data.lostList,
              total: res.data.totalNum
            })
          }
        }
      })
    }
    var that = this;
    this.setData({
      screenHeight: wx.getSystemInfoSync().windowHeight,
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
    // this.show();
  },
  onReady: function() {
    this.show();
  },
  onShow: function() {
    this.setData({
      type: 'left',
      pageNum: 1
    })
    var that = this
    var flag = wx.getStorageSync('key') || ''
    if (flag == '') {
      this.setData({
        needLogin: 'flex'
      })
    } else {
      this.setData({
        needLogin: 'none',
        key: flag
      })
      wx.showLoading({
        title: '加载中',
      })
      ajax.request({
        method: 'POST',
        url: 'lost/mylosts',
        data: {
          pageNum: 1,
          pageSize: 10,
          key: that.data.key
        },
        success: function(res) {
          wx.hideLoading();
          console.log(res)
          if (res.data.lostList.length == 0) {
            that.setData({
              empty: 'flex',
              notempty: 'none',
            })
          } else {
            that.setData({
              empty: 'none',
              notempty: 'flex',
              mypost: res.data.lostList,
              total: res.data.totalNum
            })
          }
        }
      })
    }
  },
  show: function() {
    // var that = this;
    // var start = this.data.opacity
    // var interval = setInterval(function(){
    //   if (that.data.opacity < 0.9) {
    //     that.setData({
    //       opacity: start + 0.1
    //     })
    //   }
    //   else {
    //     clearInterval(interval);
    //   }
    //   start = that.data.opacity
    // }, 1)
    this.setData({
      opacity: 1
    })
  },
  back: function() {
    wx.navigateBack({
      delt: 1
    })
  },
  del: function() {
    wx.showModal({
      title: '删除',
      content: '确认删除这条启示？',
    })
  },
  gotodetail: function(e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: this.data.type == 'left' ? '../../detail/detail?id=' + e.currentTarget.id + '&type=lost' : '../../detail/detail?id=' + e.currentTarget.id + '&type=found'
    })
  },
  lost: function() {
    var that = this
    this.setData({
      type: 'left'
    })
    wx.showLoading({
      title: '加载中',
    })
    ajax.request({
      method: 'POST',
      url: 'lost/mylosts',
      data: {
        pageNum: 1,
        pageSize: 10,
        key: that.data.key
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        if (res.data.lostList.length == 0) {
          that.setData({
            empty: 'flex',
            notempty: 'none',
          })
        } else {
          that.setData({
            empty: 'none',
            notempty: 'flex',
            mypost: res.data.lostList,
            total: res.data.totalNum,
            pageNum: 1
          })
        }
      }
    })
  },
  found: function() {
    var that = this
    this.setData({
      type: 'right'
    })
    wx.showLoading({
      title: '加载中',
    })
    ajax.request({
      method: 'POST',
      url: 'find/myfinds',
      data: {
        pageNum: 1,
        pageSize: 10,
        key: that.data.key
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        if (res.data.findList.length == 0) {
          that.setData({
            empty: 'flex',
            notempty: 'none',
          })
        } else {
          that.setData({
            empty: 'none',
            notempty: 'flex',
            mypost: res.data.findList,
            total: res.data.totalNum,
            pageNum: 1
          })
        }
      }
    })
  },
  loadMore: function() {
    console.log(this.data.total)
    console.log(this.data.pageNum)
    var page = this.data.pageNum
    var arr = this.data.mypost
    var that = this
    if (this.data.total == page) {
      wx.showToast({
        title: '到底啦...',
        image: '../../../img/warning.png'
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      ajax.request({
        method: 'POST',
        url: that.data.type == 'left' ? 'lost/mylosts' : 'find/myfinds',
        data: {
          pageNum: page + 1,
          pageSize: 10,
          key: that.data.key
        },
        success: function(res) {
          console.log(res)
          var flag = that.data.type == 'left' ? res.data.lostList : res.data.findList
          if (flag.length == 0) {
            wx.hideLoading()
            wx.showToast({
              title: '到底啦',
              image: '../../../img/warning.png'
            })
            that.setData({
              pageNum: page + 1
            })
          } else {
            for (var i in flag) {
              arr.push(flag[i])
            }

            that.setData({
              mypost: arr,
              pageNum: page + 1
            })
            wx.hideLoading()
          }
        }
      })
    }
  },
  moreSet: function() {

  },
  bindPickerChange: function(e) {
    var that = this
    console.log(e)
    var id = parseInt(e.target.id)
    console.log(id)
    if (e.detail.value == '0') {
      console.log("000")
      wx.showLoading({
        title: '载入数据'
      })
      ajax.request({
        method: 'POST',
        url: that.data.type == 'left' ? 'lost/one' : 'find/one',
        data: that.data.type == 'left' ? {
          lostId: id,
          key: that.data.key
        } : {
          findId: id,
          key: that.data.key
        },
        success: function(res) {
          if (res.code == 200) {
            console.log(res.data)
            wx.hideLoading()
            wx.navigateTo({
              url: that.data.type == 'left' ? '../../add/add?title=' + res.data.subject + '&address=' + res.data.address + '&phone=' + res.data.contactInformation + '&time=' + res.data.date + '&detail=' + res.data.detail + '&addClass=left' + '&id=' + id + '&img=' + JSON.stringify(res.data.imageUrlList) + '&mode=set' : '../../add/add?title=' + res.data.subject + '&address=' + res.data.address + '&phone=' + res.data.contactInformation + '&time=' + res.data.date + '&detail=' + res.data.detail + '&addClass=right' + '&id=' + id + '&img=' + JSON.stringify(res.data.imageUrlList) + '&mode=set',
            })
          }
        }
      })
    } else {
      console.log("111")
      wx.showModal({
        title: '关闭启示',
        content: '确定关闭并删除该条启事？',
        confirmColor: "#FFD84D",
        success: function(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '删除中',
            })
            ajax.request({
              method: 'POST',
              url: that.data.type == 'left' ? 'lost/delete' : 'find/delete',
              data: that.data.type == 'left' ? {
                lostId: id,
                key: that.data.key
              } : {
                findId: id,
                key: that.data.key
              },
              success: function(result) {
                if (result.code == 200) {
                  wx.hideLoading()
                  console.log(result)
                  that.onShow()
                }
              }
            })
          }
        }
      })
    }
  }
})