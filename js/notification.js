$(document).ready(function(e) {
	$(".loading-mask").css('opacity','0.5');
	setTimeout(function(){$(".loading-mask").css('opacity','0');},1000);
	
	var dataString = "user_id="+window.localStorage.getItem("user_id");
    $('#details_event').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_newapp/tab_contacts',
        type:'POST',
        data:dataString,
		dataType:'json',
        success:function(data){ 
			loadmessage();
			$('.w-tab-pane[data-w-tab="Tab 1"] #inbox_list').empty().append(data.inbox_list+data.inbox_view);
			  $('.w-tab-pane[data-w-tab="Tab 2"] #cont_list').empty().append(data.hist_list+data.hist_view);
			  $('.w-tab-pane[data-w-tab="Tab 2"] #cont_view').empty().append(data.hist_view);
			  $('.w-tab-pane[data-w-tab="Tab 2"] #dft_list').empty().append('<div class="w-col w-col-tiny-12 n-p-l"><a style="float: left;" class="w-inline-block small-button icon-only grey" href="#"><div class="icon ion-ios-arrow-left bigger icon-button"></div></a><div class="title-new" style="">Draft</div></div>'+data.drt_list);
			  $("#region").append(data.region);
			 // $('.w-tab-pane[data-w-tab="Tab 4"]').empty().append('<div class="separator-bottom"></div>'+data.task);
			 // $('.w-tab-pane[data-w-tab="Tab 5"]').empty().append(data.edocs);       
        }
    });
	
	
	 var fname    = $("#first-name");
	 var surname = $("#surname");
	 var mobile = $("#mobile");
	 var email = $("#email");
	 	
	email.blur(validateEmail);	
	fname.blur(validateFname);
	surname.blur(validateSurname);
	mobile.blur(validateMobile);
	email.keyup(validateEmail);	
	fname.keyup(validateFname);
	surname.keyup(validateSurname);
	mobile.keyup(validateMobile);
	
	$('#cont-form').submit(function(){
		 var btn = $(this).find("input[type=submit]:focus" ).val();
		if($(this).find("input[type=submit]:focus" ).val() == "Save"){
			
			if(validateEmail() & validateFname() & validateSurname() & validateMobile())
				{  $(".loading-mask").css('opacity','0.5');
					$.post('http://amisapp.ansarullah.co.uk/mobile_newapp/create_contact',
					{fname:$("#first-name").val(),mname:$("#middle-nam").val(),sname:$("#surname").val(),mobile:$("#mobile").val(),mail:$("#email").val(),flat:$("#flat").val(),house:$("#house").val(),street:$("#street").val(),locality:$("#locality").val(),town:$("#town").val(),pin:$("#postcode").val(),sts:1,user_id:window.localStorage.getItem("user_id"),con_id:$("#dr_id").val()},
					function(data){
						$(".loading-mask").css('opacity','0');
						if(data.response == 1){
							$('body').append('<div class="w-lightbox-backdrop" tabindex="0" style="transition: opacity 300ms ease 0s; opacity: 1;"><div class="w-lightbox-view" style="transform: translateX(0px); transition: opacity 300ms ease 0s, transform 300ms ease 0s; opacity: 1;"><div class="w-lightbox-frame">Contact already exists</div></div></div>');
						}else
						{
							$('body').append('<div class="w-lightbox-backdrop" tabindex="0" style="transition: opacity 300ms ease 0s; opacity: 1;"><div class="w-lightbox-view" style="transform: translateX(0px); transition: opacity 300ms ease 0s, transform 300ms ease 0s; opacity: 1;"><div class="w-lightbox-frame">Contact saved successfully</div></div></div>');
							$('.w-tab-pane[data-w-tab="Tab 2"]').children('div').hide();
							$('.w-tab-pane[data-w-tab="Tab 2"]').children('div:first').show();
							$("#cont_list").show();
						}
						setTimeout(function(){$(".w-lightbox-backdrop").remove();},2000);
						},"json");
				}
		}else{
			$(".loading-mask").css('opacity','0.5');
			$.post('http://amisapp.ansarullah.co.uk/mobile_newapp/create_contact',
					{fname:$("#first-name").val(),mname:$("#middle-nam").val(),sname:$("#surname").val(),mobile:$("#mobile").val(),mail:$("#email").val(),flat:$("#flat").val(),house:$("#house").val(),street:$("#street").val(),locality:$("#locality").val(),town:$("#town").val(),pin:$("#postcode").val(),sts:2,user_id:window.localStorage.getItem("user_id"),con_id:$("#dr_id").val()},
					function(data){
						$(".loading-mask").css('opacity','0');
						if(data.response == 1){
							$('body').append('<div class="w-lightbox-backdrop" tabindex="0" style="transition: opacity 300ms ease 0s; opacity: 1;"><div class="w-lightbox-view" style="transform: translateX(0px); transition: opacity 300ms ease 0s, transform 300ms ease 0s; opacity: 1;"><div class="w-lightbox-frame">Contact already exists</div></div></div>');
							
						}else
						{
							$('body').append('<div class="w-lightbox-backdrop" tabindex="0" style="transition: opacity 300ms ease 0s; opacity: 1;"><div class="w-lightbox-view" style="transform: translateX(0px); transition: opacity 300ms ease 0s, transform 300ms ease 0s; opacity: 1;"><div class="w-lightbox-frame">Contact saved successfully</div></div></div>');
							$('.w-tab-pane[data-w-tab="Tab 2"]').children('div').hide();
							$("#dft_list").show();
						}
						setTimeout(function(){$(".w-lightbox-backdrop").remove();},2000);
						},"json");
		}
		 return false;
	});
	
	function validateEmail(){
		
		var a = $("#email").val();
			var filter = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
			if(a == "")
			{
				$("html, body").animate({ scrollTop: 100 }, 600);
				$('#email').addClass("error");
				return false;
			}else
			{
				if(filter.test(a)){
					$("#email").removeClass("error");
					return true;
				}
				else{
					$('#email').addClass("error");
					return false;
				}
			}
	}
	function validateFname(){
		if($("#first-name").val() == "")
			{ 
				$("html, body").animate({ scrollTop: 100 }, 600);
				$("#first-name").addClass("error");
				return false;
			}
			$("#first-name").removeClass("error");
				return true;
	}
	function validateSurname(){
		if($("#surname").val() == "")
			{
				$("html, body").animate({ scrollTop: 100 }, 600);
				$("#surname").addClass("error");
				return false;
			}
			$("#surname").removeClass("error");
				return true;
	}
	function validateMobile(){
		if($("#mobile").val() == "")
			{
				$("html, body").animate({ scrollTop: 100 }, 600);
				$("#mobile").addClass("error");
				return false;
			}
			$("#mobile").removeClass("error");
				return true;
	}
});

function loadmessage(){
	var dataString = "user_id="+window.localStorage.getItem("user_id")+"&member_id="+window.localStorage.getItem("member_id");
	$.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_newapp/message_centre',
        type:'POST',
        data:dataString,
		dataType:'json',
        success:function(data){  
			$('.w-tab-pane[data-w-tab="Tab 31"]').empty().append(data.member+data.member_view);
			$('.w-tab-pane[data-w-tab="Tab 32"]').empty().append(data.cheque+data.cheque_view);
			$('.w-tab-pane[data-w-tab="Tab 33"]').empty().append(data.contact+data.contact_view);
			$('.w-tab-pane[data-w-tab="Tab 34"]').empty().append(data.org+data.org_view);
			$('.w-tab-pane[data-w-tab="Tab 35"]').empty().append(data.pos+data.pos_view);
			$('.w-tab-pane[data-w-tab="Tab 36"]').empty().append(data.sms_alert+data.sms_view);
        }
    });	
}

$(document).on('click','a[data-cid]',function(){ 
	$(this).parent().parent().parent().hide();
	$("#cont_view").show();$("#cont_view").children().hide();
	$("#cont_view #tab_view_"+$(this).attr('data-cid')).show();
});
$(document).on('click','.grey-header a',function(){ 
	$("#cont_list").show();
	$("#cont_view").children('div').hide();
	if($(this).parent().parent().parent().attr('data-w-tab') == 'Tab 31' || $(this).parent().parent().parent().attr('data-w-tab') == 'Tab 32' || $(this).parent().parent().parent().attr('data-w-tab') == 'Tab 33'|| $(this).parent().parent().parent().attr('data-w-tab') == 'Tab 34'|| $(this).parent().parent().parent().attr('data-w-tab') == 'Tab 35'|| $(this).parent().parent().parent().attr('data-w-tab') == 'Tab 36') {
		$(this).parent().parent().hide();
		$(this).parent().parent().parent().children('div.w-row').show();
	} 
	if($(this).parent().parent().parent().parent().attr('data-w-tab') == 'Tab 1'){
		$(this).parent().parent().hide();
		$(this).parent().parent().parent().children('div.w-row').show();
	}
	
});
$(document).on('click','.addtab',function(){
	$('.w-tab-pane[data-w-tab="Tab 2"]').children('div').hide(); $('#cont-form')[0].reset();$("#dr_id").val('');
	$("#add_new").show();
});
$(document).on('click','.viewdft',function(){
	$('.w-tab-pane[data-w-tab="Tab 2"]').children('div').hide();
	$("#dft_list").show();
});
$(document).on('click',"#add_new a, #dft_list a",function(){
	$('.w-tab-pane[data-w-tab="Tab 2"]').children('div').hide();
	$('.w-tab-pane[data-w-tab="Tab 2"]').children('div:first').show();
	$("#cont_list").show();
});
$(document).on('click','#dft_list .list-message a',function(){
	$('.w-tab-pane[data-w-tab="Tab 2"]').children('div').hide();
	var house = $(this).attr('data-house').split('#-#');
	var name = $(this).attr('data-name').split('###');
	$('#cont-form')[0].reset();
	$("#first-name").val(name[0]);
	$("#middle-name").val(name[1]);
	$("#surname").val(name[2]);
	$("#mobile").val($(this).attr('data-phone'));
	$("#email").val($(this).attr('data-email'));
	$("#flat").val(house[0]);
	$("#house").val(house[1]);
	$("#street").val(house[2]);
	$("#locality").val(house[3]);
	$("#town").val(house[4]);
	$("#postcode").val(house[5]);
	$("#dr_id").val($(this).attr('data-cid'));
	$("#add_new").show();
});

$(document).on('click','.w-tab-pane a.w-tab-link',function(){
	$(this).parent().children('a').removeClass('w--current');
	$(this).addClass('w--current');
	$('.w-tab-pane[data-w-tab="Tab 3"] .w-tab-content').children('div').hide();
	$('.w-tab-pane[data-w-tab="Tab 3"] .w-tab-pane[data-w-tab="'+$(this).attr('data-w-tab')+'"]').show();
});

$(document).on('click','a[data-ccid]',function(){ 
	$(this).parent().parent().hide();
	$(this).parent().parent().parent().children().hide();
	$(this).parent().parent().parent().find("#cont_view_"+$(this).attr('data-ccid')).show();
});
$(document).on('click','a[data-cfid]',function(){ 
	$(this).parent().parent().hide();
	$(this).parent().parent().parent().children().hide();
	$(this).parent().parent().parent().find("#fin_view_"+$(this).attr('data-cfid')).show();
});
$(document).on('click','a[data-cmid]',function(){ 
	$(this).parent().parent().hide();
	$(this).parent().parent().parent().children().hide();
	$(this).parent().parent().parent().find("#contact_view_"+$(this).attr('data-cmid')).show();
});
$(document).on('click','a[data-cpid]',function(){ 
	$(this).parent().parent().hide();
	$(this).parent().parent().parent().children().hide();
	$(this).parent().parent().parent().find("#pos_view_"+$(this).attr('data-cpid')).show();
});
$(document).on('click','a[data-csid]',function(){ 
	$(this).parent().parent().hide();
	$(this).parent().parent().parent().children().hide();
	$(this).parent().parent().parent().find("#sms_view_"+$(this).attr('data-csid')).show();
});
$(document).on('click','a[data-inid]',function(){ 
	$(this).parent().parent().hide();
	$(this).parent().parent().parent().children().hide();
	$(this).parent().parent().parent().find("#inb_view_"+$(this).attr('data-inid')).show();
});
$(document).on('change','#region',function(){
	var dataString = "reg_id="+$('#region').val();
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/area',
        type:'POST',
        data:dataString,
        success:function(data){
           $('#majlis').children().remove().end().append(data);
        }
    });
});

$(document).on('click','#searchmember',function(){
	if($("#region").val() !='' & $("#majlis").val() !='' & $("#surname").val() !='' ){
		$(".loading-mask").css('opacity','0.5');
		var dataString = "region="+$("#region").val()+"&area="+$("#majlis").val()+"&surname="+$("#surname").val();
        $.ajax({
            url:'http://amisapp.ansarullah.co.uk/mobile_newapp/member_search',
            type:'POST',
            data:dataString,            
            success:function(data){
				$(".loading-mask").css('opacity','0');
				$("html, body").animate({ scrollTop: 200 }, 600);
                $('#mem_list').empty().html(data);
				$("#comfot").show();
            }
        });
	}else{
		if($("#region").val() =='')$("#region").addClass('error'); else $("#region").removeClass('error');
		if($("#majlis").val() =='')$("#majlis").addClass('error'); else $("#majlis").removeClass('error');
		if($("#surname").val() =='')$("#surname").addClass('error'); else $("#surname").removeClass('error');
		$("#comfot").hide();
	}
	
});

//$(document).ready(function(e) {
    var subject    = $("#subject");
	var message = $("#message");	 
	 	
	subject.blur(validateSubject);	
	message.blur(validateMessage);	
	subject.keyup(validateSubject);	
	message.keyup(validateMessage);	
	
	$('#com-form').submit(function(){
		if(validateSubject() & validateMessage() & validateMem()){
			$(".loading-mask").css('opacity','0.5');
			
	var subject = $('#mail_sub').val();
    var content = $('#message').val();
    var type = $('#msg_typ').val();
    var reply_id = $('#reply_id').val();
    var arr = new Array;
		$('input[name="memcheck[]"]:checked').each(function () {
		arr.push($(this).val());
	});
      
        var dataStr = {u_id:window.localStorage.getItem("user_id"),to_id:arr,sub:$("#subject").val(),text:$("#message").val(),sts:0};
        $.ajax({
            url:'http://amisapp.ansarullah.co.uk/mobile_newapp/mail_send',
            type:'POST',
            data:dataStr,
            success:function(){
				$(".loading-mask").css('opacity','0');
				$('body').append('<div class="w-lightbox-backdrop" tabindex="0" style="transition: opacity 300ms ease 0s; opacity: 1;"><div class="w-lightbox-view" style="transform: translateX(0px); transition: opacity 300ms ease 0s, transform 300ms ease 0s; opacity: 1;"><div class="w-lightbox-frame">Mail has been sent</div></div></div>');
                setTimeout(function(){$(".w-lightbox-backdrop").remove(); window.location.reload();},2000);
            }
        });
			
			return false;
		}
		return false;
	});
	
	function validateSubject(){
		if($("#subject").val() == ''){
			$("#subject").addClass('error');
			return false;
		}
		$("#subject").removeClass('error');
			return true;
	}
	
	function validateMessage(){
		if($("#message").val() == ''){
			$("#message").addClass('error');
			return false;
		}
		$("#message").removeClass('error');
			return true;
	}
	
	function validateMem(){
		
		if($('input[name="memcheck[]"]:checked').length > 0){
			return true;
		}else{
			return false;
		}
		
	}
//});
$(document).on('click','.compose',function(){
	$(this).parent().parent().hide();
	$("#inbox_list").hide();
	$("#compose_msg").show();
});

$(document).on('click','#compose_msg a.grey',function(){
	$(this).parent().parent().parent().children('div.w-row').show();
	$(this).parent().parent().hide();
});
$(document).on('click','#comcancel',function(){
	$($("div[data-w-tab='Tab 1']")).children('div.w-row').show();
	$("#compose_msg").hide();
});