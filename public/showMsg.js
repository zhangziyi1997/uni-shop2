// 封装的展示消息提示的方法
class showMsg {
  constructor(title,icon="success",duration=1300,mask=true) {
    this.title = title
  	this.icon = icon
  	this.duration = duration
  	this.mask = mask
  }
  
  // 消息提示框：自动消失
  showtoast(){
  	uni.showToast({
  	    title: this.title,
        icon:this.icon,
  	    duration: this.duration,
        mask:this.mask
  	});
  }
  // 消息提示框：手动消失 需要调用uni.hideToast();
  showloading(){
  	uni.showLoading({
  	    title: this.title,
        mask:this.mask
  	});
  }
}


export default showMsg