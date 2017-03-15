var _UNS = {
	navobj:$('#UNS'),//button 填充id
	callback:false,

	init:function(){
		_UNS.clickButton();
	},

	setSearch : function(name,callback){
		var name = name?name:'用户搜索';
		var html = '<input type="button" class="btn btn-primary UNS ml5 openModal" data-type="openModal" value='+name+'>';
		_UNS.navobj.append(html);
		_UNS.callback = callback;
	},


	clickButton:function(){
		_UNS.navobj.on('click','.UNS',function(){
			var type = $(this).attr('data-type');
			switch(type){
				case 'openModal':
						if(_UNS.navobj.find('#modal_search').size() == 0){
							_UNS.navobj.append(_UNS.modalSearch);
						}
						_UNS.navobj.find('#modal_search').find('input').val('');
						_UNS.navobj.find('#modal_search').find('#userlist').html('');
						_UNS.navobj.find('#modal_search').modal('show');
					break;
				case 'searchByName':
						var obj = $(this);
						var nickname = $(this).prev().val();
						if(nickname == ''){
							alert('请填写用户昵称');
							return false;
						}
						$(this).attr('disabled',true);
						$.ajax({
							'url':'/admin/user/getlistbyname',
							'type':'get',
							'data':{'nickname':nickname},
							success:function(data){
								obj.attr('disabled',false);
								switch(data.code){
									case 200:
										var list = data.data;
										if(list.length>0){
											for(var i=0 ; i< list.length; i++){
												var html;
												html += '<tr>';
												html += '<td><a href="javascript:void(0)" class="UNS" data-type="callback" data-id='+list[i].uid+'> uid:'+list[i].uid+'</a></td>';
												html += '<td>昵称:'+list[i].nickname+'</td>';
												html += '</tr>';
											}
										}
										$('#modal_search').find('#userlist').html(html);
									break;
									case 500:
										_alert(data.message);
									break;
								}

							},
							compelete:function(){
								obj.attr('disabled',false);
							},
						});
					break;
					case 'callback':
						_UNS.navobj.find('#modal_search').modal('hide');
						var uid = $(this).attr('data-id');
						eval('('+_UNS.callback+'('+uid+')'+')');
					break;
			}
		});
	},

	modalSearch:
		'<div class="modal fade" id="modal_search">'+
		  '<div class="modal-dialog">'+
		    '<div class="modal-content">'+
		      '<div class="modal-header">'+
		        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
		        '<h4 class="modal-title">搜索用户</h4>&nbsp;<label>(仅展示符合条件的前300条)</label>'+
		      '</div>'+
		      '<div class="modal-body">'+
		        '<p><input type="text" class="form-control" placeholder="请输入用户昵称"/>'+
		        '&nbsp;<button type="button" class="btn btn-success UNS" data-type="searchByName">搜索</button></p>'+

			    '<table class="table table-bordered" id="userlist">'+	 	
				'</table>'+
			   '</div>'+
		      '<div class="modal-footer">'+
		        '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
		      '</div>'+
		    '</div>'+
		  '</div>'+
		'</div>',
}