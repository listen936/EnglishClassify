// miniprogram/pages/test/test.js
const app = getApp();
const words = [
  {
    img: '../../img/good.png',
    text: 'clerk'
  },
  {
    img: '../../img/down.png',
    text: 'garage'
  },
  {
    img: '../../img/steak.png',
    text: 'fast'
  },
  {
    img: '../../img/oven.png',
    text: 'hurry'
  },
  {
    img: '../../img/written.png',
    text: 'tomato'
  },
  {
    img: '../../img/hold.png',
    text: 'The past is past'
  },
  {
    img: '../../img/life.png',
    text: 'Please call Lucy and ask her to meet Bob'
  }
];
const RecorderManager = wx.getRecorderManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: [true, false, false, false, false, false, false],
    word: words[0],
    recording:false, //是否在录音
    gbScore:[], //英式得分
    usScore: [], //美式得分
    n:0,
    START:0, //录音开始时间戳
    over:true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  // 开始录音
  start(){
    if (!this.data.recording){
      this.setData({
        START: new Date().getTime(),
        recording:true
      })
      wx.showLoading({
        title: '录音中...',
      })
      RecorderManager.start()
    }
  },
  // 停止录音
  stop(){
    let _this = this;
    let END = new Date().getTime();
    let time = END - this.data.START;
    console.log(time);
    if (time < 400){
      console.log('click');
    }else{
      wx.hideLoading();
      RecorderManager.stop();
      this.setData({
        recording: false
      })
      RecorderManager.onStop(res =>{
        console.log(res)
        _this.upload(_this.data.word.text, res.tempFilePath);
      })
      _this.upload(_this.data.word.text,"tempFilePath");
    }
  },
  // 上传音频评测
  upload(text,filePath){
    let _this = this;

    // wx.request({
    //   url: 'http://dev01.io.speechx.cn/api/v1/classifyReport',
    //   method:"POST",
    //   data:{
    //     mediaId: id,
    //     text: text
    //   },
    //   success(res){
    //     console.log(res)
    //   }
    // })
    console.log(words);
    let index = _this.data.n+1;
    if(index < 7){
      let newProgress = _this.data.progress;
      newProgress[index] = true;
      _this.setData({
        word: words[index],
        n: index,
        progress: newProgress
      })
    }else{
      _this.setData({
        over:false
      })
    }
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})