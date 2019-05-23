// component/secret/secret.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: Number,//类型
      value: 0//默认值
    }
    // bodyH:0
  },

  /**
   * 组件的初始数据
   */
  data: {
    bodyH:0,
    agree:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel: function() {
      this.setData({
        agree:false
      })
      //在这里添加所要监听的事件，事件名为eventListener（这个是页面A要监听的事件），参数是num
      this.triggerEvent('eventListener',{agree:this.data.agree})
    },
    ok: function() {
      this.setData({
        agree: true
      })
      //在这里添加所要监听的事件，事件名为eventListener（这个是页面A要监听的事件），参数是num
      this.triggerEvent('eventListener', { agree: this.data.agree })
    }
  },
  lifetimes:{
    ready(){
      var that = this
      console.log(this.properties)
      this.setData({
        bodyH:that.properties.height
      })
    }
  },
 
})
