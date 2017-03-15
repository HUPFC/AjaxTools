/**
 * Created by yoho on 2016/10/31.
 */

document.write('<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=CA98b85ba3fc5ef00a3fbef84b2fe4cb"></script>');

var baidu_map = {
    map:false,
    lat:false,
    lng:false,
    city:false,
    marker:false,
    callback:false,
    init:function(id,lat,lng,city){
        var point = new BMap.Point(lng, lat);
        baidu_map.map = new BMap.Map(id);
        baidu_map.map.centerAndZoom(point, 12);
        baidu_map.map.addControl(new BMap.MapTypeControl());
        baidu_map.map.enableScrollWheelZoom(true);
        baidu_map.setMarker(point);

        baidu_map.map.addEventListener("click", function(e){
            baidu_map.setMarker(e.point);
            if(baidu_map.callback){
                eval('('+baidu_map.callback+')');
            }
        });
    },

    getPosition:function(){
        return baidu_map.marker.getPosition();
    },

    search:function(city,address){
        var myGeo = new BMap.Geocoder();
        var pos = myGeo.getPoint(address,function(point){
            if (point) {
                baidu_map.map.centerAndZoom(point,baidu_map.map.getZoom());
                baidu_map.setMarker(point);
                eval('('+baidu_map.callback+')');
            }else{
                alert("您选择地址没有解析到结果!");
            }
        },city);
        return true;
    },

    setMarker:function(point){
        if(baidu_map.marker){
            baidu_map.map.clearOverlays(baidu_map.marker);
        }
        baidu_map.marker = new BMap.Marker(point);
        baidu_map.map.addOverlay(baidu_map.marker);
        baidu_map.marker.enableDragging();
    }
}
