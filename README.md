# AjaxTools
适用于后台快速开发ajax的小工具

主要用于后台开发中，按钮绑定ajax的全局小工具
```
	依赖于jquery  jquery.gritter
```

使用方式:

JS
```
	引入main.js,jquery.js jquery.gritter.js jquery.gritter.css
	执行common.ajaxbydatatoggle()
	
```

HTML:
```
<div data-toggle="ajax" data-confirm="确定停用么?" data-remote="url?id=5" class="btn btn-success btn-sm">停用</div>
<div data-toggle="ajax" data-remote="url?id=5" class="btn btn-success btn-sm">停用</div>
```

以上HTML发起data-remote中的ajax请求,最终common._alert()弹出 gritter提示

注
```
1.ajax没做做回调,有兴趣可以拿去自己改下加入回调函数机制
2.common._alert()函数可以单独调用,很好用的gritter提示
3.内含$.ajaxSetup 不需要可屏蔽
4.适用于后台管理系统
```
