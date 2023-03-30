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
                window.location.href = document.referrer;
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
				window.history.pushState("Inspection", "Inspection", "#");  
				//
				$('#tab_main').find('.subtitle_bar').empty();
				$('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>&nbsp;&nbsp;&nbsp;</span><span class="ok">确定</span>');
				$('#tab_main').find('.subtitle_body').html('<div class="article-list"><div class="weui_cells_title">选择变电所</div><div class="weui_cells weui_cells_checkbox"></div></div>');
				//

				var Series = [];
				Series.push({ url: "/API/System/PCPS/ObjectClass/SubstationSystem?valueTag=DeviceOnlineRate,TotalOpen,TotalS,DmdEs,TotalP,TotalEp" });
				$.showLoading();
				//加载所有变电所
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
						var sData=result[0].datas;

						for(let i=0;i<sData.length;i++){
							if(localStorage["Inspection-display-"+sData[i].NodeID]=="false")
							{
								var item=$('<label class="weui_cell weui_check_label" for="'+sData[i].NodeID+'">'
									+'	  <div class="weui_cell_hd">'
									+'		<input type="checkbox" class="weui_check" name="checkuser" id="'+sData[i].NodeID+'" value="'+sData[i].NodeID+'">'
									+'		<i class="weui_icon_checked"></i>'
									+'	  </div>'
									+'	  <div class="weui_cell_bd weui_cell_primary">'
									+'		<p>'+TUI.Utils.getTagNameRight(sData[i].NodeFullName,2).replace(".变电所基本表","")+'</p>'
									+'	  </div>'
									+'	</label>');
								//
								$('#tab_main').find('.subtitle_body .weui_cells_checkbox').append(item);
							}else
							{
								var item=$('<label class="weui_cell weui_check_label" for="'+sData[i].NodeID+'">'
									+'	  <div class="weui_cell_hd">'
									+'		<input type="checkbox" class="weui_check" name="checkuser" id="'+sData[i].NodeID+'" value="'+sData[i].NodeID+'" checked>'
									+'		<i class="weui_icon_checked"></i>'
									+'	  </div>'
									+'	  <div class="weui_cell_bd weui_cell_primary">'
									+'		<p>'+TUI.Utils.getTagNameRight(sData[i].NodeFullName,2).replace(".变电所基本表","")+'</p>'
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
							localStorage["Inspection-display-"+$(this).prop('value')]="true";
						}
						else
						{
							localStorage["Inspection-display-"+$(this).prop('value')]="false";
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
			$.showLoading();
			//加载所有变电所
			$.ajax({
				type:"get",
				url: '/API/System/PCPS/ObjectClass/SubstationSystem?valueTag=DeviceOnlineRate,TotalOpen,TotalS,DmdEs,TotalP,TotalEp',
                dataType:"json",
				error:function(result){
					$.hideLoading();
					$.toast("服务不给力", "forbidden");
				},
				success:function(result){
					$('#tab_body').find(".contact").pullToRefreshDone();
					$('#tab_body').find('.smart-list').empty();
					var panel=$('<div class="weui_panel weui_panel_access"><div class="weui_panel_bd"></div></div>');
					var sData=result;
					var allData=[];
					for(let i=0;i<sData.length;i++){
						allData[allData.length]={
							sort:(localStorage["Inspection-sort-"+sData[i].NodeID]==undefined||localStorage["Inspection-sort-"+sData[i].NodeID]=="")?0:parseInt(localStorage["Inspection-sort-"+sData[i].NodeID]),
							isShow:(localStorage["Inspection-display-"+sData[i].NodeID]=="false"?false:true),
							GroupID:sData[i].GroupID,
							NodeID:sData[i].NodeID,
							NodeType:"SubStation",
							opcPath:sData[i].NodeFullTag,
							imgfile:"images/substation.png",
							title:TUI.Utils.getTagNameRight(sData[i].NodeFullName,2).replace(".变电所基本表",""),
							lastMessage:"设备在线率:"+sData[i].OPCValueList[sData[i].OPCValueMap.DeviceOnlineRate].DataValue+"%"
									+",出线分闸量:"+sData[i].OPCValueList[sData[i].OPCValueMap.TotalOpen].DataValue+"个",
							detail:{
								TotalS:sData[i].OPCValueList[sData[i].OPCValueMap.TotalS].DataValue,
								DmdEs:sData[i].OPCValueList[sData[i].OPCValueMap.DmdEs].DataValue,
								TotalP:sData[i].OPCValueList[sData[i].OPCValueMap.TotalP].DataValue,
								TodayTotalEp:sData[i].OPCValueList[sData[i].OPCValueMap.TotalEp].DayMeasure,
								DateTime:sData[i].OnLineTime
							}
						
						}
					}
					allData.sort(function(a,b){
						return a.sort>b.sort?-1:1;
					})
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
							localStorage["Inspection-max"]=(localStorage["Inspection-max"]==undefined||localStorage["Inspection-max"]=="")?1:(parseInt(localStorage["Inspection-max"])+1);
							localStorage["Inspection-sort-"+e.data.node.NodeID]=localStorage["Inspection-max"];
							//$('#tab_body').find('.smart-list').find(".weui_panel_bd").prepend(e.data.handle);
							TUI.env.mobile.loadSubStation();
							return false;
						});
						//
						item.find(".remove").bind(TUI.env.ua.ontouch?"tap":TUI.env.ua.clickEventUp, { handle: item,node:allData[i] }, function (e) {
							e.data.handle.remove();
							localStorage["Inspection-sort-"+e.data.node.NodeID]=0;
							localStorage["Inspection-display-"+e.data.node.NodeID]="false";
							return false;
						});

						$(panel).find(".weui_panel_bd").append(item);
						$.hideLoading();
					}
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
					+'		<div class="weui_panel weui_panel_access meter '+item.NodeType+'">'
					+'			<div class="weui_panel_hd">'
					+'				<div class="hub_p"><span class="dtime">总视在功率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+item.detail.DateTime.substring(11)+'&nbsp;&nbsp;&nbsp;&nbsp;</span><br><span class="real">'+TUI.Utils.formatNumber(item.detail.TotalS,"00000.0")+'</span><span>千伏安</span></div>'
					+'			</div>'
					+'			<div class="weui_panel_hd" style="padding: 8px;">'
					+'				<div class="scoreItem" id="hub_Ep">日累计电量<br><span>'+TUI.Utils.formatNumber(item.detail.TodayTotalEp,"0.00")+'千瓦时</span></div>'
					+'				<div class="scoreItem md" id="hub_WorkTime">总有功功率<br><span>'+TUI.Utils.formatNumber(item.detail.TotalP,"0.0")+'千瓦</span></div>'
					+'				<div class="scoreItem" id="hub_WaitTime">总最大需量<br><span>'+TUI.Utils.formatNumber(item.detail.DmdEs,"0.0")+'千伏安</span></div>'
					+'			</div>'
					+'		</div>'							
					+'		<div class="weui_panel weui_panel_access">'
					+'			<div class="weui_panel_hd weui_cells_access">'
					+'				<span>总视在功率(千伏安)</span><span style="float:right"></span>'
					+'			</div>'
					+'			<div class="weui_panel_hd" style="padding:10px;">'
					+'				<div class="s_chart" style="height:140px"></div>'
					+'			</div>'
					+'		</div>'						
					+'		<div class="weui_panel weui_panel_access">'
					+'			<div class="weui_panel_hd weui_cells_access">'
					+'				<span>总有功功率(千瓦)</span><span style="float:right"></span>'
					+'			</div>'
					+'			<div class="weui_panel_hd" style="padding:10px;">'
					+'				<div class="p_chart" style="height:140px"></div>'
					+'			</div>'
					+'		</div>'					
					+'		<div class="weui_panel weui_panel_access">'
					+'			<div class="weui_panel_hd weui_cells_access">'
					+'				<span>总有功电能(千瓦时)</span><span style="float:right"></span>'
					+'			</div>'
					+'			<div class="weui_panel_hd" style="padding:10px;">'
					+'				<div class="ep_chart" style="height:140px"></div>'
					+'			</div>'
					+'		</div>'
					+'		<br><br>'						
					+'	</div></div>'
					+'		<div class="operate open">我要巡检</div>'
					+'		<div id="InspectionReport" class="weui-popup-container">'
					+'			<div class="weui-popup-modal">'
					+'				<div class="subtitle_bar"><span  class="close-popup" style="color: #666;float:left;line-height: 44px;padding: 0 10px;"><i class="icon iconfont">&#xe620;</i>'+item.title+'</span></div>'
					+'				<div class="bd inspectionlist">暂无记录</div>'
					+'			</div>'
					+'      </div>'
					+'		<div id="operateInspection" class="weui-popup-container">'
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

					+'			  <div class="weui_cells_title">单选列表项</div>'

					+'			  <div class="weui_cells weui_cells_radio">'
					+'				<label class="weui_cell weui_check_label" for="x11">'
					+'				  <div class="weui_cell_bd weui_cell_primary">'
					+'					<p>正常状态</p>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'					<input type="radio" class="weui_check" name="radio1" value="1" id="x11" checked="checked">'
					+'					<span class="weui_icon_checked"></span>'
					+'				  </div>'
					+'				</label>'
					+'				<label class="weui_cell weui_check_label" for="x12">'
					+'				  <div class="weui_cell_bd weui_cell_primary">'
					+'					<p>告警状态</p>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'					<input type="radio" name="radio1" value="3" class="weui_check" id="x12" >'
					+'					<span class="weui_icon_checked"></span>'
					+'				  </div>'
					+'				</label>'
					+'				<label class="weui_cell weui_check_label" for="x13">'
					+'				  <div class="weui_cell_bd weui_cell_primary">'
					+'					<p>故障状态</p>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'					<input type="radio" name="radio1" value="4" class="weui_check" id="x13" >'
					+'					<span class="weui_icon_checked"></span>'
					+'				  </div>'
					+'				</label>'
					+'				<label class="weui_cell weui_check_label" for="x14">'
					+'				  <div class="weui_cell_bd weui_cell_primary">'
					+'					<p>瘫痪状态</p>'
					+'				  </div>'
					+'				  <div class="weui_cell_ft">'
					+'					<input type="radio" name="radio1" value="5" class="weui_check" id="x14" >'
					+'					<span class="weui_icon_checked"></span>'
					+'				  </div>'
					+'				</label>'
					+'			  </div>'
					+'			<div class="operate put" style="background: #489c2d;" >记录巡检</div>'
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
				  actions: [{
					text: "VR巡查",
					onClick: function() {
					  //do something
					  TUI.env.mobile.loadVR(node);
					}
				  },{
					text: "巡检报告",
					onClick: function() {
					  //do something
						$("#InspectionReport").popup();
						TUI.env.mobile.getInspectionList(node);
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
				//TUI.env.mobile.putInspection(e.data.config);
				$("#operateInspection").popup();

				return false;
			});
			$('#tab_main').find('.operate.put').bind(TUI.env.ua.clickEventUp, { handle: this,config:item}, function (e) {
				//
				//
				
				var what=$('#tab_main').find('.weui-textarea').val();
				var status=$("input[type='radio']:checked").val();
                TUI.env.mobile.putInspection(e.data.config,what,status);
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
		getInspectionList:function(node){
			//巡检
			$.ajax({
				type:"get",
				url: '/API/Inspect?apptag=PCPS',
				dataType:"json",
				error:function(result){
					$.hideLoading();
					$.toast("服务不给力", "forbidden");
				},
				success:function(result){
					$(".inspectionlist").empty();
					//1、正常状态，2、通知状态，3、告警状态，4、故障状态，5、瘫痪状态。
					var status=["正常状态",'通知状态','告警状态','故障状态','瘫痪状态']
					var h="";
					for(var i=0;i<result.data.length;i++){
						h+='<div class="weui_panel">'
						h+='	<div class="weui_media_box weui_media_text">'
						h+='		<p class="weui_media_desc weui_panel_ft" style="font-size:20px;padding-left:0px;border-bottom: 1px solid #e5e5e5;color: #333;">'+result.data[i].RecordWhere+'</p>'
						h+='		<p class="weui_media_desc" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">巡检时间：&nbsp;&nbsp;<b>'+result.data[i].RecordTime+'</b></p>'
						h+='		<p class="weui_media_desc" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">巡检状态：&nbsp;&nbsp;<b>'+status[result.data[i].RecordStatus]+'</b></p>'
						h+='		<p class="weui_media_desc" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">巡检人员：&nbsp;&nbsp;<b>'+result.data[i].RecordName+'</b></p>'
                        h += '		<p class="weui_media_desc" style="line-height: 30px; border-bottom: 1px solid #e5e5e5;">巡检内容：&nbsp;&nbsp;<b>' +unescape(result.data[i].RecordInfo)+'</b></p>'
						h+='	</div>'
						h+='</div>';
					}
					if(h==""){
						h="暂无记录";
					}
					$(".inspectionlist").html(h);
				}
			})

		},
		putInspection:function(node,what,status){
			$.showLoading();

			//巡检
			$.ajax({
				type:"post",
				url: '/API/Inspect',
                data: {
					apptag:"PCPS",
					where:node.title,
					what:what,
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
					$.toast("提交成功", "success");
					 $.hideLoading();
				}
			})
		},
		loadSubStationDetailData:function(node){
			var nDate=new Date();
			var startTime=nDate.Format("yyyy-MM-dd 00:00:00");
			var endTime=nDate.Format("yyyy-MM-dd hh:mm:ss");
			var NodeFullTag=node.opcPath;
			var URLs=[
			{ url: "/API/System/PCPS/Mining/History?NodeFullTag="+NodeFullTag+"&valueTag=TotalS&startTime="+startTime+"&endTime="+endTime+"&isparam=0&groupby=Time" },  //总视在功率
			{ url: "/API/System/PCPS/Mining/History?NodeFullTag="+NodeFullTag+"&valueTag=TotalP&startTime="+startTime+"&endTime="+endTime+"&isparam=0&groupby=Time" }, //总有功功率
			{ url: "/API/System/PCPS/Mining/Statistics/Hour?NodeFullTag="+NodeFullTag+"&keyvalue=TotalEp&startTime="+startTime+"&endTime="+endTime+"&isparam=0&groupby=Time" } //总有功电能
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
					var TotalS=result[0].datas.node;
					var TotalP=result[1].datas.node;
					var TotalEp=result[2].datas.data;
					//
					//总视在功率
					var series=[{type: 'spline',name:"总视在功率",data:[],color:"#1BBFAF",unit:"千伏安"}];
					var t1=new Date().DateAdd("d",-1);
					var t2=new Date().DateAdd("d",1);
					series[0].data[0]=[Date.UTC(t1.getFullYear(),t1.getMonth(),t1.getDate(),0,0,0), null];
					var ncount=0;
					for(var i=0;i<TotalS[0].datalist.length;i++)
					{
						var tm=TUI.Utils.parseDate(TotalS[0].datalist[i].DataTime);
						series[0].data[ncount]=[Date.UTC(tm.getFullYear(),tm.getMonth(),tm.getDate(),tm.getHours(),tm.getMinutes(),tm.getSeconds()), TotalS[0].datalist[i].DataValue];
						ncount++;
					}
					series[0].data[ncount]=[Date.UTC(t2.getFullYear(),t2.getMonth(),t2.getDate(),0,0,0), null];
					

					$('#tab_main').find('.s_chart').empty();
					$('#tab_main').find('.s_chart').highcharts({
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


					//总有功功率
					var series=[{type: 'spline',name:"总有功功率",data:[],color:"#D84C49",unit:"千瓦"}];
					var t1=new Date().DateAdd("d",-1);
					var t2=new Date().DateAdd("d",1);
					series[0].data[0]=[Date.UTC(t1.getFullYear(),t1.getMonth(),t1.getDate(),0,0,0), null];
					var ncount=0;
					for(var i=0;i<TotalP[0].datalist.length;i++)
					{
						var tm=TUI.Utils.parseDate(TotalP[0].datalist[i].DataTime);
						series[0].data[ncount]=[Date.UTC(tm.getFullYear(),tm.getMonth(),tm.getDate(),tm.getHours(),tm.getMinutes(),tm.getSeconds()), TotalP[0].datalist[i].DataValue];
						ncount++;
					}
					series[0].data[ncount]=[Date.UTC(t2.getFullYear(),t2.getMonth(),t2.getDate(),0,0,0), null];
					

					$('#tab_main').find('.p_chart').empty();
					$('#tab_main').find('.p_chart').highcharts({
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

					//小时有功电能
					var series=[{type: 'column',name:"用电量",data:[],color:"#0099ff"}];
					var ncount=0;
					for(var i=0;i<TotalEp.length;i++)
					{
						if(TotalEp[i].value.HourMeasure!=null)
						{
							series[0].data[ncount]=[Date.UTC(TotalEp[i].year,TotalEp[i].month-1,TotalEp[i].day,TotalEp[i].hour,0,0),TotalEp[i].value.HourMeasure];
							ncount++;
						}
					}
					let startTime=new Date().DateAdd("d",-1);
					$('#tab_main').find('.ep_chart').empty();
					$('#tab_main').find('.ep_chart').highcharts({
						chart: {
							zoomType: 'x',
							backgroundColor: 'transparent',
							margin: [10, 10, 25, 40]
						},
						title: {
							text: null
						},
						subtitle: {
							text: null
						},
						xAxis: {
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
							title: {
								align:'high',
								rotation:0,
								offset:-25,
								text: ''
							},
							labels: {
								//format: '{value}/1000'
								formatter: function () {
									return (this.value/1000 + "K");
								}
							},
							stackLabels: {
								enabled: true
							}
						}],
						tooltip: {
							formatter: function() {
								return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy-MM-dd  hh:mm")+' 到 '+TUI.Utils.parseDate(Math.round(this.x/1000)-7*3600).Format("hh:mm") +'</b><br/>用电量: '+ this.y +'千瓦时';
							}
						},  
						 plotOptions: {  
							 column: {  
								 borderWidth: 0  
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
						series: series
					});
					
				}
			})
			
		},
		loadVR: function (node) {
			$('#tab_main').find('.subtitle_bar').empty();
			$('#tab_main').find('.subtitle_bar').html('<span class="back"><i class="icon iconfont">&#xe620;</i>'+node.title+'</span>');
			$('#tab_main').find('.subtitle_body').html('<div class="article-list-vr" id="webvr"></div>');
			var path=node.opcPath.split(".").slice(1,node.opcPath.split(".").length-1).join("/");
			this.monit = null;
			this.floormonit = null;
			$('#webvr').empty();
			TUI.env.mobile.SceneConfig = undefined;
			window.clearInterval(TUI.env.mobile.sceneTime);
			this.VRpath = path;
			this.myAppMap = new TUI.WebVR("webvr");
			this.myAppMap.init({
				tag: path.split("/")[0],
				path: path,
				option: {
					//rotate: { "longitude": 0, "latitude": 0 }
				},
				bEdit: true,
				fn: function (psv, config) {
					if (config.data.tag == "#") {
					   TUI.env.mobile.SceneConfig = undefined;
						window.clearInterval(TUI.env.mobile.sceneTime);
						return;
					}
					//
				   TUI.env.mobile.SceneConfig = config;
					window.clearInterval(TUI.env.mobile.sceneTime);
				   TUI.env.mobile.sceneTime = window.setInterval(function () {
					   TUI.env.mobile.updateSceneAR();
					}, 5000);
					//
					$.ajax({
						type: 'get',
						url: "/API/System/PCPS/Facility/" + config.data.tag.split(".").join("/"),
						dataType: "json",
						context: config,
						error: function (result) {
						},
						success: function (result) {
							if (result.OPCNodeList != undefined) {
								for (var i = 0; i < result.OPCNodeList.length; i++) {
									for (var j = 0; j < this.data.markers.length; j++) {
										if (this.data.markers[j].data != undefined
											&& this.data.markers[j].data.valuePath != undefined
											&& this.data.markers[j].data.valuePath != ""
											&& this.data.markers[j].data.valuePath == result.OPCNodeList[i].NodeFullTag
											&& this.data.markers[j].data.valueTag != undefined
											&& this.data.markers[j].data.valueTag != "") {
											var dataValue = result.OPCNodeList[i].OPCValueList[result.OPCNodeList[i].OPCValueMap[this.data.markers[j].data.valueTag]].DataValue;
											var imgIdx = parseInt((dataValue - this.data.markers[j].data.valueRange[0]) * (this.data.markers[j].data.valueImg.length - 1) / (this.data.markers[j].data.valueRange[1] - this.data.markers[j].data.valueRange[0]));
											if (dataValue <= this.data.markers[j].data.valueRange[0])
												imgIdx = 0;
											if (dataValue >= this.data.markers[j].data.valueRange[1])
												imgIdx = this.data.markers[j].data.valueImg.length - 1;
											this.data.markers[j].image = '/API/Map/VR/' + this.data.markers[j].data.valueImg[imgIdx];
											this.data.markers[j].data.usedata = result.OPCNodeList[i];
											this.data.markers[j].data.url = "/Project/PCPS/srv/webvr/getNodePannel.ejs?fullTag=" + result.OPCNodeList[i].NodeFullTag + "&TagName=" + encodeURIComponent(result.OPCNodeList[i].NodeName);
											this.data.markers[j].data.fn = function (psv, config, pannel) {
												pannel.find('.make-switch').bootstrapSwitch();
												pannel.find('.btn').on(TUI.env.ua.clickEventUp, { handle: psv, usedata: config }, function (e) {
													if (this.id == "save") {
														vlist = [];
														for (var i = 0; i < e.data.usedata.data.usedata.ObjectAttr.length; i++) {
															switch (e.data.usedata.data.usedata.ObjectAttr[i].AttrType) {
																case "text":	//纯文本
																	{
																		vlist[vlist.length] = {
																			AttrType: 0,
																			AttrTag: e.data.usedata.data.usedata.ObjectAttr[i].AttrTag,
																			AttrValue: $('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID).prop("value"),
																			EnumKey: (e.data.usedata.data.usedata.ObjectAttr[i].EnumFlag ? $('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID + ' option:selected').text() : "")
																		};
																	}
																	break;
																case "float":	//浮点型数字
																	{
																		vlist[vlist.length] = {
																			AttrType: 2,
																			AttrTag: e.data.usedata.data.usedata.ObjectAttr[i].AttrTag,
																			AttrValue: parseFloat($('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID).prop("value")),
																			EnumKey: (e.data.usedata.data.usedata.ObjectAttr[i].EnumFlag ? $('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID + ' option:selected').text() : "")
																		};
																	}
																	break;
																case "int":	//整型数字
																	{
																		vlist[vlist.length] = {
																			AttrType: 3,
																			AttrTag: e.data.usedata.data.usedata.ObjectAttr[i].AttrTag,
																			AttrValue: parseInt($('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID).prop("value")),
																			EnumKey: (e.data.usedata.data.usedata.ObjectAttr[i].EnumFlag ? $('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID + ' option:selected').text() : "")
																		};
																	}
																	break;
																case "bool":	//布尔型数字
																	{
																		vlist[vlist.length] = {
																			AttrType: 4,
																			AttrTag: e.data.usedata.data.usedata.ObjectAttr[i].AttrTag,
																			AttrValue: $("#" + e.data.usedata.data.usedata.ObjectAttr[i].AttrID).bootstrapSwitch("state"),
																			EnumKey: ""
																		};
																	}
																	break;
															}
														}
														$.ajax({
															url: "/Project/PCPS/srv/webvr/setAttrValue.ejs",
															data: { OpcPath: e.data.usedata.data.usedata.NodeFullTag, vlist: TUI.JSON.encode(vlist) },
															type: "POST",
															dataType: "json",
															context: this,
															error: function () {
															},
															success: function (result) {
																if (!result.flag) {
																	toastr["warning"](result.info, "智能设备属性设置");
																	return;
																}
																$(".btn-group-justified").hide();
															}
														});
													}
													else if (this.id == "cancel") {
													   TUI.env.mobile.refreshSceneAR(e.data.handle, e.data.usedata);
													}
													else if (this.id == "edit") {
														$(".stethoscope").hide();
														$(".product").hide();
														$(".device").show();
														$(".btn-group-justified").show();
													}
													else if (this.id == "refresh") {
														$(".stethoscope").hide();
														$(".product").hide();
														$(".device").show();
														//
														$.ajax({
															url: "/Project/PCPS/srv/webvr/readMonitValue.ejs",
															data: { OpcPath: e.data.usedata.data.usedata.NodeFullTag },
															type: "POST",
															dataType: "json",
															context: this,
															error: function () {
															},
															success: function (result) {
																if (!result.flag) {
																	toastr["warning"](result.info, "智能设备即抄");
																}
															}
														});
														//
														TUI.Comet.OnClose();
														TUI.Comet.AddOPCSrv(e.data.usedata.data.usedata.NodeFullTag,TUI.env.mobile.refreshSceneAR(e.data.handle, e.data.usedata));
														TUI.Comet.OnListen();
													}
													else if (this.id == "info") {
														$(".stethoscope").hide();
														$(".product").show();
														$(".device").hide();
													}
													else if (this.id == "stethoscope") {
														$(".stethoscope").show();
														$(".product").hide();
														$(".device").hide();
													}
													else if (this.id == "record") {
														var NodeRecordInfo = $('#NodeRecordInfo').prop("value");
														if (NodeRecordInfo == "") {
															toastr["warning"]("必须输入点检设备状态描述信息", "人工设备点检");
															return;
														}
														//
														$.ajax({
															type: 'post',
															url: "srv/Inspect/pushNodeRecode.ejs",
															data: { NodeFullName: e.data.usedata.data.usedata.NodeFullName, NodeFullTag: e.data.usedata.data.usedata.NodeFullTag, NodeID: e.data.usedata.data.usedata.NodeID, RecordStatus: $('#NodeRecordStatus').prop("value"), NodeRecordInfo: NodeRecordInfo },
															dataType: "json",
															context: e.data.handle,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if (result.flag) {
																	$('#NodeRecordInfo').val("");
																	var status = ['success', 'info', 'warning', 'danger', 'danger'];
																	$(".stethoscope").append('<div class="alert alert-block alert-' + status[result.data.RecordStatus] + ' fade in">'
																				+ '		<h4 class="alert-heading"><span style="float:left;">' + result.data.RecordName + '</span><span style="float:right;">' + TUI.Utils.dateMessage(result.data.RecordTime) + '</span></h4>'
																				+ '		<br><p style="font-size:10.5pt;">' + result.data.RecordInfo + '</p>'
																				+ '</div>');
																	toastr["success"]("提交设备点检记录成功！", "人工设备点检");
																}
															}
														});
													}
													else if (this.id == "reload") {
													   TUI.env.mobile.refreshSceneAR(e.data.handle, e.data.usedata);
													}
													else {
														$.ajax({
															type: 'post',
															url: "/Project/PCPS/srv/webvr/pushActionTask.ejs",
															data: { OPCFilter: e.data.usedata.data.usedata.NodeFullTag, RuleID: this.id },
															dataType: "json",
															context: e.data.handle,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																toastr["success"]("发送远程控制指令成功，控制状态可查询控制中心！", "远程控制服务");
															}
														});
													}
													return false;
												});
												//
												pannel.find('.chart-bar').on(TUI.env.ua.clickEventUp, { handle: psv, usedata: config }, function (e) {
													$.ajax({
														type: 'get',
														url: 'srv/map/getMeterRealData.tjs?path=' + e.data.usedata.data.usedata.NodeFullTag,
														dataType: "json",
														context: this,
														success: function (result) {
															var idx = result.OPCValueMap[this.id];
															if (idx != undefined) {
																var valInfo = result.OPCValueList[idx];
																valInfo.selDate = new Date();
																valInfo.selDate.setHours(0, 0, 0, 0);
																if (valInfo.DataUnit == "无")
																	valInfo.DataUnit = "";
																$('#psv-marker-' + e.data.usedata.id).html('<div class="label"><div class="chevron"><span style="float:left;">' + valInfo.ValueName + (valInfo.DataUnit == "" ? '' : ('【' + valInfo.DataUnit + '】')) + '</span><span style="float:right;"><i class="fa fa-chevron-left"></i>&nbsp;&nbsp;<em>' + valInfo.selDate.Format('yyyy-MM-dd') + '</em>&nbsp;&nbsp;<i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<i class="fa fa-times-circle"></i>&nbsp;</span><div class="psv-chart"></div></div><span class="pointer"></span></div>');
																//
																$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-left").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, NodeID: e.data.usedata.data.usedata.NodeID, NodeTag: e.data.usedata.data.usedata.NodeTag, valInfo: valInfo }, function (e) {
																	valInfo.selDate = valInfo.selDate.DateAdd("d", -3);
																	$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd'));
																   TUI.env.mobile.loadChartBar(e.data.NodeID, e.data.NodeTag, e.data.valInfo);
																	return false;
																});
																//
																$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-right").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, NodeID: e.data.usedata.data.usedata.NodeID, NodeTag: e.data.usedata.data.usedata.NodeTag, valInfo: valInfo }, function (e) {
																	valInfo.selDate = valInfo.selDate.DateAdd("d", 3);
																	$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd'));
																   TUI.env.mobile.loadChartBar(e.data.NodeID, e.data.NodeTag, e.data.valInfo);
																	return false;
																});
																//
																$('#psv-marker-' + e.data.usedata.id).find(".fa-times-circle").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id }, function (e) {
																	$('#psv-marker-' + e.data.id).empty();
																	return false;
																});
																//
															   TUI.env.mobile.loadChartBar(e.data.usedata.data.usedata.NodeID, e.data.usedata.data.usedata.NodeTag, valInfo);
															} 
														}
													});
													return false;
												});
												//
												pannel.find('.chart-line').on(TUI.env.ua.clickEventUp, { handle: psv, usedata: config }, function (e) {
													$.ajax({
														type: 'get',
														url: 'srv/map/getMeterRealData.tjs?path=' + e.data.usedata.data.usedata.NodeFullTag,
														dataType: "json",
														context: this,
														success: function (result) {
															var idx = result.OPCValueMap[this.id];
															if (idx != undefined) {
																var valInfo = result.OPCValueList[idx];
																valInfo.selDate = new Date();
																valInfo.selDate.setHours(0, 0, 0, 0);
																if (valInfo.DataUnit == "无")
																	valInfo.DataUnit = "";
																$('#psv-marker-' + e.data.usedata.id).html('<div class="label"><div class="chevron"><span style="float:left;">' + valInfo.ValueName + (valInfo.DataUnit == "" ? '' : ('【' + valInfo.DataUnit + '】')) + '</span><span style="float:right;"><i class="fa fa-chevron-left"></i>&nbsp;&nbsp;<em>' + valInfo.selDate.Format('yyyy-MM-dd') + '</em>&nbsp;&nbsp;<i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<i class="fa fa-times-circle"></i>&nbsp;</span><div class="psv-chart"></div></div><span class="pointer"></span></div>');
																//
																$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-left").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, NodeID: e.data.usedata.data.usedata.NodeID, NodeTag: e.data.usedata.data.usedata.NodeTag, valInfo: valInfo }, function (e) {
																	valInfo.selDate = valInfo.selDate.DateAdd("d", -3);
																	$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd'));
																   TUI.env.mobile.loadChartLine(e.data.NodeID, e.data.NodeTag, e.data.valInfo);
																	return false;
																});
																//
																$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-right").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, NodeID: e.data.usedata.data.usedata.NodeID, NodeTag: e.data.usedata.data.usedata.NodeTag, valInfo: valInfo }, function (e) {
																	valInfo.selDate = valInfo.selDate.DateAdd("d", 3);
																	$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd'));
																   TUI.env.mobile.loadChartLine(e.data.NodeID, e.data.NodeTag, e.data.valInfo);
																	return false;
																});
																//
																$('#psv-marker-' + e.data.usedata.id).find(".fa-times-circle").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id }, function (e) {
																	$('#psv-marker-' + e.data.id).empty();
																	return false;
																});
																//
															   TUI.env.mobile.loadChartLine(e.data.usedata.data.usedata.NodeID, e.data.usedata.data.usedata.NodeTag, valInfo);
															}
														}
													});
													return false;
												});
												//
												pannel.find('.chart-gant').on(TUI.env.ua.clickEventUp, { handle: psv, usedata: config }, function (e) {
													$.ajax({
														type: 'get',
														url: 'srv/map/getMeterRealData.tjs?path=' + e.data.usedata.data.usedata.NodeFullTag,
														dataType: "json",
														context: this,
														success: function (result) {
															var idx = result.OPCValueMap[this.id];
															if (idx != undefined) {
																var valInfo = result.OPCValueList[idx];
																valInfo.selDate = new Date();
																valInfo.selDate.setHours(0, 0, 0, 0);
																if (valInfo.DataUnit == "无")
																	valInfo.DataUnit = "";
																$('#psv-marker-' + e.data.usedata.id).html('<div class="label"><div class="chevron"><span style="float:left;">' + valInfo.ValueName + (valInfo.DataUnit == "" ? '' : ('【' + valInfo.DataUnit + '】')) + '</span><span style="float:right;"><i class="fa fa-chevron-left"></i>&nbsp;&nbsp;<em>' + valInfo.selDate.Format('yyyy-MM-dd') + '，第' + valInfo.selDate.getWeekOfYear(0) + '周</em>&nbsp;&nbsp;<i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<i class="fa fa-times-circle"></i>&nbsp;</span><div class="psv-chart"></div></div><span class="pointer"></span></div>');
																//
																$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-left").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, NodeID: e.data.usedata.data.usedata.NodeID, NodeTag: e.data.usedata.data.usedata.NodeTag, valInfo: valInfo }, function (e) {
																	valInfo.selDate = valInfo.selDate.DateAdd("w", -1);
																	$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd') + '，第' + valInfo.selDate.getWeekOfYear(0) + '周');
																   TUI.env.mobile.loadChartGant(e.data.NodeID, e.data.NodeTag, e.data.valInfo);
																	return false;
																});
																//
																$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-right").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, NodeID: e.data.usedata.data.usedata.NodeID, NodeTag: e.data.usedata.data.usedata.NodeTag, valInfo: valInfo }, function (e) {
																	valInfo.selDate = valInfo.selDate.DateAdd("w", 1);
																	$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd') + '，第' + valInfo.selDate.getWeekOfYear(0) + '周');
																   TUI.env.mobile.loadChartGant(e.data.NodeID, e.data.NodeTag, e.data.valInfo);
																	return false;
																});
																//
																$('#psv-marker-' + e.data.usedata.id).find(".fa-times-circle").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id }, function (e) {
																	$('#psv-marker-' + e.data.id).empty();
																	return false;
																});
																//
															   TUI.env.mobile.loadChartGant(e.data.usedata.data.usedata.NodeID, e.data.usedata.data.usedata.NodeTag, valInfo);
															}
														}
													});
													return false;
												});
											};
										   TUI.env.mobile.myAppMap.mdySceneAR(this.data.markers[j]);
										}
									}
									//
									if (result.OPCNodeList[i].Longitude != 0 || result.OPCNodeList[i].Latitude != 0) {
										var marker = {
											"id": result.OPCNodeList[i].NodeID,
											"data": {
												"color": result.OPCNodeList[i].OnLineFlag ? "green" : "red",
												"url": "/Project/PCPS/srv/webvr/getNodePannel.ejs?fullTag=" + result.OPCNodeList[i].NodeFullTag + "&TagName=" + encodeURIComponent(result.OPCNodeList[i].NodeName),
												"usedata": result.OPCNodeList[i],
												"fn": function (psv, config, pannel) {
													pannel.find('.make-switch').bootstrapSwitch();
													pannel.find('.btn').on(TUI.env.ua.clickEventUp, { handle: psv, usedata: config }, function (e) {
														if (this.id == "save") {
															vlist = [];
															for (var i = 0; i < e.data.usedata.data.usedata.ObjectAttr.length; i++) {
																switch (e.data.usedata.data.usedata.ObjectAttr[i].AttrType) {
																	case "text":	//纯文本
																		{
																			vlist[vlist.length] = {
																				AttrType: 0,
																				AttrTag: e.data.usedata.data.usedata.ObjectAttr[i].AttrTag,
																				AttrValue: $('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID).prop("value"),
																				EnumKey: (e.data.usedata.data.usedata.ObjectAttr[i].EnumFlag ? $('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID + ' option:selected').text() : "")
																			};
																		}
																		break;
																	case "float":	//浮点型数字
																		{
																			vlist[vlist.length] = {
																				AttrType: 2,
																				AttrTag: e.data.usedata.data.usedata.ObjectAttr[i].AttrTag,
																				AttrValue: parseFloat($('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID).prop("value")),
																				EnumKey: (e.data.usedata.data.usedata.ObjectAttr[i].EnumFlag ? $('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID + ' option:selected').text() : "")
																			};
																		}
																		break;
																	case "int":	//整型数字
																		{
																			vlist[vlist.length] = {
																				AttrType: 3,
																				AttrTag: e.data.usedata.data.usedata.ObjectAttr[i].AttrTag,
																				AttrValue: parseInt($('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID).prop("value")),
																				EnumKey: (e.data.usedata.data.usedata.ObjectAttr[i].EnumFlag ? $('#' + e.data.usedata.data.usedata.ObjectAttr[i].AttrID + ' option:selected').text() : "")
																			};
																		}
																		break;
																	case "bool":	//布尔型数字
																		{
																			vlist[vlist.length] = {
																				AttrType: 4,
																				AttrTag: e.data.usedata.data.usedata.ObjectAttr[i].AttrTag,
																				AttrValue: $("#" + e.data.usedata.data.usedata.ObjectAttr[i].AttrID).bootstrapSwitch("state"),
																				EnumKey: ""
																			};
																		}
																		break;
																}
															}
															$.ajax({
																url: "/Project/PCPS/srv/webvr/setAttrValue.ejs",
																data: { OpcPath: e.data.usedata.data.usedata.NodeFullTag, vlist: TUI.JSON.encode(vlist) },
																type: "POST",
																dataType: "json",
																context: this,
																error: function () {
																},
																success: function (result) {
																	if (!result.flag) {
																		toastr["warning"](result.info, "智能设备属性设置");
																		return;
																	}
																	$(".btn-group-justified").hide();
																}
															});
														}
														else if (this.id == "cancel") {
														   TUI.env.mobile.refreshSceneAR(e.data.handle, e.data.usedata);
														}
														else if (this.id == "edit") {
															$(".stethoscope").hide();
															$(".product").hide();
															$(".device").show();
															$(".btn-group-justified").show();
														}
														else if (this.id == "refresh") {
															$(".stethoscope").hide();
															$(".product").hide();
															$(".device").show();
															//
															$.ajax({
																url: "/Project/PCPS/srv/webvr/readMonitValue.ejs",
																data: { OpcPath: e.data.usedata.data.usedata.NodeFullTag },
																type: "POST",
																dataType: "json",
																context: this,
																error: function () {
																},
																success: function (result) {
																	if (!result.flag) {
																		toastr["warning"](result.info, "智能设备即抄");
																	}
																}
															});
															//
															TUI.Comet.OnClose();
															TUI.Comet.AddOPCSrv(e.data.usedata.data.usedata.NodeFullTag,TUI.env.mobile.refreshSceneAR(e.data.handle, e.data.usedata));
															TUI.Comet.OnListen();
														}
														else if (this.id == "info") {
															$(".stethoscope").hide();
															$(".product").show();
															$(".device").hide();
														}
														else if (this.id == "stethoscope") {
															$(".stethoscope").show();
															$(".product").hide();
															$(".device").hide();
														}
														else if (this.id == "record") {
															var NodeRecordInfo = $('#NodeRecordInfo').prop("value");
															if (NodeRecordInfo == "") {
																toastr["warning"]("必须输入点检设备状态描述信息", "人工设备点检");
																return;
															}
															//
															$.ajax({
																type: 'post',
																url: "srv/Inspect/pushNodeRecode.ejs",
																data: { NodeFullName: e.data.usedata.data.usedata.NodeFullName, NodeFullTag: e.data.usedata.data.usedata.NodeFullTag, NodeID: e.data.usedata.data.usedata.NodeID, RecordStatus: $('#NodeRecordStatus').prop("value"), NodeRecordInfo: NodeRecordInfo },
																dataType: "json",
																context: e.data.handle,
																error: function (result) {
																	alert("远程服务故障，请检查网络或稍后再试！");
																},
																success: function (result) {
																	if (result.flag) {
																		$('#NodeRecordInfo').val("");
																		var status = ['success', 'info', 'warning', 'danger', 'danger'];
																		$(".stethoscope").append('<div class="alert alert-block alert-' + status[result.data.RecordStatus] + ' fade in">'
																					+ '		<h4 class="alert-heading"><span style="float:left;">' + result.data.RecordName + '</span><span style="float:right;">' + TUI.Utils.dateMessage(result.data.RecordTime) + '</span></h4>'
																					+ '		<br><p style="font-size:10.5pt;">' + result.data.RecordInfo + '</p>'
																					+ '</div>');
																		toastr["success"]("提交设备点检记录成功！", "人工设备点检");
																	}
																}
															});
														}
														else {
															$.ajax({
																type: 'post',
																url: "/Project/PCPS/srv/webvr/pushActionTask.ejs",
																data: { OPCFilter: e.data.usedata.data.usedata.NodeFullTag, RuleID: this.id },
																dataType: "json",
																context: e.data.handle,
																error: function (result) {
																	alert("远程服务故障，请检查网络或稍后再试！");
																},
																success: function (result) {
																	toastr["success"]("发送远程控制指令成功，控制状态可查询控制中心！", "远程控制服务");
																}
															});
														}
														return false;
													});
													//
													pannel.find('.chart-bar').on(TUI.env.ua.clickEventUp, { handle: psv, usedata: config }, function (e) {
														var idx = e.data.usedata.data.usedata.OPCValueMap[this.id];
														if (idx != undefined) {
															var valInfo = e.data.usedata.data.usedata.OPCValueList[idx];
															valInfo.selDate = new Date();
															valInfo.selDate.setHours(0, 0, 0, 0);
															if (valInfo.DataUnit == "无")
																valInfo.DataUnit = "";
															$('#psv-marker-' + e.data.usedata.id).html('<div class="label"><div class="chevron"><span style="float:left;">' + valInfo.ValueName + (valInfo.DataUnit == "" ? '' : ('【' + valInfo.DataUnit + '】')) + '</span><span style="float:right;"><i class="fa fa-chevron-left"></i>&nbsp;&nbsp;<em>' + valInfo.selDate.Format('yyyy-MM-dd') + '</em>&nbsp;&nbsp;<i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<i class="fa fa-times-circle"></i>&nbsp;</span><div class="psv-chart"></div></div><span class="pointer"></span></div>');
															//
															$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-left").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, NodeID: e.data.usedata.data.usedata.NodeID, valInfo: valInfo }, function (e) {
																valInfo.selDate = valInfo.selDate.DateAdd("d", -3);
																$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd'));
															   TUI.env.mobile.loadChartBar(e.data.id, e.data.NodeID, e.data.valInfo);
																return false;
															});
															//
															$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-right").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, NodeID: e.data.usedata.data.usedata.NodeID, valInfo: valInfo }, function (e) {
																valInfo.selDate = valInfo.selDate.DateAdd("d", 3);
																$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd'));
															   TUI.env.mobile.loadChartBar(e.data.id, e.data.NodeID, e.data.valInfo);
																return false;
															});
															//
															$('#psv-marker-' + e.data.usedata.id).find(".fa-times-circle").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id }, function (e) {
																$('#psv-marker-' + e.data.id).empty();
																return false;
															});
															//
														   TUI.env.mobile.loadChartBar(e.data.usedata.id, e.data.usedata.data.usedata.NodeID, valInfo);
														}
														return false;
													});
													//
													pannel.find('.chart-line').on(TUI.env.ua.clickEventUp, { handle: psv, usedata: config }, function (e) {
														var idx = e.data.usedata.data.usedata.OPCValueMap[this.id];
														if (idx != undefined) {
															var valInfo = e.data.usedata.data.usedata.OPCValueList[idx];
															valInfo.selDate = new Date();
															valInfo.selDate.setHours(0, 0, 0, 0);
															if (valInfo.DataUnit == "无")
																valInfo.DataUnit = "";
															$('#psv-marker-' + e.data.usedata.id).html('<div class="label"><div class="chevron"><span style="float:left;">' + valInfo.ValueName + (valInfo.DataUnit == "" ? '' : ('【' + valInfo.DataUnit + '】')) + '</span><span style="float:right;"><i class="fa fa-chevron-left"></i>&nbsp;&nbsp;<em>' + valInfo.selDate.Format('yyyy-MM-dd') + '</em>&nbsp;&nbsp;<i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<i class="fa fa-times-circle"></i>&nbsp;</span><div class="psv-chart"></div></div><span class="pointer"></span></div>');
															//
															$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-left").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, nodePath: e.data.usedata.data.usedata.NodeFullTag, valInfo: valInfo }, function (e) {
																valInfo.selDate = valInfo.selDate.DateAdd("d", -3);
																$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd'));
															   TUI.env.mobile.loadChartLine(e.data.id, e.data.nodePath, e.data.valInfo);
																return false;
															});
															//
															$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-right").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, nodePath: e.data.usedata.data.usedata.NodeFullTag, valInfo: valInfo }, function (e) {
																valInfo.selDate = valInfo.selDate.DateAdd("d", 3);
																$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd'));
															   TUI.env.mobile.loadChartLine(e.data.id, e.data.nodePath, e.data.valInfo);
																return false;
															});
															//
															$('#psv-marker-' + e.data.usedata.id).find(".fa-times-circle").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id }, function (e) {
																$('#psv-marker-' + e.data.id).empty();
																return false;
															});
															//
														   TUI.env.mobile.loadChartLine(e.data.usedata.id, e.data.usedata.data.usedata.NodeFullTag, valInfo);
														}
														return false;
													});
													//
													pannel.find('.chart-gant').on(TUI.env.ua.clickEventUp, { handle: psv, usedata: config }, function (e) {
														var idx = e.data.usedata.data.usedata.OPCValueMap[this.id];
														if (idx != undefined) {
															var valInfo = e.data.usedata.data.usedata.OPCValueList[idx];
															valInfo.selDate = new Date();
															valInfo.selDate.setHours(0, 0, 0, 0);
															if (valInfo.DataUnit == "无")
																valInfo.DataUnit = "";
															$('#psv-marker-' + e.data.usedata.id).html('<div class="label"><div class="chevron"><span style="float:left;">' + valInfo.ValueName + (valInfo.DataUnit == "" ? '' : ('【' + valInfo.DataUnit + '】')) + '</span><span style="float:right;"><i class="fa fa-chevron-left"></i>&nbsp;&nbsp;<em>' + valInfo.selDate.Format('yyyy-MM-dd') + '，第' + valInfo.selDate.getWeekOfYear(0) + '周</em>&nbsp;&nbsp;<i class="fa fa-chevron-right"></i>&nbsp;&nbsp;<i class="fa fa-times-circle"></i>&nbsp;</span><div class="psv-chart"></div></div><span class="pointer"></span></div>');
															//
															$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-left").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, nodePath: e.data.usedata.data.usedata.NodeFullTag, valInfo: valInfo }, function (e) {
																valInfo.selDate = valInfo.selDate.DateAdd("w", -1);
																$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd') + '，第' + valInfo.selDate.getWeekOfYear(0) + '周');
															   TUI.env.mobile.loadChartGant(e.data.id, e.data.nodePath, e.data.valInfo);
																return false;
															});
															//
															$('#psv-marker-' + e.data.usedata.id).find(".fa-chevron-right").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id, nodePath: e.data.usedata.data.usedata.NodeFullTag, valInfo: valInfo }, function (e) {
																valInfo.selDate = valInfo.selDate.DateAdd("w", 1);
																$('#psv-marker-' + e.data.id).find("em").html(valInfo.selDate.Format('yyyy-MM-dd') + '，第' + valInfo.selDate.getWeekOfYear(0) + '周');
															   TUI.env.mobile.loadChartGant(e.data.id, e.data.nodePath, e.data.valInfo);
																return false;
															});
															//
															$('#psv-marker-' + e.data.usedata.id).find(".fa-times-circle").bind(TUI.env.ua.clickEventDown, { handle: this, id: e.data.usedata.id }, function (e) {
																$('#psv-marker-' + e.data.id).empty();
																return false;
															});
															//
														   TUI.env.mobile.loadChartGant(e.data.usedata.id, e.data.usedata.data.usedata.NodeFullTag, valInfo);
														}
														return false;
													});
												}
											},
											"longitude": result.OPCNodeList[i].Longitude,
											"latitude": result.OPCNodeList[i].Latitude,
											"tooltip": {
												"content": result.OPCNodeList[i].NodeName,
												"position": "center right"
											}
										};
										this.data.markers.push(marker);
									   TUI.env.mobile.myAppMap.addSceneAR(marker, true);
									}
								}
							}
						}
					});
				}
			});

			//
			$('#tab_main').find('.back').bind(TUI.env.ua.clickEventUp, { handle: this,config:node}, function (e) {
				TUI.env.mobile.openSubStation(e.data.config);
				
				return false;
			});
		},
		updateSceneAR: function () {
			if (TUI.env.mobile.SceneConfig != undefined) {
				if (TUI.env.mobile.SceneConfig.data.tag == "#") {
					TUI.env.mobile.SceneConfig = undefined;
					window.clearInterval(TUI.env.mobile.sceneTime);
					return;
				}
				//
				$.ajax({
					type: 'get',
					url: "/API/System/PCPS/Facility/" + TUI.env.mobile.SceneConfig.data.tag.split(".").join("/"),
					dataType: "json",
					context: TUI.env.mobile.SceneConfig,
					error: function (result) {
					},
					success: function (result) {
						if (result.OPCNodeList != undefined) {
							for (var i = 0; i < result.OPCNodeList.length; i++) {
								for (var j = 0; j < this.data.markers.length; j++) {
									if (this.data.markers[j].data != undefined
										&& this.data.markers[j].data.valuePath != undefined
										&& this.data.markers[j].data.valuePath != ""
										&& this.data.markers[j].data.valuePath == result.OPCNodeList[i].NodeFullTag
										&& this.data.markers[j].data.valueTag != undefined
										&& this.data.markers[j].data.valueTag != "") {
										var dataValue = result.OPCNodeList[i].OPCValueList[result.OPCNodeList[i].OPCValueMap[this.data.markers[j].data.valueTag]].DataValue;
										var imgIdx = parseInt((dataValue - this.data.markers[j].data.valueRange[0]) * (this.data.markers[j].data.valueImg.length - 1) / (this.data.markers[j].data.valueRange[1] - this.data.markers[j].data.valueRange[0]));
										if (dataValue <= this.data.markers[j].data.valueRange[0])
											imgIdx = 0;
										if (dataValue >= this.data.markers[j].data.valueRange[1])
											imgIdx = this.data.markers[j].data.valueImg.length - 1;
										this.data.markers[j].image = '/API/Map/VR/' + this.data.markers[j].data.valueImg[imgIdx];
										TUI.env.mobile.myAppMap.mdySceneAR(this.data.markers[j]);
									}
									else if (this.data.markers[j].id == result.OPCNodeList[i].NodeID) {
										this.data.markers[j].data.color = result.OPCNodeList[i].OnLineFlag ? "green" : "red";
										TUI.env.mobile.myAppMap.mdySceneAR(this.data.markers[j]);
									}
								}
							}
						}
						//
						for (var j = 0; j < this.data.markers.length; j++) {
							if (this.data.markers[j].data.type == "svg") {
								this.data.markers[j].data.usedata = result;
								TUI.env.mobile.myAppMap.mdySceneAR(this.data.markers[j]);
							}
						}
					}
				});
			}
		},
		refreshSceneAR: function (psv, config) {
			psv.marker = config;
			TUI.Comet.OnClose();
			//
			$.ajax({
				type: 'get',
				url: config.data.url,
				dataType: "html",
				context: psv,
				success: function (result) {
					this.showPanel(result);
					//
					if (typeof this.marker.data.fn == "function") {
						this.marker.data.fn(this, this.marker, $(this.panel.content));
					}
				}
			});
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
				window.location.href="/API/My/Login/?goto="+escape("/Webapp/WeiCenter/Mobile/Inspection/");
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