var _rp = {

	num : 0,
	id : "Resource",
	list : 'ResourceList',
	navobj : $('#Resource'),//button 填充的id
	listobj : $('#ResourceList'),//列表id
	storeInfo:new Object(),
	modal : null,
	callback:{},
	uploader:null,
	uploaderimage:null,
	store_format:null,

	init:function(){
		_rp.clickButton();
	},

	//添加文本
	setText : function(name,callback){
		var name = name?name:'添加文本';
		var html = '<input type="button" class="btn btn-primary addResource addText ml5" data-type="addText" value='+name+'>';
		_rp.navobj.append(html);
		if(callback){
			_rp.callback.text = callback;
		}
	},

	setImage:function(name,callback){
		var name = name?name:'添加图片';
		var html = '<input type="button" class="btn btn-primary addResource addImage ml5" data-type="addImage" value='+name+'>';
		_rp.navobj.append(html);

		if(callback){
			_rp.callback.text = callback;
		}
	},
	
	//callback 不同页面校验数据有效性
	setStore: function(name,callback){
		var name = name?name:'添加店铺';
		var html = '<input type="button" class="btn btn-primary addResource addStore ml5" data-type="addStore" value='+name+'>';
		_rp.navobj.append(html);
		_rp.callback.store = callback;
	},

	setVedio:function(name){
		var name = name?name:'添加视频';
		var html = '<input type="button" class="btn btn-primary addResource addVedio ml5" data-type="addVedio" value='+name+'>';
		_rp.navobj.append(html);
	},

	setContentByJson:function(data){
		if(data.length>0)
		{
			var m =0;
			for(m;m<data.length;m++){
				var type = data[m].type;
				switch(type){
					case 'store':
						var store_id = data[m].store_id;
						var id = data[m].id;
						$.ajax({
							url:"/admin/store/getStoreForTopic",
							data:{id: store_id},
							async:false,
							success:function(res){
								_rp.saveStore(res.data,data[m].text,id);
							}
						});
						break;
					case 'text':
						_rp.saveText(data[m].text,data[m].id,data[m].text_tc);
						break;
					case 'vedio':
						_rp.closeVedioModal(data[m].vedio,data[m].id);
						break;
					case 'image':
						_rp.cloaseImageModal(data[m].image,data[m].id);
						break;
				}
			}
		}
	},



	clickButton:function(){
		_rp.navobj.on('click','.addResource',function(){
			var type = $(this).attr('data-type');
			switch(type){
				case 'addText':

						if(_rp.navobj.find('#modal_text').size() == 0){
							_rp.navobj.append(_rp.modalTextHtml);
						}
						_rp.navobj.find('#modal_text').find('textarea').val('');
						_rp.navobj.find('#modal_text').modal('show');
					break;

				case 'addStore':

						if(_rp.navobj.find('#modal_store').size() == 0){
							_rp.navobj.append(_rp.modalAddStoreHtml);
						}
						_rp.navobj.find('#modal_store').find('input').val('');
						_rp.navobj.find('#modal_store').modal('show');

					break;

				case 'addVedio':
						if(_rp.navobj.find('#modal_vedio').size() > 0){
							_rp.navobj.find('#modal_vedio').remove();
						}
						_rp.navobj.append(_rp.modalAddVedioHtml);
						_rp.uploader = _rp.upload();
						_rp.navobj.find('#modal_vedio').modal('show');
					break;

				case 'addImage':
						if(_rp.navobj.find('#modal_image').size() > 0){
							_rp.navobj.find('#modal_image').remove();
						}
						_rp.navobj.append(_rp.modalAddImageHtml);
						_rp.uploaderimage = _rp.uploadImage();
						_rp.navobj.find('#modal_image').modal('show');
					break;
			}
		});

		_rp.navobj.on('click','.modal_save',function(){
			var type = $(this).attr('data-type');
			switch(type){
				case 'saveText':
						var modal = $('#modal_text');
						var text = modal.find('#ch').val();
						var text_tc = modal.find('#ch_tw').val();
						if(text == '' && text_tc == ''){
							alert('文本不能为空');
							return false;
						}
						modal.modal('hide');
						_rp.saveText(text,'',text_tc);
						if(_rp.callback.text){
							eval(_rp.callback.store+'('+text+')');
						}
					break;

				case 'saveStore':
						var modal = $('#modal_store');
						var id = modal.find('input').val();
						if(id == ''){
							alert('店铺id不能为空');
							return false;
						}
						var rs = false;

						if(_rp.listobj.find('li[store_id='+id+']').size()>0){
							alert('店铺id已存在');
							return false;
						}

						$.ajax({
							url:"/admin/store/getStoreForTopic",
							data:{id: id},
							async:false,
							success:function(data){
								if(data.code != 200){
				                	alert(data.message);
				                }else{
				                	rs = eval(_rp.callback.store+'('+data.data.city+')');
				                	if(rs){
				                		modal.modal('hide');
										_rp.saveStore(data.data,'');
				                	}
				                }
							}
						});
					break;

				case 'saveVedio':
					_rp.uploader.start();
					break;
				case 'saveImage':
					_rp.uploaderimage.start();
					break;

			}
			
		});

		_rp.listobj.on('click','.rpremove',function(){
			if(confirm("确定删除该条目么？")){
				$(this).parents('li').remove();
			}
		});
	},

	closeVedioModal:function(file,id){
		_rp.num++;
		var vedioHtml = '';
		if(!id){
			id = 0;
			vedio = $('#resurl').val()+file;
		}else{
			vedio = file;

		}
		vedioHtml = '<li class="dd-item" data-key="'+id+'" data-type="vedio" data-id='+_rp.num+'>'+
					'<div class="dd-handle dd-nodrag" id="vedio_url"><span style="word-break:break-all;">'+vedio+'</span>'+
					'<a class="dd-nodrag pull-right rpremove"><i class="glyphicon glyphicon-remove-circle"></i></a></div>'+
					'</li>';
		_rp.listobj.append(vedioHtml);
		$('#modal_vedio').modal('hide');
	},

	cloaseImageModal:function(file,id,modal){
		if(file){
			_rp.num++;
			var imageHtml = '';
			if(!id){
				id = 0;
				image = $('#resurl').val()+file+'?imageView/2/w/200/h/200';
			}else{
				image = file;
			}

			imageHtml = '<li class="dd-item" data-key="'+id+'" data-type="image" data-id='+_rp.num+'>'+
						'<div class="dd-handle dd-nodrag" id="vedio_image">'+
						'<img src="'+image+'">'+
						'<a class="dd-nodrag pull-right rpremove"><i class="glyphicon glyphicon-remove-circle"></i></a></div>'+
						'</li>';
			_rp.listobj.append(imageHtml);
		}
		
		if(modal && modal == 'show'){

		}else{
			$('#modal_image').modal('hide');
		}
		
	},

	saveStore:function(data,desc,id){
		_rp.num++;
		_rp.storeInfo[_rp.num] = data;
		var str = '';
		if(!id) id=0;
        str += '<li class="dd-item" data-type="store" data-key="'+id+'" data-id="'+_rp.num+'" store_id="'+data.id+'">';
        str += '    <div class="dd-handle">';
        str += '    编号：'+data.id+' '+data.store_name+ '  '+data.store_english_name;
        str += '    <a class="dd-nodrag pull-right rpremove"><i class="glyphicon glyphicon-remove-circle"></i></a>';
        str += '    </div>';
        str += '    <div class="row-border mt10 mb10">';
        str += '        <textarea style="resize: none" class="form-control dd-nodrag mt5 storeinfo_dec" rows="4" placeholder="推荐该店铺的介绍文字（最多250个字）" id="storedesc_'+data.id+'"  maxlength="250">'+desc+'</textarea>';
        str += '    </div>';
        str += '</li>';
        _rp.listobj.append(str);
        if(_rp.store_format == 'onlystore'){
        	_rp.listobj.find('.row-border').remove();
        }
	},

	saveText:function(text,id,text_tc){
		if(!text_tc) text_tc ='';
		if(!text) text = '';
		_rp.num++;
		if(!id) id=0;
		var textHtml =  '<li class="dd-item" data-type="text" data-key="'+id+'" data-id='+_rp.num+'>'+
						'<div class="dd-handle">'+
						'<p>简体:<a class="dd-nodrag pull-right rpremove"><i class="glyphicon glyphicon-remove-circle"></i></a>'+
						'<p><textarea class="dd-nodrag" id="ch" cols=50 rows=5>'+text+'</textarea>'+
						'<p>繁体:<p><textarea class="dd-nodrag" id="ch_tw" cols=50 rows=5>'+text_tc+'</textarea></div></li>';
		_rp.listobj.append(textHtml);
	},

	getFormData:function(){
		var ls = _rp.listobj.find('li');
		var m =0;
		var len = ls.size();
		var out = new Array();
		if(len>0){
			for(m;m<len;m++){
				var obj = $(ls[m]);
				out[m] = new Object();
				var type = obj.attr('data-type');
				switch(type){
					case 'text':
							out[m].type="text";
							out[m].val =obj.find('#ch').val();
							out[m].val_tc = obj.find('#ch_tw').val();
							out[m].id  =obj.attr('data-key');
						break;
					case 'store':
							out[m].type="store";
							out[m].store_id = obj.attr('store_id');
							out[m].val = obj.find('textarea').val();
							out[m].id  =obj.attr('data-key');
						break;
					case 'vedio':
							out[m].type="vedio";
							out[m].val=obj.find('#vedio_url').text();
							out[m].id  =obj.attr('data-key');
						break;
					case 'image':
							out[m].type="image";
							out[m].val=obj.find('img').attr('src');
							out[m].id  =obj.attr('data-key');
						break;
				}
			}
		}

		return out;
	},

	




	modalTextHtml :
					'<div class="modal fade" id="modal_text">'+
					  '<div class="modal-dialog">'+
					    '<div class="modal-content">'+
					      '<div class="modal-header">'+
					        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
					        '<h4 class="modal-title">添加文本</h4>'+
					      '</div>'+
					      '<div class="modal-body">'+
					      	'简体:'+
					        '<p><textarea id="ch" rows="4" cols="65""></textarea></p>'+
					        '繁体:'+
					        '<p><textarea id="ch_tw" rows="4" cols="65"></textarea></p>'+
					      '</div>'+
					      '<div class="modal-footer">'+
					        '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
					        '<button type="button" class="btn btn-primary modal_save" data-type="saveText">保存</button>'+
					      '</div>'+
					    '</div>'+
					  '</div>'+
					'</div>',

	modalAddStoreHtml :
				'<div class="modal fade" id="modal_store">'+
				  '<div class="modal-dialog">'+
				    '<div class="modal-content">'+
				      '<div class="modal-header">'+
				        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
				        '<h4 class="modal-title">添加店铺</h4>'+
				      '</div>'+
				      '<div class="modal-body">'+
				        '<p><input type="text" class="form-control" placeholder="请输入店铺ID"/></p>'+
				      '</div>'+
				      '<div class="modal-footer">'+
				        '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
				        '<button type="button" class="btn btn-primary modal_save" data-type="saveStore">保存</button>'+
				      '</div>'+
				    '</div>'+
				  '</div>'+
				'</div>',

	modalAddVedioHtml:
				'<div class="modal fade" id="modal_vedio">'+
				  '<div class="modal-dialog">'+
				    '<div class="modal-content">'+
				      '<div class="modal-header">'+
				        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
				        '<h4 class="modal-title">添加视频</h4>'+
				      '</div>'+
				      '<div class="modal-body">'+
				      	'<p hidden><button type="button" id="qiniufilename" class="form-control" ></button></p>'+
				        '<p><button type="button" id="flvfile" class="form-control" >添加视频(MP4文件 最大500M)</button></p>'+
				        '<p id="filename" hidden><button disabled type="button"  class="form-control" ></button></p>'+
				        '<p id="filepercent" hidden><button disabled type="button"  class="form-control" ></button></p>'+
				      '</div>'+
				      '<div class="modal-footer">'+
				        '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
				        '<button type="button" class="btn btn-primary modal_save" data-type="saveVedio">开始上传</button>'+
				      '</div>'+
				    '</div>'+
				  '</div>'+
				'</div>',

	modalAddImageHtml:
			'<div class="modal fade" id="modal_image">'+
			  '<div class="modal-dialog">'+
			    '<div class="modal-content">'+
			      '<div class="modal-header">'+
			        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
			        '<h4 class="modal-title">添加图片</h4>'+
			      '</div>'+
			      '<div class="modal-body">'+
			      	'<p hidden><button type="button" id="qiniufilename" class="form-control" ></button></p>'+
			        '<p><button type="button" id="_rp_image_file" class="form-control" >添加图片(jpg,gif,png 最大3M)</button></p>'+
			        '<p id="filename" hidden><button disabled type="button"  class="form-control" ></button></p>'+
			        '<p id="filepercent" hidden><button disabled type="button"  class="form-control" ></button></p>'+
			      '</div>'+
			      '<div class="modal-footer">'+
			        '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
			        '<button type="button" class="btn btn-primary modal_save" data-type="saveImage">开始上传</button>'+
			      '</div>'+
			    '</div>'+
			  '</div>'+
			'</div>',



	upload:function(){
		 //引入Plupload 、qiniu.js后
		 /**
		 PHP控制器中 应有
			 $out['bucket'] = $this->_appConfig->qiniu->bucket;
	        $out['resurl'] = $this->_appConfig->qiniu->imageurl;

	        $this->_assign('upload',$out);
	        $this->_assign('rand',mt_rand(10,999999));
	     HTML中 应有
	     	<input type="hidden" name="resurl" id="resurl" value="<?php echo $upload['resurl'];?>">
			<input type="hidden" name="rand" id="rand" value="<?php echo $rand;?>">
		 */
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',    //上传模式,依次退化
            browse_button: 'flvfile',       //上传选择的点选按钮，**必需**
            uptoken_url: '/admin/upload/getQiniuToken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            domain: $('#resurl').val(),   //bucket 域名，下载资源时用到，**必需**
            get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
            max_file_size: '100mb',           //最大文件体积限制
            flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
            multi_selection : false,
			filters : {
			    max_file_size : '500mb',
			    prevent_duplicates: false,
			    // Specify what files to browse for
			    mime_types: [
			        //{title : "flv files", extensions : "flv"}, // 限定flv后缀上传格式上传
			        {title : "Video files", extensions : "mp4"}, // 限定flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4后缀格式上传
			        //flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,
			    ]
			},
            init: {
                'FilesAdded': function(up, files) {
                	$.each(up.files, function (i, file) {
				        if (up.files.length <= 1) {
				            return;
				        }
				 
				        up.removeFile(file);
				    });
				    $('#modal_vedio').find('#filename').show();
				    $('#modal_vedio').find('#filename').find('button').html('文件 : '+files[0].name);
                },
                'UploadProgress': function(up, file) {
                	$('#modal_vedio').find('#filepercent').show();
                	if(file.percent == 100){
                		$('#modal_vedio').find('#filepercent').find('button').html('文件处理中');
                	}else{
                		$('#modal_vedio').find('#filepercent').find('button').html('文件上传中 : '+file.percent+'%');
                	}
                },
                'Key': function(up, file) {
                    var prefix = 'mars';
                    var myDate = new Date();
                    var time = '/'+myDate.getFullYear()+'/'+myDate.getMonth()+'/'+myDate.getDate()+'/';
                    var md5 = hex_md5($('#rand').val()+file.name+file.type+file.size+myDate.getTime());
                    var ext = file.name.split('.');
                    ext = ext[ext.length-1];
                    var key = prefix+time+md5+'.'+ext;

                    console.log(key);
                    return key
                }
            }
        });

        uploader.bind('FileUploaded', function(uploader,file,responseObject) {
        	if(responseObject.status == 200){
        		var res = eval('('+responseObject.response+')');
        		file_name = res.key;
        		_rp.closeVedioModal(file_name);
        	}else{
        		alert('上传失败');
        	}
    	});

        uploader.bind('Error',function(uploader,obj){
        	alert(obj.message);
        });

        return uploader;
	},


	uploadImage:function(){
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',    //上传模式,依次退化
            browse_button: '_rp_image_file',       //上传选择的点选按钮，**必需**
            uptoken_url: '/admin/upload/getQiniuToken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            domain: $('#resurl').val(),   //bucket 域名，下载资源时用到，**必需**
            get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
            max_file_size: '2mb',           //最大文件体积限制
            flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
            auto_start: false,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            multi_selection : true,//是否可以选择多个文件
			filters : {
			    max_file_size : '3mb',
			    prevent_duplicates: false,
			    mime_types: [
			     	{title : "Image files", extensions : "jpg,gif,png"}, // 限定jpg,gif,png后缀上传
			    ]
			},
            init: {
                'FilesAdded': function(up, files) {

                	$.each(files, function (i, file) {
				        /*if (up.files.length <= 1) {
				            return;
				        }*/
				 		$('#modal_image').find('#filename').show();
				    	$('#modal_image').find('#filename').find('button').append('<p>'+'文件 : '+file.name);
				        //up.removeFile(file);
				    });
				    /*$('#modal_image').find('#filename').show();
				    $('#modal_image').find('#filename').find('button').html('文件 : '+files[0].name);*/
                },
                'BeforeUpload': function(up, file) {
                       // 每个文件上传前,处理相关的事情
                },
                'UploadProgress': function(up, file) {
                	$('#modal_image').find('#filepercent').show();
                	if(file.percent == 100){
                		$('#modal_image').find('#filepercent').find('button').html('文件处理中');
                	}else{
                		$('#modal_image').find('#filepercent').find('button').html('上传中 : '+file.percent+'%'+' '+file.name);
                	}
                },
                'FileUploaded': function(up, file, info) {
                },
                'Error': function(up, err, errTip) {
                },
                'UploadComplete': function() {
                	_rp.cloaseImageModal('','');
                },
                'Key': function(up, file) {
                    var prefix = 'mars';
                    var myDate = new Date();
                    var time = '/'+myDate.getFullYear()+'/'+myDate.getMonth()+'/'+myDate.getDate()+'/';
                    var md5 = hex_md5($('#rand').val()+file.name+file.type+file.size+myDate.getTime());
                    var ext = file.name.split('.');
                    ext = ext[ext.length-1];
                    var key = prefix+time+md5+'.'+ext;

                    return key
                }
            }
        });

        uploader.bind('FileUploaded', function(uploader,file,responseObject) {
        	if(responseObject.status == 200){
        		var res = eval('('+responseObject.response+')');
        		file_name = res.key;
        		_rp.cloaseImageModal(file_name,'','show');
        	}else{
        		alert('上传失败');
        	}
    	});

        uploader.bind('Error',function(uploader,obj){
        	alert(obj.message);
        });

        return uploader;
	},

}