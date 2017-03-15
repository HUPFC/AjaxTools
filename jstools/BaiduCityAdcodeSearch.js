/**
 * Created by yoho on 2016/10/9.
 */
var _ADCODE = {
    //操作对象
    obj: $("#span-city-code"),
    init: function() {
        _ADCODE.clickButton();
    },

    setSearch: function(name) {
        var html = "<input type='button' class='btn btn-primary btn-city-code' data-type='openModal' value='" + name + "'>";
        _ADCODE.obj.append(html);
    },

    clickButton: function() {
        _ADCODE.obj.on('click', '.btn-city-code', function() {
            var type = $(this).attr("data-type");
            switch (type) {
                case 'openModal':
                    if(_ADCODE.obj.find("#modal-city-code-search").length == 0) {
                        _ADCODE.obj.append(_ADCODE.modalSearch);
                    }

                    //显示modal
                    $("#modal-city-code-search").modal("show");
                    break;
                case 'searchByCity':
                    var cityName = $(this).prev().val();
                    if(cityName == "") {
                        alert("请输入城市名称");
                        return false;
                    }

                    //根据城市名获取到code
                    $.ajax({
                        url: "/admin/city/getLocationByCityName",
                        type: "post",
                        dataType: "json",
                        data: {
                            city: cityName
                        },
                        success: function(data) {
                            if(data['errCode'] == 200) {
                                $("#modal-city-code-search").modal("hide");
                                $("#city_code").val(data['city_code']);
                                $("#city_name").val(data['city_name']);
                            } else {
                                alert("城市code获取失败，请重试！");
                                return false;
                            }
                        }
                    });
            }
        });
    },
    modalSearch:
    '<div class="modal fade" id="modal-city-code-search">' +
        '<div class="modal-dialog">' +
            '<div class="modal-content">' +
                '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
                    '<h4 class="modal-title">搜索城市Code</h4>' +
                '</div>' +
                '<div class="modal-body form-inline">' +
                    '<input type="text" class="form-control" placeholder="请输入城市名称"/>&nbsp;' +
                    '<input type="button" class="btn btn-success btn-city-code" data-type="searchByCity" value="搜索"/>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<input type="button" class="btn btn-default" data-dismiss="modal" value="关闭">' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>'
};