// miniprogram/pages/start/start.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getInfo(e){
    console.log(e)
    wx.navigateTo({
      url: "../test/test",
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from == 'menu') {
      return {
        title: '快来测试一下你的发音是英式还是美式吧',
        path: 'pages/start/start',
        imageUrl: '../../img/start.png'
      }
    }
  }
})