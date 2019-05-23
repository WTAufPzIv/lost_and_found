// component/wave/wave.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: Number,//类型
      value: 0//默认值
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowInfo: false,
    bodyH:330
  },

  /**
   * 组件的方法列表
   */
  methods: {
    __hideInfo: function () {
      this.setData({
        isShowInfo: true
      })
    }
  }
})
