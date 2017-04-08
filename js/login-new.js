
var category, first_name, middle_name, surname, member_code, member_region, member_area,
user_id, member_id, profImg_url, region, majlis, latitude, longitude, arr = [], pushNotification, androidToken,
 iosToken;

//get year
var fin_df = new Date();
var cur_yr = fin_df.getFullYear(), prv_yr = Number(cur_yr) - 1, nxt_yr = Number(cur_yr) + 1;

$(document).ready(function(e) {
    
    $.support.touchOverflow = true;
   // $.mobile.touchOverflowEnabled = true;
   // $.mobile.allowCrossDomainPages = true;

    login_user = window.localStorage.getItem("stay_signed");

    androidToken = window.localStorage.getItem("androidToken");
    iosToken = window.localStorage.getItem("iosToken");

    if (login_user) {
        $('#user_name').val(login_user);
        $('.chksign').prop('checked', true);
    }

   // $(function() {FastClick.attach(document.body);});

    //=========================== Device Ready ==================================
    document.addEventListener("deviceready", function() { 
        navigator.splashscreen.hide();
        disableBack = false;
         _notify();
        document.addEventListener("backbutton", function() {
            if ($.mobile.activePage == "loginform") {
                navigator.app.exitApp();
            }
            if (disableBack == false) {
                var prevPage = $.mobile.activePage.attr('data-prev');
                if (prevPage) {
                    if (prevPage == "loginform") {
                         navigator.notification.confirm("Do you wan't to exit from AMIS?",onConfirm,'Exit','Ok,Cancel');
                    }else{
                        $.mobile.changePage("#"+prevPage,{
                            allowSamePageTransition:true,
                            reloadPage:false,
                            changeHash:true,
                            transition:"none",
                            reverse: true
                        });
                    }
                }else{
                    navigator.notification.confirm("Do you wan't to exit from AMIS?",onConfirm,'Exit','Ok,Cancel');
                }
            }
        }, false);
    }, false);

    /** Device Ready ends **/
    /*$('#eventsBtn, #financeBtn, #notifyBtn, #giftBtn').draggable({
        revert: true,
        containment: "parent",
        start: function(event, ui) {
            var droppedID = $(this).attr('data-value');
            category = droppedID;
        }
    });

    $('.drophere').droppable({
        drop: function() {
            if (category==1) {
                    $.mobile.changePage("#finance", {
                        transition: "none"
                    });
            }else if(category==2){
                    $.mobile.changePage("#events", {
                        transition: "none"
                    });
            }else if(category==3){
                    $.mobile.changePage("#notify", {
                        transition: "none"
                    });
            }else if(category==4){
                    $.mobile.changePage("#profile", {
                        transition: "none"
                    });
            }
        }
    });*/
});


function _notify() { 
    try { 
        pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
            if(!androidToken){
                pushNotification.register(successHandler, errorHandler, {"senderID":"325344179118","ecb":"onNotification"});        // required!
            }

        } else {
            if(!iosToken){
                pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});    // required!
            }
        }
    }catch(err) { 
        txt="There was an error on this page.\n\n"; 
        txt+="Error description: " + err.message + "\n\n"; 
        navigator.notification.alert(txt); 
    } 
}

// handle GCM notifications for Android
function onNotification(e) {

    switch( e.event )
    {
        case 'registered':
        if ( e.regid.length > 0 )
        {
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            window.localStorage.setItem("androidToken", e.regid);
			$(".bottom-section").append(window.localStorage.getItem("androidToken"));
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


