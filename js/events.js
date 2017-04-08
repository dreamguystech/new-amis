$(document).ready(function(e) {
	$(".loading-mask").css('opacity','0.5');
	 var dataString = "user_id="+window.localStorage.getItem("user_id");
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_newapp/events_list',
        type:'POST',
        data:dataString,
        dataType:'json',
        success:function(data){
			$(".loading-mask").css('opacity','0');
            $('.eventsli ul').empty().append(data.totev);
        }
    });
	
	if($(".navbar-title").html() == ''){
		
	}
});

$(document).on('click','.eventsli a',function(){
	window.localStorage.setItem("event-name", $(this).find('.event-title').html());
	window.localStorage.setItem("event-id", $(this).attr('data-id'));
	location.href= "events-view.html";
});