;(function(win){
	if(!/洋葱数学$/.test(document.title)){
	  window.location.href = 'http://yangcong345.com';
	  return;
	}
	if('YangCongHelper' in win){
		win.YangCongHelper.run();
	}else{
		$.ajax({
			url: 'https://gist.githubusercontent.com/song940/40c90eb8f25368b0895a/raw/yangcong-helper.js',
			error: function(err){
				alert('Oops ! 洋葱数学小助手遇到了点问题, 如果是网络问题, 请检查网络然后再点一次. 如果还不行, 请删除小助手然后重新安装 .');
				win.open('https://lsong.org/~lsong/yangcong-helper');
			},
			success: function(content){
				var script = document.createElement('script');
				script.innerHTML = content;
				document.head.appendChild(script);
				win.YangCongHelper.init();
			}
		});
	}
})(window);
