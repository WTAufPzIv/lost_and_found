const app = getApp()
const ajax = require('../../utils/ajax.js')
Page({
  data: {
    dataarr: [],
    notChoose: 'none',
    allok: 'none',
    needLogin: 'none',
    schoolName: "",
    className: "全部",
    // lostList:Jsondata.lostList,
    screenHeight: 0,
    statusBarHeight: 0,
    classList: 'none',
    classListHeight: 0,
    classListopacity: 0,
    key: '',
    empty: 'flex',
    noempty: 'none',
    pageNum: 1,
    total: 0,
    setArray: ['编辑启示', '关闭启示'],
    setIndex: 0
  },
  onShow() {
    var that = this
    var flag = wx.getStorageSync('key') || ''
    if (flag == '') {
      this.setData({
        notChoose: 'none',
        allok: 'none',
        needLogin: 'block',
      })
    } else {
      this.setData({
        key: flag
      })
      var school = wx.getStorageSync('school') || ''
      if (school == '') {
        this.setData({
          notChoose: 'block',
          allok: 'none',
          needLogin: 'none',
        })
      } else {
        this.setData({
          notChoose: 'none',
          allok: 'block',
          needLogin: 'none',
          schoolName: school,
          pageNum: 1
        })

        ajax.request({
          method: 'POST',
          url: 'lost/listall',
          data: {
            pageNum: 1,
            pageSize: 10,
            category: '全部',
            key: that.data.key
          },
          success: function(res) {
            console.log(res)
            that.setData({
              dataarr: res.data.lostList,
              total: res.data.total
            })
            if (that.data.dataarr.length == 0) {
              that.setData({
                empty: 'flex',
                noempty: 'none'
              })
            } else {
              that.setData({
                empty: 'none',
                noempty: 'block'
              })
            }

          }
        })
      }
    }
  },
  onLoad: function() {
    var that = this
    var flag = wx.getStorageSync('key') || ''
    if (flag == '') {
      this.setData({
        notChoose: 'none',
        allok: 'none',
        needLogin: 'block',
      })
    } else {

      this.setData({
        key: flag
      })
      var school = wx.getStorageSync('school') || ''
      if (school == '') {
        this.setData({
          notChoose: 'block',
          allok: 'none',
          needLogin: 'none',
        })
      } else {
        this.setData({
          notChoose: 'none',
          allok: 'block',
          needLogin: 'none',
          schoolName: school,
          className: '全部'
        })
        wx.showLoading({
          title: '加载中...',
        })
        ajax.request({
          method: 'POST',
          url: 'lost/listall',
          data: {
            pageNum: 10,
            pageSize: 10,
            category: '全部',
            key: that.data.key
          },
          success: function(res) {
            console.log(res)
            that.setData({
              dataarr: res.data.lostList,
              total: res.data.total
            })
            if (that.data.dataarr.length == 0) {
              that.setData({
                empty: 'flex',
                noempty: 'none'
              })
            } else {
              that.setData({
                empty: 'none',
                noempty: 'block'
              })
            }
            wx.hideLoading();
          }
        })
      }
    }
    this.setData({
      screenHeight: wx.getSystemInfoSync().windowHeight
    })
    console.log(wx.getSystemInfoSync().windowHeight)
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res.statusBarHeight);
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
  },
  openClassList: function() {
    var that = this
    if (this.data.classListHeight == 0) {
      this.setData({
        classList: 'flex'
      }, () => {
        that.setData({
          classListHeight: 160,
          classListopacity: 1
        })
      })
    } else {
      this.setData({
        classListHeight: 0,
        classListopacity: 0
      }, () => {
        setTimeout(function() {
          that.setData({
            classList: 'none'
          })
        }, 100)
      })
    }
  },
  gotoSearch: function() {
    wx.navigateTo({
      url: '../search/search?type=lost',
    })
  },
  gotodetail: function(e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.id + '&type=lost',
    })
  },
  add: function() {
    wx.navigateTo({
      url: '../add/add?addClass=left',
    })
  },
  goLogin: function() {
    wx.switchTab({
      url: '../mine/mine'
    })
  },
  goSchool: function() {
    wx.switchTab({
      url: '../mine/mine'
    })
  },
  changeClass: function(e) {
    var that = this
    console.log(e.target.id)
    wx.showLoading({
      title: '加载中',
    })
    ajax.request({
      method: 'POST',
      url: 'lost/listall',
      data: {
        pageNum: 1,
        pageSize: 10,
        category: e.target.id,
        key: this.data.key
      },
      success: function(res) {
        var t = that
        console.log(res)
        that.setData({
          dataarr: res.data.lostList,
          className: e.target.id,
          classListHeight: 0,
          classListopacity: 0,
          pageNum: 1,
          total: res.data.total
        }, () => {
          setTimeout(function() {
            t.setData({
              classList: 'none'
            })
          }, 100)
        })
        if (that.data.dataarr.length == 0) {
          that.setData({
            empty: 'flex',
            noempty: 'none'
          })
        } else {
          that.setData({
            empty: 'none',
            noempty: 'block'
          })
        }
        wx.hideLoading()
      }
    })
  },
  loadMore: function() {
    console.log(this.data.total)
    console.log(this.data.pageNum)
    var page = this.data.pageNum
    var arr = this.data.dataarr
    var that = this
    if (this.data.total == page) {
      wx.showToast({
        title: '到底啦...',
        image: '../../img/warning.png'
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      ajax.request({
        method: 'POST',
        url: 'lost/listall',
        data: {
          pageNum: page + 1,
          pageSize: 10,
          category: that.data.className,
          key: that.data.key
        },
        success: function(res) {
          console.log(res)
          if (res.data.lostList.length == 0) {
            wx.hideLoading()
            wx.showToast({
              title: '到底了',
              image: '../../img/warning.pnf'
            })
            that.setData({
              pageNum: page + 1
            })
          } else {
            for (var i in res.data.lostList) {
              arr.push(res.data.lostList[i])
              that.setData({
                dataarr: arr,
                pageNum: page + 1
              })
            }
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
        url: 'lost/one',
        data: {
          lostId: id,
          key: that.data.key
        },
        success: function(res) {
          if (res.code == 200) {
            console.log(res.data)
            wx.hideLoading()
            wx.navigateTo({
              url: '../add/add?title=' + res.data.subject + '&address=' + res.data.address + '&phone=' + res.data.contactInformation + '&time=' + res.data.date + '&detail=' + res.data.detail + '&addClass=left' + '&id=' + id + '&img=' + JSON.stringify(res.data.imageUrlList) + '&mode=set',
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
              url: 'lost/delete',
              data: {
                lostId: id,
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