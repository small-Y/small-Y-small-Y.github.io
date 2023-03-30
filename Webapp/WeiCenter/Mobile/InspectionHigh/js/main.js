MyApp = function (container, config) {
    return {
        init: function () {
            this.container = container;
            this.config = config ? config : {};
			//
			this.selDate=new Date();
			this.loadMain();
			// this.updateToken();
			//
			window.addEventListener("popstate", function(e) {  
				$('#tab_main').find('.subtitle_bar .back').trigger(TUI.env.ua.clickEventUp);
			}, false);
        },
		loadMain:function(){
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
			}
			//
			$('#title_bar').find('.back').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
                // if (TUI.env.wx.ready) {
                    window.location.href = document.referrer;
                // } else {
                //     try {
                //         api.closeFrame();
                //     } catch (ex) {
                //         window.location.href = document.referrer;
                //     }
                // }
                return false;
            });
			//
			$('#tab_body').empty();
			$('#tab_body').html('<div class="contact"><div class="weui-pull-to-refresh-layer">'
								 +' <div class="pull-to-refresh-arrow"></div>'
								 +' <div class="pull-to-refresh-preloader"></div>'
								 +' <div class="down">下拉刷新</div>'
								 +' <div class="up">释放刷新</div>'
								 +' <div class="refresh">正在刷新</div>'
								 +'</div>'
								 +'<div class="smart-list"></div></div>');
			//
			$('#title_bar').find(".btn").bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
				if(!navigator.onLine)
				{
					$.toast("网络不给力", "forbidden");
					return;
				}
				//
				window.history.pushState("InspectionHigh", "InspectionHigh", "#");  
				//
				$('#tab_main').find('.subtitle_bar').empty();
				$('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="ok">确定</span>');
				$('#tab_main').find('.subtitle_body').html('<div class="article-list"><div class="weui_cells_title">选择开闭所</div><div class="weui_cells weui_cells_checkbox"></div></div>');
				//

				var Series = [];
				Series.push({ url: "/API/System/PCPS/ObjectClass/HighVoltageKPI?valueTag=MeterLines,OnlineRate,MainRunDays,FaultRatio,TotalLoad,LoadRatio" });
				$.showLoading();
				//加载所有开闭所
				$.ajax({
					type:"post",
					url: '/Project/PCPS/SRV/Map/getKPIData.tjs',
					data: { Series: TUI.JSON.encode(Series) },
					dataType:"json",
					error:function(result){
						$.hideLoading();
						$.toast("服务不给力", "forbidden");
					},
					success:function(result){
						$('#tab_main').find('.subtitle_body .weui_cells_checkbox').empty();
						var kData=result[0].datas;
						for(let i=0;i<kData.length;i++){

							if(localStorage["InspectionHigh-display-"+kData[i].NodeID]=="false")
							{
								var item=$('<label class="weui_cell weui_check_label" for="'+kData[i].NodeID+'">'
									+'	  <div class="weui_cell_hd">'
									+'		<input type="checkbox" class="weui_check" name="checkuser" id="'+kData[i].NodeID+'" value="'+kData[i].NodeID+'">'
									+'		<i class="weui_icon_checked"></i>'
									+'	  </div>'
									+'	  <div class="weui_cell_bd weui_cell_primary">'
									+'		<p>'+TUI.Utils.getTagNameRight(kData[i].NodeFullName,2).replace(".开闭所运行KPI","")+'</p>'
									+'	  </div>'
									+'	</label>');
								//
								$('#tab_main').find('.subtitle_body .weui_cells_checkbox').append(item);
							}else
							{
								var item=$('<label class="weui_cell weui_check_label" for="'+kData[i].NodeID+'">'
									+'	  <div class="weui_cell_hd">'
									+'		<input type="checkbox" class="weui_check" name="checkuser" id="'+kData[i].NodeID+'" value="'+kData[i].NodeID+'" checked>'
									+'		<i class="weui_icon_checked"></i>'
									+'	  </div>'
									+'	  <div class="weui_cell_bd weui_cell_primary">'
									+'		<p>'+TUI.Utils.getTagNameRight(kData[i].NodeFullName,2).replace(".开闭所运行KPI","")+'</p>'
									+'	  </div>'
									+'	</label>');
								//
								$('#tab_main').find('.subtitle_body .weui_cells_checkbox').append(item);
							}
						
						}
						$.hideLoading();
					}
				})
				//
				$('#tab_main').find('.back').bind(TUI.env.ua.clickEventUp, { handle: this}, function (e) {
					$('#tab_main').animate({left:"100%"},function(){
						$('#tab_main').find('.subtitle_body').empty();
						$('#tab_main').hide();
					});
					return false;
				});
				//
				$('#tab_main').find('.ok').bind(TUI.env.ua.clickEventUp, { handle: this,config:config}, function (e) {
					$('#tab_main').animate({left:"100%"},function(){
						$('#tab_main').find('.subtitle_body').empty();
						$('#tab_main').hide();
					});
					//
					$("input[name='checkuser']").each(function(){
						if (true == $(this).prop("checked")) {
							localStorage["InspectionHigh-display-"+$(this).prop('value')]="true";
						}
						else
						{
							localStorage["InspectionHigh-display-"+$(this).prop('value')]="false";
						}
					});
					//
					TUI.env.mobile.loadSubStation();
					return false;
				});
				//
				$('#tab_main').show();
				$('#tab_main').animate({left:"0px"});
				//
				return false;
			});
			//下拉刷新
			$('#tab_body').find(".contact").pullToRefresh().on("pull-to-refresh", function() {
				TUI.env.mobile.loadSubStation();
			});
			this.loadSubStation();
			
		},
		loadSubStation:function(){
			$.showLoading();//加载所有开闭所
			$.ajax({
				type:"get",
				url: '/API/System/PCPS/ObjectClass/HighVoltageKPI?valueTag=MeterLines,OnlineRate,MainRunDays,FaultRatio,TotalLoad,LoadRatio',
                dataType:"json",
				error:function(result){
					$.hideLoading();
					$.toast("服务不给力", "forbidden");
				},
				success:function(result){
					$('#tab_body').find(".contact").pullToRefreshDone();
					$('#tab_body').find('.smart-list').empty();
					var panel=$('<div class="weui_panel weui_panel_access"><div class="weui_panel_bd"></div></div>');
					var kData=result;
					var allData=[];
					for(let i=0;i<kData.length;i++){
						allData[allData.length]={
							sort:(localStorage["InspectionHigh-sort-"+kData[i].NodeID]==undefined||localStorage["InspectionHigh-sort-"+kData[i].NodeID]=="")?0:parseInt(localStorage["InspectionHigh-sort-"+kData[i].NodeID]),
							isShow:(localStorage["InspectionHigh-display-"+kData[i].NodeID]=="false"?false:true),
							NodeID:kData[i].NodeID,
							GroupID:kData[i].GroupID,
							NodeType:"Switch",
							opcPath:kData[i].NodeFullTag,
							imgfile:"images/tesla-coil.png",
							title:TUI.Utils.getTagNameRight(kData[i].NodeFullName,2).replace(".开闭所运行KPI",""),
							lastMessage:"安全运行天数:"+kData[i].OPCValueList[kData[i].OPCValueMap.MainRunDays].DataValue+kData[i].OPCValueList[kData[i].OPCValueMap.MainRunDays].DataUnit
										+",负载率:"+kData[i].OPCValueList[kData[i].OPCValueMap.LoadRatio].DataValue+kData[i].OPCValueList[kData[i].OPCValueMap.LoadRatio].DataUnit,
							detail:{
								MainRunDays:kData[i].OPCValueList[kData[i].OPCValueMap.MainRunDays].DataValue,
								FaultRatio:kData[i].OPCValueList[kData[i].OPCValueMap.FaultRatio].DataValue,
								TotalLoad:kData[i].OPCValueList[kData[i].OPCValueMap.TotalLoad].DataValue,
								LoadRatio:kData[i].OPCValueList[kData[i].OPCValueMap.LoadRatio].DataValue,
								MeterLines:kData[i].OPCValueList[kData[i].OPCValueMap.MeterLines].DataValue,
								OnlineRate:kData[i].OPCValueList[kData[i].OPCValueMap.OnlineRate].DataValue,
								DateTime:kData[i].OnLineTime	
							}
						
						}
					
					}
					allData.sort(function(x,y){
						if(x.sort<y.sort){
							return 1
						}else{
							return -1
							}
					});
					for(let i=0;i<allData.length;i++){
						if(!allData[i].isShow){
							continue;
						}
					
						var item=$('<div class="weui_media_box weui_media_appmsg" style="padding:10px 15px 10px 15px;">'
								+'	  <div class="weui_media_hd small">'
								+'		<img class="weui_media_appmsg_thumb" style="max-height:40px;max-width:40px;-webkit-border-radius: 0;" src="'+allData[i].imgfile+'" alt="">'
								+'	  </div>'
								+'	  <div class="weui_media_bd">'
								+'		<p class="weui_media_desc" style="margin-bottom: 5px;">'
								+'			<span class="from">'+allData[i].title+'</span>'
								+'		</p>'
								+'		<p class="weui_media_desc" style="font-size: 12px;">'+allData[i].lastMessage+'</p>'
								+'	  </div>'
								+'	  <div class="msgbtn">'
								+'		<div class="share"><div class="lable">置顶</div></div>'
								+'		<div class="remove"><div class="lable">删除</div></div>'
								+'	   </div>'
								+'	</div>');
						item.bind("swipe", function (event) {
							if(event.direction === 'left') {
								$(this).animate({left:"-120px"});
							}
							else if(event.direction === 'right') {
								$(this).animate({left:"0px"});
							}
						});
						item.bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: this,node:allData[i] }, function (e) {
							if(!navigator.onLine)
							{
								$.toast("网络不给力", "forbidden");
								return;
							}
							//
							//alert(1);
							TUI.env.mobile.openSubStation(e.data.node);
							return false;
						});
						//
						item.find(".share").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: item,node:allData[i] }, function (e) {
							$(e.data.handle).animate({left:"0px"});
							localStorage["InspectionHigh-max"]=(localStorage["InspectionHigh-max"]==undefined||localStorage["InspectionHigh-max"]=="")?1:(parseInt(localStorage["InspectionHigh-max"])+1);
							localStorage["InspectionHigh-sort-"+e.data.node.NodeID]=localStorage["InspectionHigh-max"];
							//$('#tab_body').find('.smart-list').find(".weui_panel_bd").prepend(e.data.handle);
							TUI.env.mobile.loadSubStation();
							return false;
						});
						//
						item.find(".remove").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: item,node:allData[i] }, function (e) {
							e.data.handle.remove();
							localStorage["InspectionHigh-sort-"+e.data.node.NodeID]=0;
							localStorage["InspectionHigh-display-"+e.data.node.NodeID]="false";
							return false;
						});

						$(panel).find(".weui_panel_bd").append(item);
						
					}
					$.hideLoading();
					$('#tab_body').find('.smart-list').html(panel);
					//
					//
				}
			})
		},
		openSubStation:function(item){
			if(!navigator.onLine)
			{
				$.toast("网络不给力", "forbidden");
				return;
			}
			//
			window.history.pushState(item, item.NodeID, "#");
			
			$('#tab_main').find('.subtitle_bar').empty();
			$('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>'+item.title+'</span><span class="ok vr"><i class="icon iconfont" id="toolbarActionSheet" style="font-size:22px;">&#xe62F;</i></span>');
			$('#tab_main').find('.subtitle_body').html(
					' <div class="contact"><div class="weui-pull-to-refresh-layer">'
					+'		<div class="pull-to-refresh-arrow"></div>'
					+'		<div class="pull-to-refresh-preloader"></div>'
					+'		<div class="down">下拉刷新</div>'
					+'		<div class="up">释放刷新</div>'
					+'		<div class="refresh">正在刷新</div>'
					+'	</div>'
					+'	<div class="article-list">'
					+'		<div class="weui_panel weui_panel_access meter '+(item.detail.LoadRatio>=80?item.NodeType:'runok')+'">'
					+'			<div class="weui_panel_hd">'
					+'				<div class="hub_p"><span class="dtime">总负载&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+item.detail.DateTime.substring(11)+'&nbsp;&nbsp;&nbsp;&nbsp;</span><br><span class="real">'+TUI.Utils.formatNumber(item.detail.TotalLoad,"00000.0")+'</span><span>千伏安</span></div>'
					+'			</div>'
					+'			<div class="weui_panel_hd" style="padding: 8px;">'
					+'				<div class="scoreItem" id="hub_Ep">装置在线率<br><span>'+TUI.Utils.formatNumber(item.detail.OnlineRate,"0.00")+'%</span></div>'
					+'				<div class="scoreItem md" id="hub_WorkTime">故障率<br><span>'+TUI.Utils.formatNumber(item.detail.FaultRatio,"0.00")+'%</span></div>'
					+'				<div class="scoreItem" id="hub_WaitTime">负载率<br><span>'+TUI.Utils.formatNumber(item.detail.LoadRatio,"0.00")+'%</span></div>'
					+'			</div>'
					+'		</div>'							
					+'		<div class="weui_panel weui_panel_access">'
					+'			<div class="weui_panel_hd weui_cells_access">'
					+'				<span>总负载(千伏安)</span><span style="float:right"></span>'
					+'			</div>'
					+'			<div class="weui_panel_hd" style="padding:10px;">'
					+'				<div class="s_chart" style="height:140px"></div>'
					+'			</div>'
					+'		</div>'						
					+'		<div class="weui_panel weui_panel_access">'
					+'			<div class="weui_panel_hd weui_cells_access">'
					+'				<span>负载率(%)</span><span style="float:right"></span>'
					+'			</div>'
					+'			<div class="weui_panel_hd" style="padding:10px;">'
					+'				<div class="p_chart" style="height:140px"></div>'
					+'			</div>'
					+'		</div>'					
					+'		<div class="weui_panel weui_panel_access">'
					+'			<div class="weui_panel_hd weui_cells_access">'
					+'				<span>装置在线率(%)</span><span style="float:right"></span>'
					+'			</div>'
					+'			<div class="weui_panel_hd" style="padding:10px;">'
					+'				<div class="ep_chart" style="height:140px"></div>'
					+'			</div>'
					+'		</div>'
					+'		<br><br>'						
					+'	</div></div>'
					+'		<div class="operate open">我要巡检</div>'
					+'		<div id="InspectionHighReport" class="weui-popup-container">'
					+'			<div class="weui-popup-modal">'
					+'				<div class="subtitle_bar"><span  class="close-popup" style="color: #666;float:left;line-height: 44px;padding: 0 10px;"><i class="icon iconfont">&#xe620;</i>'+item.title+'</span></div>'
					+'				<div class="bd InspectionHighlist">暂无记录</div>'
					+'			</div>'
					+'      </div>'
					+'		<div id="operateInspectionHigh" class="weui-popup-container">'
					+'			<div class="weui-popup-modal">'
					+'				<div class="subtitle_bar"><span  class="close-popup" style="color: #666;float:left;line-height: 44px;padding: 0 10px;"><i class="icon iconfont">&#xe620;</i>'+item.title+'</span></div>'
					+'				<div class="weui_cells_title" style="padding-top: 43px;">巡检摘要</div>'
					+'				<div class="weui-cells weui-cells_form">'
					+'				  <div class="weui-cell">'
					+'					<div class="weui_cell_bd">'
					+'					  <textarea class="weui-textarea" style="margin: 0 10px 0 10px;width: 95%;" placeholder="请输入文本" rows="5"></textarea>'
					+'					</div>'
					+'				  </div>'
					+'				</div>'

					+'			  <div class="weui_cells_title">单选巡检项</div>'

					+'			  <div class="weui_cells" style="margin-bottom: 10px;">'
					+'				<label class="weui_cell weui_cell-select weui_cell_select_after for="x11">'
					+'				  <div class="weui_cell_hd weui_cell_primary">'
					+'					<label for class="weui_label" style="width:100%;">清洁箱体外表面及柜面各仪表</label>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'                    <select class="weui_select" name="清洁箱体外表面及柜面各仪表">'
					+'                         <option value="1">已清洁</option>'
					+'                         <option value="2">未清洁</option>'
					+'                    </select>'
					+'				  </div>'
					+'				</label>'
					+'				<label class="weui_cell weui_cell-select weui_cell_select_after for="x12">'
					+'				  <div class="weui_cell_hd weui_cell_primary">'
					+'					<label for class="weui_label" style="width:100%;">检查柜面各指示灯、仪表显示正常</label>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'                    <select class="weui_select" name="检查柜面各指示灯、仪表显示正常">'
					+'                         <option value="1">正常</option>'
					+'                         <option value="2">异常</option>'
					+'                         <option value="3">损坏</option>'
					+'                    </select>'
					+'				  </div>'
					+'				</label>'
					+'				<label class="weui_cell weui_cell-select weui_cell_select_after for="x13">'
					+'				  <div class="weui_cell_hd weui_cell_primary">'
					+'					<label for class="weui_label" style="width:100%;">夜间熄灯检查各设备状态</label>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'                    <select class="weui_select" name="夜间熄灯检查各设备状态">'
					+'                         <option value="1">正常</option>'
					+'                         <option value="2">异常</option>'
					+'                         <option value="3">损坏</option>'
					+'                    </select>'
					+'				  </div>'
					+'				</label>'
					+'				<label class="weui_cell weui_cell-select weui_cell_select_after for="x14">'
					+'				  <div class="weui_cell_hd weui_cell_primary">'
					+'					<label for class="weui_label" style="width:100%;">二次端子有无松动、烧痕、污染</label>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'                    <select class="weui_select" name="二次端子有无松动、烧痕、污染">'
					+'                         <option value="1">正常</option>'
					+'                         <option value="2">异常</option>'
					+'                         <option value="3">损坏</option>'
					+'                    </select>'
					+'				  </div>'
					+'				</label>'
					+'				<label class="weui_cell weui_cell-select weui_cell_select_after for="x15">'
					+'				  <div class="weui_cell_hd weui_cell_primary">'
					+'					<label for class="weui_label" style="width:100%;">接地装置有无锈蚀，是否完好</label>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'                    <select class="weui_select" name="接地装置有无锈蚀，是否完好">'
					+'                         <option value="1">正常</option>'
					+'                         <option value="2">异常</option>'
					+'                         <option value="3">损坏</option>'
					+'                    </select>'
					+'				  </div>'
					+'				</label>'
					+'				<label class="weui_cell weui_cell-select weui_cell_select_after for="x16">'
					+'				  <div class="weui_cell_hd weui_cell_primary">'
					+'					<label for class="weui_label" style="width:100%;">二次端子有无松动、烧痕、污染</label>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'                    <select class="weui_select" name="二次端子有无松动、烧痕、污染">'
					+'                         <option value="1">正常</option>'
					+'                         <option value="2">异常</option>'
					+'                         <option value="3">损坏</option>'
					+'                    </select>'
					+'				  </div>'
					+'				</label>'
					+'				<label class="weui_cell weui_cell-select weui_cell_select_after for="x17">'
					+'				  <div class="weui_cell_hd weui_cell_primary">'
					+'					<label for class="weui_label" style="width:100%;">变电所内是否有臭氧味道、焦糊味</label>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'                    <select class="weui_select" name="变电所内是否有臭氧味道、焦糊味">'
					+'                         <option value="1">正常</option>'
					+'                         <option value="2">异味</option>'
					+'                    </select>'
					+'				  </div>'
					+'				</label>'
					+'				<label class="weui_cell weui_cell-select weui_cell_select_after for="x18">'
					+'				  <div class="weui_cell_hd weui_cell_primary">'
					+'					<label for class="weui_label" style="width:100%;">检查穿墙套管污染情况</label>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'                    <select class="weui_select" name="检查穿墙套管污染情况">'
					+'                         <option value="1">正常</option>'
					+'                         <option value="2">轻微</option>'
					+'                         <option value="3">严重</option>'
					+'                    </select>'
					+'				  </div>'
					+'				</label>'
					+'			  </div>'
					+'			<div class="operate put" style="background: #489c2d;position: static;" >记录巡检</div>'
					+'			</div>'
					+'      </div>');
			//下拉刷新
			$('#tab_main').find(".contact").pullToRefresh().on("pull-to-refresh", { handle: this,node:item},function(e) {
				TUI.env.mobile.loadSubStationDetailData(e.data.node);
			});
			$('#tab_main').find('#toolbarActionSheet').on(TUI.env.ua.ontouch ? "tap" : TUI.env.ua.clickEventUp, { handle: this,node:item }, function (e) {
				//e.preventDefault();
				let node=e.data.node;
				$.actions({
				  actions: [
					{
						text: "巡检记录",
						onClick: function() {
						//do something
							$("#InspectionHighReport").popup();
							TUI.env.mobile.getInspectionHighList(node);
							return false;
						}
					}]
				});
			});
			$('#tab_main').find('.back').bind(TUI.env.ua.clickEventUp, { handle: this,config:item}, function (e) {
				TUI.env.mobile.loadMain();
				$('#tab_main').animate({left:"100%"},function(){
					$('#tab_main').find('.subtitle_body').empty();
					$('#tab_main').hide();
				});
				return false;
			});
			$('#tab_main').find('.operate.open').bind(TUI.env.ua.clickEventUp, { handle: this,config:item}, function (e) {
				//
				//
				//TUI.env.mobile.putInspectionHigh(e.data.config);
				$("#operateInspectionHigh").popup();
				return false;
			});
			$('#tab_main').find('.operate.put').bind(TUI.env.ua.clickEventUp, { handle: this,config:item}, function (e) {
				//
				//
				var statusNum=0;
				var status='';
				var InspectList=[];
				var what=$('#tab_main').find('.weui-textarea').val();
				$( "select option:selected" ).each(function(i,item) {
					var InspectionItem=$(this).parent()[0].name;
					InspectList[InspectList.length]=InspectionItem+': '+$(item).text();
					statusNum+=parseInt($(item).val());
				 });
				statusNum==8?status=1:status=4;
                TUI.env.mobile.putInspectionHigh(e.data.config,what,status,InspectList);
				$.closePopup();
				return false;
			});
			$('#tab_main').find('.close-popup').bind(TUI.env.ua.clickEventUp, { handle: this,config:item}, function (e) {
				$.closePopup();
				TUI.env.mobile.openSubStation(e.data.config);
				return false;
			});

			$('#tab_main').show();
			$('#tab_main').animate({left:"0px"});
			this.loadSubStationDetailData(item)
					
		},
		getInspectionHighList:function(node){
			//巡检
			$.ajax({
				type:"get",
				url: '/API/Inspect?apptag=PCPS&objectid='+node.GroupID,
				dataType:"json",
				error:function(result){
					$.hideLoading();
					$.toast("服务不给力", "forbidden");

				},
				success:function(result){
					$(".InspectionHighlist").empty();
					//1、正常状态，2、通知状态，3、告警状态，4、故障状态，5、瘫痪状态。
					var status=["正常状态",'通知状态','告警状态','故障状态','瘫痪状态']

					for(var i=0;i<result.data.length;i++){
						var item=$('<div class="weui_panel">'
							+'	<div class="weui_media_box weui_media_text">'
							+'		<p class="weui_media_desc weui_panel_ft" style="font-size:20px;padding-left:0px;border-bottom: 1px solid #e5e5e5;color: #333;">'+result.data[i].RecordWhere+'</p>'
							+'		<p class="weui_media_desc" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">巡检时间：&nbsp;&nbsp;<b>'+result.data[i].RecordTime+'</b></p>'
							+'		<p class="weui_media_desc" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">巡检状态：&nbsp;&nbsp;<b>'+status[result.data[i].RecordStatus-1]+'</b></p>'
							+'		<p class="weui_media_desc" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">巡检人员：&nbsp;&nbsp;<b>'+result.data[i].RecordName+'</b></p>'
							+'		<p class="weui_media_desc lastmedia" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">巡检内容：&nbsp;&nbsp;<b>' +unescape(result.data[i].RecordInfo)+'</b></p>'
							+'	</div>'
							+'</div>');

						item.bind('click', { handle: this }, function (e) {
							if($(this).find('.lastmedia').css('display')=='block'){
								$(this).find('.lastmedia').css('display','-webkit-box');
							}else{
								$(this).find('.lastmedia').css('display','block');
							}
							return false;
						});
						
						$(".InspectionHighlist").append(item);
					}
					if(result.data.length==0){
						$(".InspectionHighlist").html('暂无记录');
					}
					
				}
			})

		},
		putInspectionHigh:function(node,what1,status,InspectList){
			$.showLoading();
			var allWhat='';
			var what2='';
			InspectList.forEach(ele => {
				what2+=ele+'; ';
			});
			if(what1!=''){
				allWhat=what1+'; '+what2;
			}else{
				allWhat=what2;
			}
			
			//巡检
			$.ajax({
				type:"post",
				url: '/API/System/PCPS/Inspect',
                data: {
					apptag:"PCPS",
					where:node.title,
					what:allWhat,
					status:status,
					objectid:node.GroupID,
					fulltag:node.opcPath.replace(TUI.Utils.getTagNameRight(node.opcPath,1),""),
					objecttype:"Group"
				},
				dataType:"json",
				error:function(result){
					$.hideLoading();
					$.toast("服务不给力", "forbidden");
				},
				success:function(result){
					$.hideLoading();
					if(!result.flag){
						$.toast("巡检失败", "forbidden");
					}
					$.toast("提交成功", "success");
				}
			})
		},
		loadSubStationDetailData:function(node){
			var nDate=new Date();
			var startTime=nDate.DateAdd("d",-1).Format("yyyy-MM-dd hh:mm:ss");
			var endTime=nDate.Format("yyyy-MM-dd hh:mm:ss");
			var NodeFullTag=node.opcPath;
			var URLs=[
			{ url: "/API/System/PCPS/Mining/History?NodeFullTag="+NodeFullTag+"$&valueTag=TotalLoad&startTime="+startTime },  //总负载
			{ url: "/API/System/PCPS/Mining/History?NodeFullTag="+NodeFullTag+"$&valueTag=LoadRatio&startTime="+startTime }, //负载率
			{ url: "/API/System/PCPS/Mining/History?NodeFullTag="+NodeFullTag+"$&valueTag=OnlineRate&startTime="+startTime } //装置在线率	
			]
			//加载所有变电所
			$.ajax({
				type:"post",
				url: '/Project/PCPS/SRV/Map/getKPIData.tjs',
				data: { Series: TUI.JSON.encode(URLs) },
				dataType:"json",
				error:function(result){
					$.hideLoading();
					$.toast("服务不给力", "forbidden");
					$('#tab_main').find(".contact").pullToRefreshDone();

				},
				success:function(result){
					$('#tab_main').find(".contact").pullToRefreshDone();
					var TotalLoad=result[0].datas.node;
					var LoadRatio=result[1].datas.node;
					var OnlineRate=result[2].datas.node;

					//
					
					//总负载
					var series=[{type: 'spline',name:"总负载",yAxis: 0,data:[],color:"#1BBFAF",unit:"千伏安"}];
					var t1=new Date().DateAdd("d",-1);
					var t2=new Date().DateAdd("d",1);
					series[0].data[0]=[Date.UTC(t1.getFullYear(),t1.getMonth(),t1.getDate(),0,0,0), null];
					var ncount=0;
					for(var i=0;i<TotalLoad[0].datalist.length;i++)
					{
						var tm=TUI.Utils.parseDate(TotalLoad[0].datalist[i].DataTime);
						series[0].data[ncount]=[Date.UTC(tm.getFullYear(),tm.getMonth(),tm.getDate(),tm.getHours(),tm.getMinutes(),tm.getSeconds()), TotalLoad[0].datalist[i].DataValue];
						ncount++;
					}
					series[0].data[ncount]=[Date.UTC(t2.getFullYear(),t2.getMonth(),t2.getDate(),0,0,0), null];
					

					$('#tab_main').find('.s_chart').empty();
					$('#tab_main').find('.s_chart').highcharts({
						chart: {
							zoomType: 'x',
							backgroundColor: 'transparent',
							margin: [10, 30, 25, 50]
						},
						title: {
							text: null
						},
						subtitle: {
							text: null
						},
						xAxis: {
							plotBands: [{
								color: 'rgba(255,255,255,0.1)',
								from: Date.UTC(t1.getFullYear(), t1.getMonth(), t1.getDate(), 8, 0, 0),
								to: Date.UTC(t1.getFullYear(), t1.getMonth(), t1.getDate(), 18, 0, 0)
							}, {
								color: 'rgba(255,255,255,0.1)',
								from: Date.UTC(t1.DateAdd("d", 1).getFullYear(), t1.DateAdd("d", 1).getMonth(), t1.DateAdd("d", 1).getDate(), 8, 0, 0),
								to: Date.UTC(t1.DateAdd("d", 1).getFullYear(), t1.DateAdd("d", 1).getMonth(), t1.DateAdd("d", 1).getDate(), 18, 0, 0)
							}, {
								color: 'rgba(255,255,255,0.1)',
								from: Date.UTC(t1.DateAdd("d", 2).getFullYear(), t1.DateAdd("d", 2).getMonth(), t1.DateAdd("d", 2).getDate(), 8, 0, 0),
								to: Date.UTC(t1.DateAdd("d", 2).getFullYear(), t1.DateAdd("d", 2).getMonth(), t1.DateAdd("d", 2).getDate(), 18, 0, 0)
							}],
							type: 'datetime',
							dateTimeLabelFormats: {
								minute: '%H:%M',
								hour: '%H:%M',
								day: '%Y-%m-%d',
								week: '%Y-%m-%d',
								month: '%Y-%m-%d',
								year: '%Y-%m-%d'
							}
						},
						yAxis: [{
							min: 0,
							gridLineWidth: 1,
							gridLineColor: '#ccc',
							lineWidth: 1,
							title: {
								align: 'high',
								rotation: 0,
								offset: 0,
								text: ''
							},
							labels: {
								format: '{value}'
							},
							stackLabels: {
								enabled: true
							}
						},{
							min: 0,
							gridLineWidth: 1,
							gridLineColor: '#ccc',
							lineWidth: 1,
							title: {
								align: 'high',
								rotation: 0,
								offset: 0,
								text: '安'
							},
							labels: {
								format: '{value}'
							},
							stackLabels: {
								enabled: true
							},
							opposite: true
						}],
						tooltip: {
							formatter: function () {
								return '<b>' + TUI.Utils.parseDate(Math.round(this.x / 1000) - 8 * 3600).Format('yyyy-MM-dd  hh:mm:ss') + '</b><br/>' +
									this.series.userOptions.name + ': ' + this.y + this.series.userOptions.unit;
							}
						},
						plotOptions: {
							spline: {
								lineWidth: 1,
								states: {
									hover: {
										lineWidth: 2
									}
								},
								marker: {
									enabled: false
								}
							}
						},
						exporting: {
							enabled: false
						},
						credits: {
							enabled: false
						},
						legend: {
							enabled: false
						},
						series:series
					});


					//负载率
					var series=[{type: 'spline',name:"负载率",yAxis: 0,data:[],color:"#D84C49",unit:"%"}];
					var t1=new Date().DateAdd("d",-1);
					var t2=new Date().DateAdd("d",1);
					series[0].data[0]=[Date.UTC(t1.getFullYear(),t1.getMonth(),t1.getDate(),0,0,0), null];
					var ncount=0;
					for(var i=0;i<LoadRatio[0].datalist.length;i++)
					{
						var tm=TUI.Utils.parseDate(LoadRatio[0].datalist[i].DataTime);
						series[0].data[ncount]=[Date.UTC(tm.getFullYear(),tm.getMonth(),tm.getDate(),tm.getHours(),tm.getMinutes(),tm.getSeconds()), LoadRatio[0].datalist[i].DataValue];
						ncount++;
					}
					series[0].data[ncount]=[Date.UTC(t2.getFullYear(),t2.getMonth(),t2.getDate(),0,0,0), null];
					$('#tab_main').find('.p_chart').empty();
					$('#tab_main').find('.p_chart').highcharts({
						chart: {
							zoomType: 'x',
							backgroundColor: 'transparent',
							margin: [10, 30, 25, 50]
						},
						title: {
							text: null
						},
						subtitle: {
							text: null
						},
						xAxis: {
							plotBands: [{
								color: 'rgba(255,255,255,0.1)',
								from: Date.UTC(t1.getFullYear(), t1.getMonth(), t1.getDate(), 8, 0, 0),
								to: Date.UTC(t1.getFullYear(), t1.getMonth(), t1.getDate(), 18, 0, 0)
							}, {
								color: 'rgba(255,255,255,0.1)',
								from: Date.UTC(t1.DateAdd("d", 1).getFullYear(), t1.DateAdd("d", 1).getMonth(), t1.DateAdd("d", 1).getDate(), 8, 0, 0),
								to: Date.UTC(t1.DateAdd("d", 1).getFullYear(), t1.DateAdd("d", 1).getMonth(), t1.DateAdd("d", 1).getDate(), 18, 0, 0)
							}, {
								color: 'rgba(255,255,255,0.1)',
								from: Date.UTC(t1.DateAdd("d", 2).getFullYear(), t1.DateAdd("d", 2).getMonth(), t1.DateAdd("d", 2).getDate(), 8, 0, 0),
								to: Date.UTC(t1.DateAdd("d", 2).getFullYear(), t1.DateAdd("d", 2).getMonth(), t1.DateAdd("d", 2).getDate(), 18, 0, 0)
							}],
							type: 'datetime',
							dateTimeLabelFormats: {
								minute: '%H:%M',
								hour: '%H:%M',
								day: '%Y-%m-%d',
								week: '%Y-%m-%d',
								month: '%Y-%m-%d',
								year: '%Y-%m-%d'
							}
						},
						yAxis: [{
							min: 0,
							gridLineWidth: 1,
							gridLineColor: '#ccc',
							lineWidth: 1,
							title: {
								align: 'high',
								rotation: 0,
								offset: 0,
								text: ''
							},
							labels: {
								format: '{value}'
							},
							stackLabels: {
								enabled: true
							}
						},{
							min: 0,
							gridLineWidth: 1,
							gridLineColor: '#ccc',
							lineWidth: 1,
							title: {
								align: 'high',
								rotation: 0,
								offset: 0,
								text: '%'
							},
							labels: {
								format: '{value}'
							},
							stackLabels: {
								enabled: true
							},
							opposite: true
						}],
						tooltip: {
							formatter: function () {
								return '<b>' + TUI.Utils.parseDate(Math.round(this.x / 1000) - 8 * 3600).Format('yyyy-MM-dd  hh:mm:ss') + '</b><br/>' +
									this.series.userOptions.name + ': ' + this.y + this.series.userOptions.unit;
							}
						},
						plotOptions: {
							spline: {
								lineWidth: 1,
								states: {
									hover: {
										lineWidth: 2
									}
								},
								marker: {
									enabled: false
								}
							}
						},
						exporting: {
							enabled: false
						},
						credits: {
							enabled: false
						},
						legend: {
							enabled: false
						},
						series:series
					});

					//装置在线率
					var series=[{type: 'spline',name:"装置在线率",yAxis: 0,data:[],color:"#0099ff",unit:"%"}];
					var t1=new Date().DateAdd("d",-1);
					var t2=new Date().DateAdd("d",1);
					series[0].data[0]=[Date.UTC(t1.getFullYear(),t1.getMonth(),t1.getDate(),0,0,0), null];
					var ncount=0;
					for(var i=0;i<OnlineRate[0].datalist.length;i++)
					{
						var tm=TUI.Utils.parseDate(OnlineRate[0].datalist[i].DataTime);
						series[0].data[ncount]=[Date.UTC(tm.getFullYear(),tm.getMonth(),tm.getDate(),tm.getHours(),tm.getMinutes(),tm.getSeconds()), OnlineRate[0].datalist[i].DataValue];
						ncount++;
					}
					series[0].data[ncount]=[Date.UTC(t2.getFullYear(),t2.getMonth(),t2.getDate(),0,0,0), null];
					$('#tab_main').find('.ep_chart').empty();
					$('#tab_main').find('.ep_chart').highcharts({
						chart: {
							zoomType: 'x',
							backgroundColor: 'transparent',
							margin: [10, 40, 25, 40]
						},
						title: {
							text: null
						},
						subtitle: {
							text: null
						},
						xAxis: {
							plotBands: [{
								color: 'rgba(255,255,255,0.1)',
								from: Date.UTC(t1.getFullYear(), t1.getMonth(), t1.getDate(), 8, 0, 0),
								to: Date.UTC(t1.getFullYear(), t1.getMonth(), t1.getDate(), 18, 0, 0)
							}, {
								color: 'rgba(255,255,255,0.1)',
								from: Date.UTC(t1.DateAdd("d", 1).getFullYear(), t1.DateAdd("d", 1).getMonth(), t1.DateAdd("d", 1).getDate(), 8, 0, 0),
								to: Date.UTC(t1.DateAdd("d", 1).getFullYear(), t1.DateAdd("d", 1).getMonth(), t1.DateAdd("d", 1).getDate(), 18, 0, 0)
							}, {
								color: 'rgba(255,255,255,0.1)',
								from: Date.UTC(t1.DateAdd("d", 2).getFullYear(), t1.DateAdd("d", 2).getMonth(), t1.DateAdd("d", 2).getDate(), 8, 0, 0),
								to: Date.UTC(t1.DateAdd("d", 2).getFullYear(), t1.DateAdd("d", 2).getMonth(), t1.DateAdd("d", 2).getDate(), 18, 0, 0)
							}],
							type: 'datetime',
							dateTimeLabelFormats: {
								minute: '%H:%M',
								hour: '%H:%M',
								day: '%Y-%m-%d',
								week: '%Y-%m-%d',
								month: '%Y-%m-%d',
								year: '%Y-%m-%d'
							}
						},
						yAxis: [{
							min: 0,
							max: 100,
							gridLineWidth: 1,
							gridLineColor: '#ccc',
							lineWidth: 1,
							title: {
								align: 'high',
								rotation: 0,
								offset: 0,
								text: ''
							},
							labels: {
								format: '{value}'
							},
							stackLabels: {
								enabled: true
							}
						},{
							min: 0,
							gridLineWidth: 1,
							gridLineColor: '#ccc',
							lineWidth: 1,
							title: {
								align: 'high',
								rotation: 0,
								offset: 0,
								text: '%'
							},
							labels: {
								format: '{value}'
							},
							stackLabels: {
								enabled: true
							},
							opposite: true
						}],
						tooltip: {
							formatter: function () {
								return '<b>' + TUI.Utils.parseDate(Math.round(this.x / 1000) - 8 * 3600).Format('yyyy-MM-dd  hh:mm:ss') + '</b><br/>' +
									this.series.userOptions.name + ': ' + this.y + this.series.userOptions.unit;
							}
						},
						plotOptions: {
							spline: {
								lineWidth: 1,
								states: {
									hover: {
										lineWidth: 2
									}
								},
								marker: {
									enabled: false
								}
							}
						},
						exporting: {
							enabled: false
						},
						credits: {
							enabled: false
						},
						legend: {
							enabled: false
						},
						series:series
					});
					
				}
			})
			
		},
		updateToken: function () {
			$.ajax({
				type: 'get',
				url: '/API/WeiXin/AccessToken',
				dataType: "json",
				context:this,
				error: function (result) {
				},
				success: function (result) {
					TUI.env.wx=result;
					TUI.env.wx.ready=false;
					//
					if(result.appid!="")
					{
						wx.config({
							debug: false,
							appId: result.appid,
							timestamp:result.timestamp,
							nonceStr:result.nonceStr,
							signature:result.signature,
							jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','stopRecord','onVoiceRecordEnd','translateVoice','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice','chooseImage','uploadImage','getNetworkType','openLocation','getLocation','closeWindow','scanQRCode','showOptionMenu','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem'] 
						});
						//
						wx.ready(function(){
							TUI.env.wx.ready=true;
						});
						//
						setTimeout("TUI.env.mobile.updateToken();",(result.expires-result.lasttime)*1000);
					}
				}
			});
		},
		show: function (speed) {
			TUI.env.status="Mobile";
		},
		hide: function (speed) {

		}
	};
};
//
//主程序入口
$(document).ready(function () {
	$.ajax({
			type: 'get',
			url: "/System/srv/login.ejs",
			dataType: "json",
			error: function (result) {
				window.location.href="/API/My/Login/?goto="+escape("/Webapp/WeiCenter/Mobile/InspectionHigh/");
			},
			success: function (result) {
				//初始化用户信息
				TUI.env.us = result;
				//
				TUI.env.mobile = new MyApp();
				TUI.env.mobile.init();
				TUI.env.mobile.show("normal");
			}
		});
});
