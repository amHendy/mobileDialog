;(function($){
	var Dialog = function(config){
		var _this_ = this;
		this.config = {
			// 对话框宽度
			width: 'auto',
			// 对话框高度
			height : 'auto',
			// 对话框提示信息
			message : null,
			// 对话框类型
			type :'waiting',
			// 按钮配置
			buttons:null,
			//弹出框延迟时间
			delay:null,
			// 延迟回调函数
			delayCallback : null,
			// 对话框遮罩层透明度
			maskOpacity : null,
			// 点击mask是否关闭
			maskClose : true,
			effect : null
		}

		if(config && $.isPlainObject(config)){
			$.extend(this.config,config);
		}else{
			this.isConfig = true;
		};
		// 创建基本的DOM
		this.body = $('body');
		// 创建遮罩层
		this.mask = $('<div class="dialog-container"></div>');
		// 创建弹出框
		this.win = $('<div class="dialog-window"></div>');
		//创建弹出框头部 
		this.winHeader = $('<div class="dialog-header"></div>');
		//创建弹出提示信息 
		this.winContent = $('<div class="dialog-content"></div>');
		//创建弹出框按钮组
		this.winFooter = $('<div class="dialog-footer"></div>');
		this.creat()
		/*$(this.mask).tap(function(){
			_this_.close();
		})*/
	}
	Dialog.prototype = {
		// 动画
		animate : function(){
			var _this_ = this;
			this.win.css('-webkit-transform','scale(0,0)');
			window.setTimeout(function(){
				_this_.win.css('-webkit-transform','scale(1,1)');
			},300);
		},
		// 创建弹出框DOM
		creat : function(){
			var _this_ = this,
				config = this.config,
				mask = this.mask,
				win = this.win,
				header = this.winHeader,
				content = this.winContent,
				footer = this.winFooter,
				body = this.body;

			// 如果没有传递任何配置参数
			// 就弹出一个等待的图标形式的弹框
			if(this.isConfig){
				console.log(header);
				win.append(header.addClass('waiting'));
				mask.append(win);
				body.append(mask);

				if(config.effect){
					this.animate()
				};
			}else{
				// 根据配置参数创建相应的弹框
				header.addClass(config.type);
				win.append(header);

				if(config.maskClose){
					this.close();
				}
				if(config.effect){
					this.animate()
				};
				if(config.message){
					content.html(config.message);
					win.append(content);
				};

				if(config.buttons){
					win.append(footer);
				};

				mask.append(win);
				body.append(mask);

				if(config.width!='auto'){
					win.width(config.width);
				}

				if(config.height!='auto'){
					win.height(config.height);
				}

				if(config.maskOpacity){
					mask.css('background-color','rgba(0,0,0,'+config.maskOpacity+')')
				}

				// 设置弹出框弹出后多久关闭
				if(config.delay && config.delay !=0){
					window.setTimeout(function(){
						_this_.close();
						config.delayCallback && config.delayCallback();
					},config.delay);
				};

				if(config.buttons){
					this.createBtn(footer,config.buttons);
				};
			 	if(config.maskClose){
					mask.tap(function(){
			 		_this_.close();
			 	})
			 };
			};
		},
		createBtn : function(footer,buttons){
			var _this_ = this;
			$(buttons).each(function(i){
				var type = this.type?' class="'+this.type+'"':'';
				var btnTxt = this.text?this.text:'按钮'+(++i);
				var callback = this.callback?this.callback:null;
				var button = $('<button'+type+'>'+btnTxt+'</button>')

				if(callback){
					button.tap(function(e){
						var isClose = callback();
						// 阻止冒泡
						e.stopPropagation();
						if( isClose != false){
							_this_.close();
						};
					});
				}else{
					button.tap(function(e){
						// 阻止冒泡
						e.stopPropagation();
						_this_.close();

					})
				}

				footer.append(button);
			})
		},
		close:function(){
			this.mask.remove();
		}
	};
	window.Dialog = Dialog;

	$.dialog = function(config){
		return new Dialog(config);
	}
})(Zepto)