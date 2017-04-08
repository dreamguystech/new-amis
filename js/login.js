var pushNotification, androidToken, iosToken;
$(document).ready(function(e){
	var email    = $("#email");
	var password = $("#password");
	
	androidToken = window.localStorage.getItem("androidToken");
    iosToken = window.localStorage.getItem("iosToken");
	document.addEventListener("deviceready", function() { 
	_notify();
	}, false);
	email.blur(validateEmailUsername);	
	password.blur(validateLpassword);
	email.keyup(validateEmailUsername);
	password.keyup(validateLpassword);
		$('#login-form').submit(function(){ 
				if(validateEmailUsername() & validateLpassword() )
				{
        androidToken = window.localStorage.getItem("androidToken");
        iosToken = window.localStorage.getItem("iosToken");
        var dataString ="uname="+$("#email").val()+"&pass="+$("#password").val()+"&android="+androidToken+"&ios="+iosToken;
        $.ajax({
            url:"http://amisapp.ansarullah.co.uk/mobile_newapp/login",
            type:"POST",
            data:dataString,
            dataType:"json",
            beforeSend:function(){
                $(".loading-mask").css('opacity','0.5');
               // disableBack = true;
            },
            success:function(data){
               // disableBack = false;
				$(".loading-mask").css('opacity','0');
                if(data.res==1){
                   /* if ($('.chksign').is(":checked")){
                        window.localStorage.setItem("stay_signed", email);
                    }else{
                        window.localStorage.removeItem('stay_signed');
                    }*/
                    //set item
					var pro_img = '<img src="http://amisapp.ansarullah.co.uk/images/member/'+data.det.prof_img+'" />';
					if(data.det.prof_img == "user.png")
					var pro_img  = '<i class="navbar-button-icon icon ion-ios-person-outline" style="font-size: 30px; height: 35px; width: 35px; display: inline;"></i>';
                    window.localStorage.setItem("member_id", data.det.m_id);
                    window.localStorage.setItem("user_id", data.det.u_id);
                    window.localStorage.setItem("first_name", data.det.fname);
                    window.localStorage.setItem("middle_name", data.det.mid_name);
                    window.localStorage.setItem("surname", data.det.surname);
                    window.localStorage.setItem("member_code", data.det.m_code);
                    window.localStorage.setItem("region", data.det.region);
                    window.localStorage.setItem("area", data.det.area);
                    window.localStorage.setItem("prof_img", pro_img);
                    window.localStorage.setItem("latitude", data.det.latitude);
                    window.localStorage.setItem("longitude", data.det.longitude);

                    //get item
                    user_id = window.localStorage.getItem("user_id");
                    member_id = window.localStorage.getItem("member_id");
                    member_code = window.localStorage.getItem("member_code");
                    first_name = window.localStorage.getItem("first_name");
                    middle_name = window.localStorage.getItem("middle_name");
                    surname = window.localStorage.getItem("surname");
                    member_region = window.localStorage.getItem("region");
                    member_area = window.localStorage.getItem("area");
                    profImg_url = window.localStorage.getItem("prof_img");
                    latitude = window.localStorage.getItem("latitude");
                    longitude = window.localStorage.getItem("longitude");
                   
                    location.href = "home.html";
                   
                }else{
					$('#password').addClass("error");
					$('#email').addClass("error");	
                    setTimeout(function(){$('.ajaxOverlay').hide();$('.login_err').html(data.det);}, 2000);
                    window.localStorage.clear();
                }
            }
        });
    
					
					
				}
				return false;
		});
		
		function validateEmailUsername()
		{
			var a = $("#email").val();
			var filter = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
			if(a == "")
			{
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
		
		function validateLpassword(){
			var password  = $('#password').val();
			if(password == '')
			{
				$('#password').addClass("error");				
				return false;
			}else
			{
				$('#password').removeClass("error");
				return true;
			}
		}
		
		var forgotpw = $('#forgotpw');	
		
		forgotpw.submit(function(){			
				if(validateEmailfp())
				{
					$("#fpload").show();
					$("#fpfooter").hide();
					$.post(base_url+'forgot_password', 
                        { useremail:$("#fpemail").val() },
                        function(data){	
							$("#fpload").hide();
							if(data.success == "success")
							{								
								$("#fpfooter").after('Check your email to reset your password');
							}else
							{
								$('#fpemail').addClass("error");	
								$("#fpfooter").show();
							}
                        }, 
                        "json"
                    );
					return false;
				}
				else
				{
				return false;
				}
		});
		

		
});


function _notify() { 

    try { 
        pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
            //if(!androidToken)
			{
                pushNotification.register(successHandler, errorHandler, {"senderID":"821939182782","ecb":"onNotification"});        // required!
            }

        } else {
           // if(!iosToken)
			{
                pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});    // required!
            }
        }
    }catch(err) { 
        txt="There was an error on this page.\n\n"; 
        txt+="Error description: " + err.message + "\n\n"; 
        //navigator.notification.alert(txt);
		$(".bottom-section").append(txt);
    } 
}

// handle GCM notifications for Android
function onNotification(e) {
	alert();
    switch( e.event )
    {
        case 'registered':
        if ( e.regid.length > 0 )
        {
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            window.localStorage.setItem("androidToken", e.regid);
			alert(e.regid);
        }
        break;
        
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                // on Android soundname is outside the payload. 
                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
                // playing a sound also requires the org.apache.cordova.media plugin
                var my_media = new Media("/android_asset/www/"+ soundfile);
                my_media.play();
            }
            else
            {   // otherwise we were launched because the user touched a notification in the notification tray.
                /*if (e.coldstart)
                    navigator.notification.alert('COLDSTART NOTIFICATION');
                else
                    navigator.notification.alert('BACKGROUND NOTIFICATION');*/
            }
            navigator.notification.alert(e.payload.message);
        break;
        case 'error':
            navigator.notification.alert('ERROR -> MSG:'+e.msg);
            //$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
        break;
        default:
            navigator.notification.alert('EVENT -> Unknown, an event was received and we do not know what it is');
            //$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
        break;
    }
}

// handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
         // showing an alert also requires the org.apache.cordova.dialogs plugin
         navigator.notification.alert(e.alert);
    }
    if (e.sound) {
        // playing a sound also requires the org.apache.cordova.media plugin
        var snd = new Media(e.sound);
        snd.play();
    }
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

function tokenHandler (result) {
    window.localStorage.setItem("iosToken", result);
	
    //navigator.notification.alert('Token: '+result); 
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler (result) {
    //navigator.notification.alert('Success:'+result); 
}

function errorHandler (error) {
    navigator.notification.alert('Device registertaion failed: '+error); 
}