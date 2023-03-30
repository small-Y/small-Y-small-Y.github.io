var maxid=0;
var AppCalendar = function() {
    return {
        //main function to initiate the module
        init: function() {
            this.initCalendar();
        },

        initCalendar: function() {

            if (!jQuery().fullCalendar) {
                return;
            }

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var h = {
                        left: 'title',
                        center: '',
                        right: 'prev,next,today,month,agendaWeek,agendaDay'
                    };

            var initDrag = function(el) {
                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim(el.text()) // use the element's text as the event title
                };
                // store the Event Object in the DOM element so we can get to it later
                el.data('eventObject', eventObject);
                // make the event draggable using jQuery UI
                el.draggable({
                    zIndex: 999,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0 //  original position after the drag
                });
            };

            var addEvent = function(title) {
				if(title.length==0)
					return;

                var html = $('<div class="external-event label label-default">' + title + '</div>');
                jQuery('#event_box').append(html);
                initDrag(html);
            };

            $('#external-events div.external-event').each(function() {
                initDrag($(this));
            });

            $('#event_add').unbind('click').click(function() {
                var title = $('#event_title').val();
				AppCalendar.myEvent[AppCalendar.myEvent.length]=title;
				localStorage["myEventData"]=TUI.JSON.encode(AppCalendar.myEvent);
                addEvent(title);
            });

            //predefined events
            $('#event_box').html("");
			//
			this.myEvent=[];
			var eventData = localStorage["myEventData"];
			if (eventData != null) {
				this.myEvent = TUI.JSON.decode(eventData);
			}
			else
			{
				this.myEvent[this.myEvent.length]="周例会";
				this.myEvent[this.myEvent.length]="月计划";
				this.myEvent[this.myEvent.length]="会议";
				localStorage["myEventData"]=TUI.JSON.encode(this.myEvent);
			}
			//
			for(var i=0;i<this.myEvent.length;i++)
			{
				addEvent(this.myEvent[i]);
			}

			$.ajax({
					type: 'GET',
					url: "/API/Calendar?startTime="+(new Date).Format("yyyy-01-01")+"&endTime="+(new Date).Format("yyyy-12-31"),
					dataType: "json",
					context:this,
					error: function (result) {
						alert("远程服务故障，请检查网络或稍后再试！");
					},
					success: function (result) {
						if(!result.flag)
						{
							toastr["error"](result.info,"添加日历事件失败");
							return;
						}
						//
						var colors=['yellow','green','red','grey','purple'];
						var events=[];
						for(var i=0;i<result.data.length;i++)
						{
							events[i]={
								eventid:result.data[i].id,
								title: result.data[i].title,
								content: result.data[i].content,
								allDay:result.data[i].allDay,
								start: TUI.Utils.parseDate(result.data[i].time),
								end: TUI.Utils.parseDate(result.data[i].end),
								backgroundColor: App.getBrandColor(colors[i%5])
							};
							//
							if(result.data[i].id>maxid)
								maxid=result.data[i].id;
						}
						//
						$('#calendar').fullCalendar('destroy'); // destroy the calendar
						$('#calendar').fullCalendar({ //re-initialize the calendar
							header: h,
							lang: 'zh-cn',
							defaultView: 'month', // change default view with available options from http://arshaw.com/fullcalendar/docs/views/Available_Views/ 
							slotMinutes: 15,
							editable: true,
							eventLimit: true,
							droppable: true, // this allows things to be dropped onto the calendar !!!
							drop: function(date, allDay) { // this function is called when something is dropped
								var originalEventObject = $(this).data('eventObject');
								// we need to copy it, so that multiple events don't have a reference to the same object
								var copiedEventObject = $.extend({}, originalEventObject);

								// assign it the date that was reported
								maxid++;
								copiedEventObject.eventid=maxid;
								copiedEventObject.start = date;
								copiedEventObject.content = originalEventObject.title;
								//copiedEventObject.allDay = allDay;
								copiedEventObject.className = $(this).attr("data-class");

								// render the event on the calendar
								// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
								$('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

								// is the "remove after drop" checkbox checked?
								if ($('#drop-remove').is(':checked')) {
									// if so, remove the element from the "Draggable Events" list
									$(this).remove();
									//
									for(var i=0;i<AppCalendar.myEvent.length;i++)
									{
										if(AppCalendar.myEvent[i]==originalEventObject.title)
										{
											AppCalendar.myEvent.splice(i,1);
											break;
										}
									}
									localStorage["myEventData"]=TUI.JSON.encode(AppCalendar.myEvent);
								}
								//
								$.ajax({
											type: 'PUT',
											url: "/API/Calendar",
											data: {
													title:originalEventObject.title,
													content:originalEventObject.title,
													allDay:true,
													start:date.format("YYYY-MM-DD HH:mm:ss")
											},
											dataType: "json",
											context:this,
											error: function (result) {
												alert("远程服务故障，请检查网络或稍后再试！");
											},
											success: function (result) {
												if(!result.flag)
												{
													toastr["error"](result.info,"添加日历事件失败");
													return;
												}
											}
									});
							},
							eventResize: function(event, delta, revertFunc) {
								if(event.end==null)
								{
									$.ajax({
											type: 'POST',
											url: "/API/Calendar",
											data: {
													id:event.eventid,
													title:event.title,
													content:event.content,
													allDay:event.allDay,
													start:event.start.format("YYYY-MM-DD HH:mm:ss")
											},
											dataType: "json",
											context:this,
											error: function (result) {
												alert("远程服务故障，请检查网络或稍后再试！");
											},
											success: function (result) {
												if(!result.flag)
												{
													toastr["error"](result.info,"修改日历事件失败");
													return;
												}
											}
									});
								}
								else
								{
									$.ajax({
											type: 'POST',
											url: "/API/Calendar",
											data: {
													id:event.eventid,
													title:event.title,
													content:event.content,
													allDay:event.allDay,
													start:event.start.format("YYYY-MM-DD HH:mm:ss"),
													end:event.end.format("YYYY-MM-DD HH:mm:ss")
											},
											dataType: "json",
											context:this,
											error: function (result) {
												alert("远程服务故障，请检查网络或稍后再试！");
											},
											success: function (result) {
												if(!result.flag)
												{
													toastr["error"](result.info,"修改日历事件失败");
													return;
												}
											}
									});
								}
							},
							eventDrop: function(event, delta, revertFunc) {
								if(event.end==null)
								{
									$.ajax({
											type: 'POST',
											url: "/API/Calendar",
											data: {
													id:event.eventid,
													title:event.title,
													content:event.content,
													allDay:event.allDay,
													start:event.start.format("YYYY-MM-DD HH:mm:ss")
											},
											dataType: "json",
											context:this,
											error: function (result) {
												alert("远程服务故障，请检查网络或稍后再试！");
											},
											success: function (result) {
												if(!result.flag)
												{
													toastr["error"](result.info,"修改日历事件失败");
													return;
												}
											}
									});
								}
								else
								{
									$.ajax({
											type: 'POST',
											url: "/API/Calendar",
											data: {
													id:event.eventid,
													title:event.title,
													content:event.content,
													allDay:event.allDay,
													start:event.start.format("YYYY-MM-DD HH:mm:ss"),
													end:event.end.format("YYYY-MM-DD HH:mm:ss")
											},
											dataType: "json",
											context:this,
											error: function (result) {
												alert("远程服务故障，请检查网络或稍后再试！");
											},
											success: function (result) {
												if(!result.flag)
												{
													toastr["error"](result.info,"修改日历事件失败");
													return;
												}
											}
									});
								}
							},
							events:events
						});
					}
			});
        }
    };
}();

jQuery(document).ready(function() {    
   AppCalendar.init(); 
   //
   $("#startingCover").remove();
   $("#mainFrame").show();
});