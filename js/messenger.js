$(document).ready(function(e) {
	$(".loading-mask").css('opacity','0.5');
	
	
	
  //setup "global" variables first
  var socket = io.connect("54.68.26.167:3000");
  var myRoomID = null;
  socket.emit("joinserver", window.localStorage.getItem("first_name"), "mobile");
  /*var element = "td";
   socket.emit("check", element, function(data) {
				  roomExists = data.result; 
				   if (roomExists) {
					  $("#errors").empty();
					  $("#errors").show();
					  $("#errors").append("Room <i>" + element + "</i> already exists");
					} else {      
					if (element.length > 0) { 
					  socket.emit("createRoom", element);
					  }
					}
				});*/
		
  var dataString = "user_id="+window.localStorage.getItem("user_id");
  var roomlist = new Array; var roomlistid = new Array;
    $('#details_event').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_newapp/group_list',
        type:'POST',
        data:dataString,
		dataType:'json',
        success:function(data){ 
			  $(".loading-mask").css('opacity','0');		//alert(1);	
			 // $(".list-messages").empty().append(data.group);
			  $.each( data.groups, function( key, value ) {
					roomlist.push(value);
					roomlistid.push(key);
					socket.emit("check", value, function(data) { 
					  roomExists = data.result; 
					   if (roomExists) {
						  $("#errors").empty();
						  $("#errors").show();
						  //$("#errors").append("Room <i>" + element + "</i> already exists");
						} else {      
						if (value.length > 0) { 
						  socket.emit("createRoom", value);
						  }
						}
					});
				});
			  
			 //var roomID = myRoomID; 
    			//socket.emit("leaveRoom", roomID);
				 socket.on("roomList", function(data) {
				$("#rooms").text("");
				//if (!jQuery.isEmptyObject(data.rooms))
				//$("#rooms").append("<li class=\"list-group-item active\">List of rooms <span class=\"badge\">"+data.count+"</span></li>");
				 //if (!jQuery.isEmptyObject(data.rooms)) 
				 { 
				  $.each(data.rooms, function(id, room) { 
				  if($.inArray(room.name,roomlist) != -1){ //alert($.inArray(room.name,roomlist));
					var html = "<button id="+id+" class='joinRoomBtn btn btn-default btn-xs' >Join</button>" + " " + "<button id="+id+" class='removeRoomBtn btn btn-default btn-xs'>Remove</button>"; 
				  //  $('#rooms').append("<li id="+id+" class=\"list-message\"><span>" + room.name + "</span> " + html + "</li>");
					$('#rooms').append('<li id="'+id+'" data-rid="'+roomlistid[roomlist.indexOf(room.name)]+'" class=\"list-message\"><a class="w-clearfix w-inline-block" href="javascript:void(0);"><div class="w-clearfix column-left"><div class="image-message"><img src="images/placeholder.png" style="height: 50px;"></div></div><div class="column-right"><div class="message-title">'+ room.name +'</div><div class="message-text">msg</div></div></a></li>');
				  }
				  });
				} /*else {
				  //$("#rooms").append("<li class=\"list-group-item\">There are no rooms yet.</li>");
				   $(roomlist).each(function(index, element) { 
						socket.emit("check", element, function(data) {
						  roomExists = data.result; 
						   if (roomExists) {
							  $("#errors").append("Room <i>" + element + "</i> already exists");
							} else {      
							if (element.length > 0) { 
							  socket.emit("createRoom", element);
							  }
							}
						});
						
						$('#rooms').append('<li id="'+id+'" class=\"list-message\"><a class="w-clearfix w-inline-block" href="javascript:void(0);"><div class="w-clearfix column-left"><div class="image-message"><img src="images/placeholder.png" style="height: 50px;"></div></div><div class="column-right"><div class="message-title">'+ room.name +'</div><div class="message-text">msg</div></div></a></li>');
					});
				}*/
			  });
        }
    });
  
 

  $("form").submit(function(event) {
    event.preventDefault();
  });

  $("#conversation").bind("DOMSubtreeModified",function() {
    $("#conversation").animate({
        scrollTop: $("#conversation")[0].scrollHeight
      });
  });

  $("#main-chat-screen").hide();
  $("#errors").hide();
  $("#name").focus();
  $("#join").attr('disabled', 'disabled'); 
  
  if ($("#name").val() === "") {
    $("#join").attr('disabled', 'disabled');
  }


  $("#name").keypress(function(e){
    var name = $("#name").val();
    if(name.length < 2) {
      $("#join").attr('disabled', 'disabled'); 
    } else {
      $("#errors").empty();
      $("#errors").hide();
      $("#join").removeAttr('disabled');
    }
  });

  //main chat screen
  $("#chatForm").submit(function() {
    var msg = $("#msg").val();
    if (msg !== "") {
      socket.emit("send", new Date().getTime(), msg);
	  $.post('http://amisapp.ansarullah.co.uk/mobile_newapp/save_msg',{uid:window.localStorage.getItem("user_id"),msg:msg,gid:$("#rooms").find('li.active').attr('data-rid')},function(data){},"json");
      $("#msg").val("");
    }
  });

  //'is typing' message
  var typing = false;
  var timeout = undefined;

  function timeoutFunction() {
    typing = false;
    socket.emit("typing", false);
  }

  $("#msg").keypress(function(e){
    if (e.which !== 13) {
      if (typing === false && myRoomID !== null && $("#msg").is(":focus")) {
        typing = true;
        socket.emit("typing", true);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 5000);
      }
    }
  });

  socket.on("isTyping", function(data) {
    if (data.isTyping) {
      if ($("#"+data.person+"").length === 0) {
        $("#updates").append("<li id='"+ data.person +"'><span class='text-muted'><small><i class='fa fa-keyboard-o'></i> " + data.person + " is typing.</small></li>");
        timeout = setTimeout(timeoutFunction, 5000);
      }
    } else {
      $("#"+data.person+"").remove();
    }
  });



/*
  $("#msg").keypress(function(){
    if ($("#msg").is(":focus")) {
      if (myRoomID !== null) {
        socket.emit("isTyping");
      }
    } else {
      $("#keyboard").remove();
    }
  });

  socket.on("isTyping", function(data) {
    if (data.typing) {
      if ($("#keyboard").length === 0)
        $("#updates").append("<li id='keyboard'><span class='text-muted'><i class='fa fa-keyboard-o'></i>" + data.person + " is typing.</li>");
    } else {
      socket.emit("clearMessage");
      $("#keyboard").remove();
    }
    console.log(data);
  });
*/

  $("#showCreateRoom").click(function() {
    $("#createRoomForm").toggle();
  });

	$(document).on('click','a[data-cid]',function(){ 
		$("#menu-button").hide();
		$("#chatin").show();
		$(".list-messages").hide();
		$(".navbar-title").empty().append($(this).find('.message-title').html());
		$(".messenger-content-body").css('display','block');
		 var roomExists = false;
    var roomName = $(this).find('.message-title').html();
    socket.emit("check", roomName, function(data) {
      roomExists = data.result;
       if (roomExists) {
          $("#errors").empty();
          $("#errors").show();
          $("#errors").append("Room <i>" + roomName + "</i> already exists");
        } else {      
        if (roomName.length > 0) { //also check for roomname
          socket.emit("createRoom", roomName);
          //$("#errors").empty();
         // $("#errors").hide();
          }
        }
    });
	});


  $(document).on('click', '#rooms li a', function() {
	var roomID = myRoomID; 
    socket.emit("leaveRoom", roomID);
	$("#rooms li").each(function(index, element) {
        $(this).removeClass('active');
    });
	$.post('http://amisapp.ansarullah.co.uk/mobile_newapp/get_msg',{gid:$(this).parent().attr('data-rid'),uid:window.localStorage.getItem("user_id")},function(data){
		$("#msgs").append(data.msg);
		},"json");
	socket.emit("leaveRoom", roomID);
	var roomName = $(this).find(".message-title").text();
    var roomID = $(this).parent().attr("id");
    socket.emit("joinRoom", roomID);
	$(this).parent().addClass('active');
	$("#msgs li").each(function(index, element) {
		$(this).hide();
        if($(this).attr('data-rid') == roomID) $(this).show();
    });
	$("#menu-button").hide();
	$("#chatin").show();
	$(".list-messages").hide();
	$(".navbar-title").empty().append($(this).find('.message-title').html());
	$(".messenger-content-body").css('display','block');
    
  });

  $("#rooms").on('click', '.removeRoomBtn', function() {
    var roomName = $(this).find(".message-title").text();
    var roomID = $(this).attr("id");
    socket.emit("removeRoom", roomID);
    $("#createRoom").show();
  }); 

  $("#leave").click(function() {
    var roomID = myRoomID;
    socket.emit("leaveRoom", roomID);
    $("#createRoom").show();
  });

  $("#people").on('click', '.whisper', function() {
    var name = $(this).siblings("span").text();
    $("#msg").val("w:"+name+":");
    $("#msg").focus();
  });
/*
  $("#whisper").change(function() {
    var peopleOnline = [];
    if ($("#whisper").prop('checked')) {
      console.log("checked, going to get the peeps");
      //peopleOnline = ["Tamas", "Steve", "George"];
      socket.emit("getOnlinePeople", function(data) {
        $.each(data.people, function(clientid, obj) {
          console.log(obj.name);
          peopleOnline.push(obj.name);
        });
        console.log("adding typeahead")
        $("#msg").typeahead({
            local: peopleOnline
          }).each(function() {
            if ($(this).hasClass('input-lg'))
              $(this).prev('.tt-hint').addClass('hint-lg');
        });
      });
      
      console.log(peopleOnline);
    } else {
      console.log('remove typeahead');
      $('#msg').typeahead('destroy');
    }
  });
  // $( "#whisper" ).change(function() {
  //   var peopleOnline = [];
  //   console.log($("#whisper").prop('checked'));
  //   if ($("#whisper").prop('checked')) {
  //     console.log("checked, going to get the peeps");
  //     peopleOnline = ["Tamas", "Steve", "George"];
  //     // socket.emit("getOnlinePeople", function(data) {
  //     //   $.each(data.people, function(clientid, obj) {
  //     //     console.log(obj.name);
  //     //     peopleOnline.push(obj.name);
  //     //   });
  //     // });
  //     //console.log(peopleOnline);
  //   }
  //   $("#msg").typeahead({
  //         local: peopleOnline
  //       }).each(function() {
  //         if ($(this).hasClass('input-lg'))
  //           $(this).prev('.tt-hint').addClass('hint-lg');
  //       });
  // });
*/

//socket-y stuff
socket.on("exists", function(data) {
  $("#errors").empty();
  $("#errors").show();
  $("#errors").append(data.msg + " Try <strong>" + data.proposedName + "</strong>");
    toggleNameForm();
    toggleChatWindow();
});

socket.on("joined", function() {
  $("#errors").hide();
  

});

socket.on("history", function(data) {
  if (data.length !== 0) {
    $("#msgs").append("<li><strong><span class='text-warning'>Last 10 messages:</li>");
    $.each(data, function(data, msg) {
      $("#msgs").append("<li><span class='text-warning'>" + msg + "</span></li>");
    });
  } else {
    $("#msgs").append("<li><strong><span class='text-warning'>No past messages in this room.</li>");
  }
});

  socket.on("update", function(msg) {
  // $("#msgs").append("<li>" + msg + "</li>");
  });

  socket.on("update-people", function(data){
    //var peopleOnline = [];
    $("#people").empty();
    $('#people').append("<li class=\"list-group-item active\">People online <span class=\"badge\">"+data.count+"</span></li>");
    $.each(data.people, function(a, obj) {
      if (!("country" in obj)) {
        html = "";
      } else {
        html = "<img class=\"flag flag-"+obj.country+"\"/>";
      }
      $('#people').append("<li class=\"list-group-item\"><span>" + obj.name + "</span> <i class=\"fa fa-"+obj.device+"\"></i> " + html + " <a href=\"#\" class=\"whisper btn btn-xs\">whisper</a></li>");
      //peopleOnline.push(obj.name);
    });

    /*var whisper = $("#whisper").prop('checked');
    if (whisper) {
      $("#msg").typeahead({
          local: peopleOnline
      }).each(function() {
         if ($(this).hasClass('input-lg'))
              $(this).prev('.tt-hint').addClass('hint-lg');
      });
    }*/
  });

  socket.on("chat", function(msTime, person, msg) { 
  	var chat_cls = "conversation-other";
	if (person.name ===  window.localStorage.getItem("first_name")) var chat_cls = "conversation-self";
	var show_cht = 'style="display:none;"';
	if($("#rooms li.active").attr('data-rid') == myRoomID || $("#rooms li.active").attr('id') == myRoomID) show_cht = 'style="display:block;"';
    $("#msgs").append("<li class='conversation-item' data-rid='"+myRoomID+"' "+show_cht+"><div class='"+chat_cls+"'><div class='conversation-avatar'><img class='img-circle' src='images/0180441436.jpg' alt='"+person.name+"' width='36' height='36'></div><div class='conversation-messages'><div class='conversation-message'>" + msg + "</div></div></div></li>");	
    //clear typing field
     $("#"+person.name+"").remove();
     clearTimeout(timeout);
     timeout = setTimeout(timeoutFunction, 0);
  });

  socket.on("whisper", function(msTime, person, msg) {
    if (person.name === "You") {
      s = "whisper"
    } else {
      s = "whispers"
    }
    $("#msgs").append("<li><strong><span class='text-muted'>" + timeFormat(msTime) + person.name + "</span></strong> "+s+": " + msg + "</li>");
  });

  

  socket.on("sendRoomID", function(data) {
    myRoomID = data.id;
  });

  socket.on("disconnect", function(){
    $("#msgs").append("<li><strong><span class='text-warning'>The server is not available</span></strong></li>");
    //$("#msg").attr("disabled", "disabled");
   // $("#send").attr("disabled", "disabled");
  });


});


/*$(document).on('click','a[data-cid]',function(){ 
	$("#menu-button").hide();
	$("#chatin").show();
	$(".list-messages").hide();
	$(".navbar-title").empty().append($(this).find('.message-title').html());
	$(".messenger-content-body").show();
	//$("#cont_view").children().hide();
	//$("#cont_view #tab_view_"+$(this).attr('data-cid')).show();
});*/
$(document).on('click','#chatin',function(){ 
	$("#chatin").hide();
	$("#menu-button").show();
	$(".list-messages").show();
	$(".messenger-content-body").hide();
	$(".navbar-title").empty().append('Messenger');
});
