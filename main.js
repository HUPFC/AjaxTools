//依赖 gritter bootstrap jquery
var common = {
    '_alert':function(_text, status, url,time){
        var className = 'growl-success';
        if(status != 200){
            className = 'growl-warning';
        }
        if(!time){
            time = 2000;
        }

        var unique_id = $.gritter.add({
            title: _text,
            class_name: className,
            sticky: true,
            after_open:setTimeout(function(){
                if(status == 200 && url != -1){
                    if(url == 0){
                        $.gritter.remove(unique_id, {
                            fade: true, // optional
                            speed: 'fast' // optional
                        });
                    }else{
                        'undefined' == typeof url || url == '' ? location.reload() : location.href = url;
                    }

                }else{
                    $.gritter.remove(unique_id, {
                        fade: true, // optional
                        speed: 'fast' // optional
                    });
                }
            }, time)
        });
    },
    'disabled':function(obj,status){
        obj.attr('disabled',status);
    },
    'ajaxbydatatoggle':function(){
        $('[data-toggle="ajax"]').on("click",function(){
            event.preventDefault();
            var obj = $(this);
            var url = obj.attr('data-remote');
            var conf_text = obj.attr('data-confirm');
            if(conf_text && !confirm(conf_text)){
                return false;
            }
            obj.attr('disabled',true);
            $.ajax({
                url:url,
                dateType:'json',
                complete:function(){
                    obj.attr('disabled',false);
                },
                success:function(data){
                    common._alert(data.message,data.code);
                }
            });
        });
    }
}

$.ajaxSetup({
    type:'GET',
    dataType:'json',
    error:function(jqXHR, textStatus, errorMsg){
        common._alert( '发送AJAX请求到"' + this.url + '"时出错[' + jqXHR.status + ']：' + errorMsg );
    }
});
