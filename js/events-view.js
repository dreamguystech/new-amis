
$(document).ready(function(e) {
	// var dataString = "user_id="+window.localStorage.getItem("user_id");
  
	
	if($(".navbar-title").html() == ''){
		$(".navbar-title").html(window.localStorage.getItem("event-name"));
	}
	var dataString = "user_id="+window.localStorage.getItem("user_id")+"&id="+window.localStorage.getItem("event-id");
    $('#details_event').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_newapp/event_details',
        type:'POST',
        data:dataString,
		dataType:'json',
        success:function(data){ 
			loadmeetings();
			$('.w-tab-pane[data-w-tab="Tab 1"]').empty().append(data.details);
			
			var chartimg = '<div class="text-new" ><img src="'+data.chart+'" data-elem="pinchzoomer"></div>';
			
			if(data.cchart.length > 0){
				chartimg += '<div class="w-row"><h2 class="title-new">Child Chart</h2>';
				for(var i=0;i<data.cchart.length;i++){
				chartimg += '<div class="text-new"><img src="'+data.cchart[i]+'" data-elem="pinchzoomer"></div><div class="separator-button"></div>';
				}
			}
			  $('.w-tab-pane[data-w-tab="Tab 2"]').empty().css('display','block').append(chartimg).css('opacity',0);  
			  $('.w-tab-pane[data-w-tab="Tab 2"] img').pinchzoomer(); 
			  $('.w-tab-pane[data-w-tab="Tab 4"]').empty().append('<div class="separator-bottom"></div>'+data.task);
			  $('.w-tab-pane[data-w-tab="Tab 5"]').empty().append(data.edocs);       
        }
    });
	
});
var handleTouchyPinch = function (e, $target, data) { 
    $target.css({'webkitTransform':'scale(' + data.scale + ',' + data.scale + ')'});
};
$('#my_div').bind('touchy-pinch', handleTouchyPinch);
$(document).on('click','.eventsli a',function(){
	window.localStorage.setItem("event-name", $(this).find('.event-title').html());
	window.localStorage.setItem("event-id", $(this).attr('data-id'));
	location.href= "events-view.html";
});

function loadmeetings(){
	var dataString = "user_id="+window.localStorage.getItem("user_id")+"&event_id="+window.localStorage.getItem("event-id");
	$.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_newapp/get_meetings',
        type:'POST',
        data:dataString,
		dataType:'json',
        success:function(data){  
			//$('.w-tab-pane[data-w-tab="Tab 2"]').css('display','none')
			$('.w-tab-pane[data-w-tab="Tab 3"] ul').empty().append(data.totev);
			for(var i=0;i<data.mid.length;i++){
				//$("#meeting-view").append(data.agenta[i]);
				
				$("#meeting-view").append('<div class="w-tab-content tabs-content" id="meeting_'+data.mid[i]+'" style="display:none;"><div class="w-tab-pane w-clearfix tab-pane" data-w-tab="Tab 11">'+data.agenta[data.mid[i]]+'</div><div class="w-tab-pane w--tab-active tab-pane" data-w-tab="Tab 22" >'+data.minutes[data.mid[i]]+data.meeting[data.mid[i]]+'<div class="separator-button"></div></div><div class="w-tab-pane w-clearfix tab-pane" data-w-tab="Tab 33"><ul class="list"></ul></div><div class="w-tab-pane w-clearfix tab-pane" data-w-tab="Tab 44">'+data.action[data.mid[i]]+'</div><div class="w-tab-pane w-clearfix tab-pane" data-w-tab="Tab 55">'+data.meetingdoc[data.mid[i]]+'</div></div>');
			}
	

        }
    });	
}

$(document).on('click','.w-tab-link[data-w-tab]',function(){
	if($(this).attr('data-w-tab') == "Tab 2")
	$('.w-tab-pane[data-w-tab="Tab 2"]').css('display','block');
	else
	$('.w-tab-pane[data-w-tab="Tab 2"]').css('display','none');
});

$(document).on('click','.w-tab-pane[data-w-tab="Tab 3"] ul a',function(){ 
	$(".grey-header:first").find('.title-new').empty().append($(this).find('.event-title').html());
	$(".grey-header:first").show();
	$("#meeting-view .w-tab-menu a").each(function(index, element) {
		$(this).removeClass('w--current');
    });
	$("#meeting-view .w-tab-menu a:first").addClass('w--current');
	$("#tab-meeting").hide();$("#meeting-view").show();	
	$("#meeting-view .w-tab-content").hide();
	$("#meeting_"+$(this).attr('data-id')).show();
	$("#meeting_"+$(this).attr('data-id')).find('div').each(function(index, element) {
		$(this).removeClass('.w--tab-active');
    });
	$("#meeting_"+$(this).attr('data-id')).children('div').removeClass('w--tab-active');
	$("#meeting_"+$(this).attr('data-id')).children('div:first').addClass('w--tab-active');
});

$(document).on('click','.grey-header a',function(){ 
	$(".grey-header:first").hide();
	$("#tab-meeting").show();
	$("#meeting-view").hide();
});

$(document).on('click','a[data-mid]',function(){ 
	$(this).parent().parent().parent().hide();
	$("#meet_view_"+$(this).attr('data-mid')).show();
});

$(document).on('click','.meeting_list a',function(){
	$(this).parent().parent().hide();
	$(this).parent().parent().parent().find('div.text-new').show();
});