/**
 * [YangCongHelper]
 * @param  {[type]} window    [global]
 * @param  {[type]} jq        [jQuery]
 * @param  {[type]} undefined [undefined]
 * @return {[type]}           [nothing]
 */
;(function(window, jq, undefined){
  /**
   * [YangCongHelper Class]
   */
  var YangCongHelper = function(){
    this.init();
    this.buildNotify();
    this.mode = 'manual';

  };
  /**
   * [init get all element]
   * @return {[type]} [nothing]
   */
  YangCongHelper.prototype.init = function(){
    this.btnSubmit = $('[ng-show="submitButton"]:visible')
    this.btnNext = $('div.btn.btn-success.btn-embossed.ng-binding').not('.ng-hide');
    this.options = $('.option-container .option').not('.ng-hide');
    this.input = $('#formula-input:visible');

  };
  /**
   * [getStatus get current page status]
   * @return {[type]} [description]
   */
  YangCongHelper.prototype.getStatus = function() {
    this.init();
    if((this.btnSubmit.length + this.btnNext.length) == 0) return 'ERROR';
    if(this.btnNext.length > 0) return 'CAN_NEXT';
    if(this.options.length > 0 && this.btnSubmit.hasClass('disabled')) return 'WAITING_CHOICE';
    if(!this.btnSubmit.hasClass('disabled') && !this.btnSubmit.attr('disabled')) return 'CAN_SUBMIT';
    if(this.input.length > 0) return 'WAITING_INPUT';
    return 'UNKNOW';
  };
  /**
   * [makeChoice show options]
   * @return {[type]} [description]
   */
  YangCongHelper.prototype.makeChoice = function(){
    this.options.each(function(i, el){
      var $el = $(el);
      var $scope = $el.scope();
      var choice = $scope.choice;
      if(choice.is_correct)el.click();
    });
  };
  /**
   * [inputAnswer put answer to blank]
   * @return {[type]} [description]
   */
  YangCongHelper.prototype.inputAnswer = function(){
    var $scope = $('.input-container').scope();
    var currentProblem = $scope.currentProblem;
    var correctAnswer = currentProblem.correct_answer;
    if(Array.isArray(correctAnswer) && correctAnswer.length > 0){
      $scope.singleFilling = correctAnswer[0];
    }else{
      $scope.singleFilling = correctAnswer.toString();
    }
    this.input.mathquill('latex', $scope.singleFilling);
    var event = angular.element.Event('mouseenter');
    angular.element('#formula-input').trigger(event);
  };
  /**
   * [makeAnswer description]
   * @return {[type]} [description]
   */
  YangCongHelper.prototype.makeAnswer = function(){
    switch(this.getStatus()){
      case 'ERROR':
        if(this.mode == 'manual')
          this.notify('只有在做题时才有用哦 快去做题吧 ! 少年 .');
        break;
      case 'WAITING_CHOICE':
        this.makeChoice();
        break;
      case 'WAITING_INPUT':
        this.inputAnswer();
        break;
      case 'CAN_SUBMIT':
        this.btnSubmit.click();
        break;
      case 'CAN_NEXT':
        this.btnNext.click();
        break;
      default:
        this.notify('一定是你打开的方式有问题 :P , 快来给我反馈下原因 .');
        window.open('https://gist.github.com/song940/40c90eb8f25368b0895a');
        break;
    }
  };
  /**
   * [setMode description]
   * @param {[type]} mode [description]
   */
  YangCongHelper.prototype.setMode = function(mode){
    if(mode) this.mode = 'auto';
    if(mode == 'manual') this.mode = 'manual';
    var that = this;
    switch(this.mode){
      case 'auto':
        this.notify('洋葱数学小助手: 已切换到自动模式');
        this.interval = setInterval(function(){
          that.makeAnswer();
        }, this.interval_time || 2000);
        break;
      case 'manual':
        this.notify('洋葱数学小助手: 已切换到手动模式');
        if(this.interval) clearInterval(this.interval);
        break;
    }
  };
  /**
  *
  */
  YangCongHelper.prototype.notify = function(msg){
    var that = this;
    var li = document.createElement('div');
    with(li.style){
      right = 0;
      color = 'white';
      margin = '10px';
      padding = '10px';
      background = '#444';
      borderRadius = '5px';
      transition = 'all .3s';
    }
    li.innerText = msg;
    that.notifyEl.appendChild(li);
    setTimeout(function(){
      li.style.opacity = 0;
      setTimeout(function(){
        that.notifyEl.removeChild(li);
      }, 300);
    }, 5000);
  };

  YangCongHelper.prototype.buildNotify = function(){
    this.notifyEl = document.createElement('div');
    with(this.notifyEl.style){
      top = '70px';
      zIndex = 1000;
      right = '10px';
      position = 'fixed';
    }
    document.body.appendChild(this.notifyEl);
  };

  /**
   * [init description]
   * @return {[type]} [description]
   */
  YangCongHelper.init = function(){
    window.helper = new YangCongHelper();
    window.helper.notify("欢迎使用洋葱数学小助手");
    window.helper.notify("洋葱数学小助手: 按键盘上的 'K' 可以手动答题 ~");
    window.helper.notify("洋葱数学小助手: 按键盘上的 [Ctrl + K] 可以切换 [自动模式] 和 [手动模式] 哦 ~");
    //make
    window.helper.makeAnswer();
    $(document).on('keydown', function(ev){
      ev.preventDefault();
      if(ev.ctrlKey && ev.keyCode == 75){ // 'K'
        switch(window.helper.mode){
          case 'auto':
            window.helper.setMode('manual');
            break;
          case 'manual':
            window.helper.setMode('auto');
            break;
        }
      }else if(ev.keyCode == 75){
        window.helper.makeAnswer();
      }
    });
  };

    /**
   * [run description]
   * @return {[type]} [description]
   */
  YangCongHelper.run = function(){
    if(!window.helper) return;
    switch(window.helper.mode){
      case 'auto':
        window.helper.setMode('manual');
        break;
      case 'manual':
        window.helper.makeAnswer();
        break;
    }
  };
  /**
   * [YangCongHelper export]
   * @type {[type]}
   */
  window.YangCongHelper = YangCongHelper;

})(window, jQuery);
