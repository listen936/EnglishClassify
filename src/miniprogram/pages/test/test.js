// miniprogram/pages/test/test.js
const app = getApp();
const words = [{
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
    recording: false, //是否在录音
    gbScore: [], //英式得分
    usScore: [], //美式得分
    gb: 0, //英式总得分
    us: 0, //美式总得分
    n: 0,
    START: 0, //录音开始时间戳
    over: true,
    canvasImg:'',
    shadow:true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.poster();
  },
  // 开始录音
  start() {
    if (!this.data.recording) {
      this.setData({
        START: new Date().getTime(),
        recording: true
      })
      
      RecorderManager.start({
        success(){
          wx.showLoading({
            title: '录音中...',
          })
        }
      });
    }
  },
  // 停止录音
  stop() {
    let _this = this;
    let END = new Date().getTime();
    let time = END - this.data.START;
    if (time < 400) {

    } else {
      wx.hideLoading();
      RecorderManager.stop();
      this.setData({
        recording: false
      })
      RecorderManager.onStop((res) => {
        _this.upload(_this.data.word.text, res.tempFilePath);
      })
    }
  },
  // 上传音频评测
  upload(text, filePath) {
   wx.showLoading({
     title: '上传中...',
   })
    let _this = this;
    wx.uploadFile({
      url: 'https://api02.speechx.cn/accent/v1/classifyReport',
      filePath: filePath,
      name: 'myWavfile',
      formData: {
        text: text
      },
      success(res) {
        wx.hideLoading();
        let scoreData = JSON.parse(res.data);
        console.log(scoreData);
        if (scoreData.errcode !== "0"){
          wx.showToast({
            title: '请重新录制',
            icon: 'none',
            duration:1500
          })
        }else{
          let index = _this.data.n + 1;
          _this.setData({
            [`gbScore[${index - 1}]`]: Number(scoreData.data.gb * 100).toFixed(1),
            [`usScore[${index - 1}]`]: Number(scoreData.data.us * 100).toFixed(1),
          })
          if (index < 7) {
            wx.showToast({
              title: '下一题',
              icon: 'success'
            })
            let newProgress = _this.data.progress;
            newProgress[index] = true;
            _this.setData({
              word: words[index],
              n: index,
              progress: newProgress,
              // usScore: us
            })
          } else {

            let gbAll = 0,
              usAll = 0;
            for (let i = 0; i < 7; i++) {
              gbAll += Number(_this.data.gbScore[i]);
              usAll += Number(_this.data.usScore[i]);

            }
            _this.setData({
              over: false,
              gb: (Number(gbAll * 10 / 7 / 10).toFixed(1)) + "%",
              us: (Number(usAll * 10 / 7 / 10).toFixed(1)) + "%"
            })

          }
          wx.hideToast();
        }
      }

    })
  },
  // 生成海报
  poster(){
    wx.showLoading({
      title: '正在生成中...',
    })
    var that = this;
    var rpx;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function (res) {
        rpx = (res.windowWidth / 375) / 2;
      },
    })
    const ctx = wx.createCanvasContext('poster', this);
    ctx.setFillStyle('white');
    ctx.fillRect(0, 0, 750 * rpx, 1334 * rpx);
   

    // 绘制头像
    ctx.save();
    ctx.beginPath();

    // console.log("head："+that.data.headImg);

    ctx.arc( 375* rpx, 120 * rpx, 60 * rpx, 0, 2 * Math.PI);
    ctx.setStrokeStyle('white');
    ctx.stroke();
    ctx.clip();
    ctx.drawImage('../../img/start.png', 315 * rpx, 60* rpx, 120* rpx, 120 * rpx);
    ctx.restore();
   

    //绘制名字
    ctx.setFillStyle('black');
    // let headText = "小生不才" + '';
    ctx.setFontSize(34 * rpx);
    ctx.setTextBaseline("top");
    // ctx.fillText(headText, 200 * rpx, 220 * rpx);
    ctx.fillText('英美音评测结果', 270 * rpx, 220 * rpx);


    ctx.drawImage('../../img/result.png', 75 * rpx, 330* rpx, 600* rpx, 293 * rpx);

    //绘制结果
    ctx.setFillStyle('black');
    ctx.setFontSize(34 * rpx);
    ctx.setTextBaseline("top");
    ctx.fillText("英式",  200 * rpx, 680 * rpx);
    ctx.fillText("美式", 485 * rpx, 680 * rpx);

    ctx.setFillStyle("rgba(137,93,93,1)");
    ctx.setFontSize(56 * rpx);
    ctx.fillText(that.data.gb, 160 * rpx, 740 * rpx);
    ctx.fillText(that.data.us, 445 * rpx, 740 * rpx);

    ctx.setFillStyle('black');
    ctx.setFontSize(34 * rpx);
    ctx.setTextBaseline("top");
    ctx.fillText("你也来试试吧！", 270 * rpx, 870 * rpx);

    ctx.drawImage('../../img/oven.png', 270 * rpx, 950 * rpx, 200 * rpx, 200 * rpx);
    ctx.draw(false,()=>{
      that.saveCanvasImg();
    });
  },
  // 保存图片
  saveCanvasImg(){
    let _this = this;
    wx.canvasToTempFilePath({
      canvasId: 'poster',
      fileType: 'jpg',
      success: function (data) {
        wx.hideLoading();
        _this.setData({
          canvasImg: data.tempFilePath,
          shadow:false
        })
      }
    })
  },
  savaToAblum(){
    let  _this = this;
    wx.saveImageToPhotosAlbum({
      filePath:this.data.canvasImg,
      success: function (res) {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        });
        _this.close();
      }
    })
  },
  close(){
    this.setData({
      shadow:true
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    if (e.from == 'menu'){
      return {
        title:'快来测试一下你的发音是英式还是美式吧',
        path:'pages/start/start',
        imageUrl:'../../img/start.png'
      }
    }

  }
})