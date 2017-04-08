$(document).ready(function(e) {
	var fin_df = new Date();
	var cur_yr = fin_df.getFullYear(), prv_yr = Number(cur_yr) - 1, nxt_yr = Number(cur_yr) + 1;
	
	$('#year').html('<option value="">* Year</option><option value="'+prv_yr+'">'+prv_yr+'</option><option value="'+cur_yr+'">'+cur_yr+'</option><option value="'+nxt_yr+'">'+nxt_yr+'</option>');
	
});

$(document).on('change','#year',function(){
	if($('#year').val()){
		$(".loading-mask").css('opacity','0.5');
		
		var dataString = "user_id="+window.localStorage.getItem("user_id")+"&year="+$('#year').val();
        $.ajax({
            url:'http://amisapp.ansarullah.co.uk/mobile_newapp/budget_details',
            type:'POST',
            data:dataString,
            dataType:'json',
            success:function(data){
				$(".loading-mask").css('opacity','0');
				$(".w-tabs").show();
                $('.w-tab-pane[data-w-tab="Tab 1"]').empty().append(data.budget+'<div class="w-row list-message"><div class="w-col w-col-tiny-6 n-p-l event-text">Total Budget Deficit (2014):</div><div class="w-col w-col-tiny-5">£'+data.bud_tot+'</div></div>');
				$('.w-tab-pane[data-w-tab="Tab 2"]').empty().append(data.promises+'<div class="w-row list-message"><div class="w-col w-col-tiny-6 n-p-l event-text">Total Promise‘s Deficit (2014):</div><div class="w-col w-col-tiny-5">£'+data.pro_tot+'</div></div>');
				$('.w-tab-pane[data-w-tab="Tab 3"]').empty().append(data.statement+data.statement_view);
				$('.w-tab-pane[data-w-tab="Tab 4"]').empty().append(data.statistics);
            }
        });
	}
});

$(document).on('click','a[data-ccid]',function(){
	$(this).parent().parent().hide();
	$("#cont_view_"+$(this).attr('data-ccid')).show();
});

$(document).on('click','.grey-header a',function(){ 
	$(this).parent().parent().hide();
	$(this).parent().parent().parent().find('div:first').show();
	
});