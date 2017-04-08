$.support.cors = true;
var category, first_name, middle_name, surname, member_code, member_region, member_area,
user_id, member_id, profImg_url, region, majlis, latitude, longitude, arr = [], pushNotification, androidToken,
 iosToken;
var ula_field = ["s_time", "e_all", "e_nat", "e_reg", "e_maj", "e_inv", "a_att", "p_att", "budget", "promise", "statement", "statistics", "mail_new", "mail_box", "mc_con", "mc_chq", "mc_mem", "mc_org", "mc_pos", "mc_sms", "tc_create", "tc_draft", "tc_history"];
//get year
var fin_df = new Date();
var cur_yr = fin_df.getFullYear(), prv_yr = Number(cur_yr) - 1, nxt_yr = Number(cur_yr) + 1;

$(document).ready(function(e) {
    
    $.support.touchOverflow = true;
    $.mobile.touchOverflowEnabled = true;
    $.mobile.allowCrossDomainPages = true;

    login_user = window.localStorage.getItem("stay_signed");

    androidToken = window.localStorage.getItem("androidToken");
    iosToken = window.localStorage.getItem("iosToken");

    if (login_user) {
        $('#user_name').val(login_user);
        $('.chksign').prop('checked', true);
    }

    $(function() {FastClick.attach(document.body);});

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
    $('#eventsBtn, #financeBtn, #notifyBtn, #giftBtn').draggable({
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
    });
});


/*--login starts---*/
$(document).on('click', '.loginBtn', function(){
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    email = $('#user_name').val();
    pass = $('#user_pass').val();
    if(email==""){
        $('.login_err').html('* Please enter a user ID');
    }else if (!pattern.test(email)) {
        $('.login_err').html('* Please enter a valid email address');
    }else if(pass==""){
        $('.login_err').html('* Please enter a password');
    }else{
        $('.login_err').html('');
        androidToken = window.localStorage.getItem("androidToken");
        iosToken = window.localStorage.getItem("iosToken");
        var dataString ="uname="+email+"&pass="+pass+"&android="+androidToken+"&ios="+iosToken;
        $.ajax({
            url:"http://amisapp.ansarullah.co.uk/mobile_app/login",
            type:"POST",
            data:dataString,
            dataType:"json",
            beforeSend:function(){
                $('.ajaxOverlay').show();
                disableBack = true;
            },
            success:function(data){
                disableBack = false;
                if(data.res==1){
                    if ($('.chksign').is(":checked")){
                        window.localStorage.setItem("stay_signed", email);
                    }else{
                        window.localStorage.removeItem('stay_signed');
                    }
                    //set item
                    window.localStorage.setItem("member_id", data.det.m_id);
                    window.localStorage.setItem("user_id", data.det.u_id);
                    window.localStorage.setItem("first_name", data.det.fname);
                    window.localStorage.setItem("middle_name", data.det.mid_name);
                    window.localStorage.setItem("surname", data.det.surname);
                    window.localStorage.setItem("member_code", data.det.m_code);
                    window.localStorage.setItem("region", data.det.region);
                    window.localStorage.setItem("area", data.det.area);
                    window.localStorage.setItem("prof_img", data.det.prof_img);
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
                    var ul_obj = data.det.ula;
                    
                    var usr_l = Object.keys(ul_obj).map(function(key){return ul_obj[key]});

                    for (var xy = 0; xy < ula_field.length; xy++) {
                        if(in_array(ula_field[xy], usr_l)){
                            $('.'+ula_field[xy]).show();
                        }else{
                            $('.'+ula_field[xy]).hide();
                        }
                        
                    }
                    
                    $('.profileName h4').html(first_name+' '+surname);
                    $('.profileImage img').attr("src","http://amisapp.ansarullah.co.uk/images/member/"+profImg_url);
                    setTimeout(function(){
                        $('.ajaxOverlay').hide();
                        $.mobile.changePage("#menuList", {
                            transition: "none"
                        });
                    }, 2000);
                    
                    //profile details 
                    profile_details();
                    //events list call
                    events_list();
                    //message centre list call
                    message_centre();
                    //inbox 
                    email_inbox();
                    //regions
                    regions();
                    //salaat times
                    tday();
                    
                    //finance year
                    $('#fin_year').html('<option value="">* Year</option><option value="'+prv_yr+'">'+prv_yr+'</option><option value="'+cur_yr+'">'+cur_yr+'</option><option value="'+nxt_yr+'">'+nxt_yr+'</option>');
                }else{
                    setTimeout(function(){$('.ajaxOverlay').hide();$('.login_err').html(data.det);}, 2000);
                    window.localStorage.clear();
                }
            }
        });
    }
});
/*--login ends---*/

/*-- compose message--*/
$(document).on('click', '.compose', function(){
    $('#mail_sub').val('');
    $('#message').val('');
    $('#msg_typ').val(0);
    $('#msg_title').html('Compose');
});
/*-- compose message ends--*/

/*-- forward message--*/
$(document).on('click', '.fwd_msg', function(){
    var msg_sub = $('#fwd_sub').val();
    var msg_content = $('#fwd_content').val();
    $('#mail_sub').val('Re: '+msg_sub);
    $('#message').val(msg_content);
    $('#msg_typ').val(2);
    $('#msg_title').html('Forward');
});
/*-- forward message ends--*/

/*-- reply message --*/
$(document).on('click', '.rep_msg', function(){
    var reply_to = $('#reply_addr').val();
    $('#reply_id').val(reply_to);
    $('#mail_sub').val('');
    $('#message').val('');
     $('#msg_typ').val(1);
    $('#msg_title').html('Reply');
});
/*-- reply message ends--*/


$("#con_cr").on("pageshow", function() { $.mobile.silentScroll(0); });

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

function in_array(needle, haystack, argStrict) {
  var key = '',
    strict = !! argStrict;
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }
  return false;
}

// process the confirmation dialog result
    function onConfirm(buttonIndex) {
        if (buttonIndex==1) {
            //window.localStorage.clear();
            navigator.app.exitApp();
        };
    }

//set profile details
function profile_details() {
    $('#member_code').html("Member Code: "+member_code);
    $('#fname').html("First Name : "+first_name);
    $('#midname').html("Middle Name :"+middle_name);
    $('#surname').html("Surname :"+surname);
    $('#member_region').html("Region :"+member_region);
    $('#member_area').html("Majlis : "+member_area);
    $('#profile_img').attr("src","http://amisapp.ansarullah.co.uk/images/member/"+profImg_url);
}
//get region list
function regions() {
    var dataString = "user_id="+user_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/regions',
        type:'POST',
        data:dataString,
        success:function(data){
            $('#select-native-1').html(data);
        }
    });
}
//get area list
function area(reg_id) {
    var dataString = "reg_id="+reg_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/area',
        type:'POST',
        data:dataString,
        success:function(data){
           $('#select-native-2').html(data);
           $("#select-native-2").selectmenu('refresh', true);
        }
    });
}

//get user events
function events_list() {
    var dataString = "user_id="+user_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/events_list',
        type:'POST',
        data:dataString,
        dataType:'json',
        success:function(data){
            $('#list_national').after(data.nat);
            $('#list_regional').after(data.reg);
            $('#list_local').after(data.maj);
            $('#list_all').after(data.totev);
            $('#org_list_all').after(data.orgeve);
            $('#list_invites').after(data.invite);
        }
    });
}

function event_details(id) {
    var dataString = "user_id="+user_id+"&id="+id;
    $('#details_event').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/event_details',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(data){
            //$('#event_title').html("Event details");
            $('#details_event').html(data);
            setTimeout(function() {
               $('.ajaxOverlay').hide();
               disableBack = false;
               $.mobile.changePage("#events_details", {
                    transition: "none"
                });
            },2000);
            
        }
    });
}

//get (finance) promise and budget details

function get_budget() {
    var finance_year = $('#fin_year').val();
    if(finance_year!=""){
        var dataString = "user_id="+user_id+"&year="+finance_year;
        $.ajax({
            url:'http://amisapp.ansarullah.co.uk/mobile_app/budget_details',
            type:'POST',
            data:dataString,
            dataType:'json',
            beforeSend:function(){
                $('.ajaxOverlay').show();
                disableBack = true;
            },
            success:function(data){
                $('#det_budget').html(data.budget);
                $('#bud_tot').html(data.bud_tot);
                setTimeout(function() {
                   $('.ajaxOverlay').hide();
                   disableBack = false;
                   $.mobile.changePage("#my_budget", {
                        transition: "none"
                    });
                },2000);
            }
        });
    }else{
        navigator.notification.alert('Please select a year', null, 'Error', 'OK');
    }
}

function get_promise() {
    var finance_year = $('#fin_year').val();

    if(finance_year!=""){
        var dataString = "user_id="+user_id+"&year="+finance_year;
        $.ajax({
            url:'http://amisapp.ansarullah.co.uk/mobile_app/promise_details',
            type:'POST',
            data:dataString,
            dataType:'json',
            beforeSend:function(){
                $('.ajaxOverlay').show();
                disableBack = true;
            },
            success:function(data){
                $('#det_promise').html(data.promises);
                $('#pro_tot').html(data.pro_tot);
                setTimeout(function() {
                   $('.ajaxOverlay').hide();
                   disableBack = false;
                   $.mobile.changePage("#my_promise", {
                        transition: "none"
                    });
                },2000);
            }
        });
    }else{
        navigator.notification.alert('Please select a year', null, 'Error', 'OK');
    }
}


function get_statistics() {
    var finance_year = $('#fin_year').val();
    if(finance_year!=""){
        var dataString = "user_id="+user_id+"&year="+finance_year;
        $.ajax({
            url:'http://amisapp.ansarullah.co.uk/mobile_app/statistics',
            type:'POST',
            data:dataString,
            beforeSend:function(){
                $('.ajaxOverlay').show();
                disableBack = true;
            },
            success:function(inc_st){
                $('#det_statistics').html(inc_st);
                setTimeout(function() {
                   $('.ajaxOverlay').hide();
                   disableBack = false;
                   $.mobile.changePage("#my_statistics", {
                        transition: "none"
                    });
                },2000);
            }
        });
    }else{
        navigator.notification.alert('Please select a year', null, 'Error', 'OK');
    }
}

//get statement lists
function statement_lists() {
    var finance_year = $('#fin_year').val();

    if(finance_year!=""){
        var dataString = "user_id="+user_id+"&year="+finance_year;
        $.ajax({
            url:'http://amisapp.ansarullah.co.uk/mobile_app/statement_lists',
            type:'POST',
            data:dataString,
            beforeSend:function(){
                $('.ajaxOverlay').show();
                disableBack = true;
            },
            success:function(data){
                $('#statement_list').html(data);
                setTimeout(function() {
                   $('.ajaxOverlay').hide();
                   disableBack = false;
                   $.mobile.changePage("#my_statement", {
                        transition: "none"
                    });
                },2000);
            }
        });
    }else{
        navigator.notification.alert('Please select a year', null, 'Error', 'OK');
    }
}

//get statement details
function statement_details(id) {
    var dataString = "s_id="+id;
    $('#statement_details').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/statement_details',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(data){
            $('#statement_details').html(data);
            setTimeout(function () {
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#my_statement_details", {
                    transition: "none"
                });
            },2000);
            
        }
    });
}

//get membership approvals (pending status list)
function message_centre() {
    var dataString = "user_id="+user_id+"&member_id="+member_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/message_centre',
        type:'POST',
        data:dataString,
        dataType:'json',
        success:function(data){
            $('#membership').after(data.member);
            $('#cont_pen').after(data.contact);
            $('#cheque_sts').after(data.cheque);
            $('#org_pen').after(data.org);
            $('#pos_pen').after(data.pos);
            $('#sms_alert').after(data.sms_alert);
        }
    });
}

function contacts_pending(id) {
    var dataString = "id="+id;
    $('#pending_approval').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/con_appr_details',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(data){
            $('#pending_approval').html(data);
            $('#pen_title').html('Pending');
            setTimeout(function () {
                $('.ajaxOverlay').hide();
                disableBack = false;
                $.mobile.changePage("#pending_details", {
                    transition: "none"
                });
            },2000);
            
        }
    });
}



function sms_alert_det(id) {
    var dataString = "id="+id;
    $('#pending_approval').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/sms_alert_details',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(data){
            $('#pending_approval').html(data);
            $('#pen_title').html('SMS Alert');
            setTimeout(function () {
                $('.ajaxOverlay').hide();
                disableBack = false;
                $.mobile.changePage("#pending_details", {
                    transition: "none"
                });
            },2000);
            
        }
    });
}

function pending_pos(id) {
    var dataString = "id="+id;
    $('#pending_approval').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/pos_appr_details',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(data){
            $('#pending_approval').html(data);
            $('#pen_title').html('Pending');
            setTimeout(function () {
                $('.ajaxOverlay').hide();
                disableBack = false;
                $.mobile.changePage("#pending_details", {
                    transition: "none"
                });
            },2000);
            
        }
    });
}


function pending_orgs(id) {
    var dataString = "id="+id;
    $('#pending_approval').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/org_appr_details',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(data){
            $('#pending_approval').html(data);
            $('#pen_title').html('Pending');
            setTimeout(function () {
                $('.ajaxOverlay').hide();
                disableBack = false;
                $.mobile.changePage("#pending_details", {
                    transition: "none"
                });
            },2000);
            
        }
    });
}


function membership_details(id) {
    var dataString = "id="+id;
    $('#pending_approval').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/membership_details',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(data){
            $('#pending_approval').html(data);
            $('#pen_title').html('Pending');
            setTimeout(function () {
                $('.ajaxOverlay').hide();
                disableBack = false;
                $.mobile.changePage("#pending_details", {
                    transition: "none"
                });
            },2000);
            
        }
    });
}

function financial_details(id) {
    var dataString = "id="+id;
    $('#pending_approval').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/financial_details',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(data){
            $('#pending_approval').html(data);
            $('#pen_title').html('Pending');
            setTimeout(function () {
                $('.ajaxOverlay').hide();
                disableBack = false;
                $.mobile.changePage("#pending_details", {
                    transition: "none"
                });
            },2000);
        }
    });
}

//get email - inbox details
function email_inbox() {
    var dataString = "user_id="+user_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/email_inbox',
        type:'POST',
        data:dataString,
        success:function(data){
            $('#email_inbox').after(data);
        }
    });
}

function mail_details(id) {
    var dataString = "id="+id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/mail_details',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(data){
            $('#message_details').html(data);
            setTimeout(function () {
                $('.ajaxOverlay').hide();
                disableBack = false;
                $.mobile.changePage("#mail_details", {
                    transition: "none"
                });
            },2000);
        }
    });
}

function member_search() {
    region = $('#select-native-1').val();
    majlis = $('#select-native-2').val();
    sur_name = $('#sur_name').val();
    if (region=="") {
        $('.search_err').html('* Please select a region');
    }else if (majlis=="") {
        $('.search_err').html('* Please select a majlis');
    }else if (sur_name=="") {
        $('.search_err').html('* Please enter a surname');
    }else if(3 > sur_name.length){
        $('.search_err').html('* Surname must be atleast 3 characters');
    }else{
        $('.search_err').html('');
         $('#recipients').html('');
        var dataString = "region="+region+"&area="+majlis+"&surname="+sur_name;
        $.ajax({
            url:'http://amisapp.ansarullah.co.uk/mobile_app/member_search',
            type:'POST',
            data:dataString,
            beforeSend:function(){
                $('.ajaxOverlay').show();
                disableBack = true;
            },
            success:function(data){
                $('#recipients').html(data);
                setTimeout(function () {
                    $('.ajaxOverlay').hide();
                    disableBack = false;
                    $.mobile.changePage("#member_list", {
                        transition: "none"
                    });
                },2000);
            }
        });
    }
}

//selected recipients
function recipients() {
    if (!$('input:checkbox[name=checkbox]').is(':checked')){
        navigator.notification.alert('Select atleast one recipients', null, 'Error', 'OK');
    }else{
        //empty an array
        while(arr.length > 0) {
            arr.pop();
        }
        //push into an array
        $('input:checkbox[name=checkbox]:checked').each(function(){
            arr.push($(this).val());
        });
        $.mobile.changePage("#reply_mail", {
            transition: "none"
        });
    }
}

//compose / reply / forward
function send_mail(){
    var subject = $('#mail_sub').val();
    var content = $('#message').val();
    var type = $('#msg_typ').val();
    var reply_id = $('#reply_id').val();
    
    if (reply_id == "" && arr.length == 0) {
        navigator.notification.alert('There is no recipients', null, 'Error', 'OK');
        $.mobile.changePage("#list_menu", {
            transition: "none"
        });
    }else if(subject==""){
        $('.reply_err').html('* Please enter subject');
    }else if(content==""){
        $('.reply_err').html('* Please enter message');
    }else{
        $('.reply_err').html('');
        //compose
        if (type==1) {
            //empty an array
            while(arr.length > 0) {
                arr.pop();
            }
            arr.push(reply_id);
        }
        var dataStr = {u_id:user_id,to_id:arr,sub:subject,text:content,sts:type};
        $.ajax({
            url:'http://amisapp.ansarullah.co.uk/mobile_app/mail_send',
            type:'POST',
            data:dataStr,
            beforeSend:function(){
                $('.ajaxOverlay').show();
                disableBack = true;
            },
            success:function(){
                setTimeout(function(){
                    $('.ajaxOverlay').hide();
                    disableBack = false;
                    navigator.notification.alert('Mail has been sent', null, 'THANK YOU!', 'OK');
                }, 2000);
                setTimeout(function(){
                    $.mobile.changePage("#list_menu", {
                        transition: "none"
                    });
                }, 3000);
            }
        });
    }
}

function recipient_select(row) {
    if ($(row).find('.user_select').is(":checked")){
        $(row).find('.user_select').attr('checked',false);
    }else{
        $(row).find('.user_select').attr('checked',true);
    }
}

//contacts start
function contact_create(sts) {
    var cr_fname = $('.cr_fname').val();
    var cr_mname = $('.cr_mname').val();
    var cr_sname = $('.cr_sname').val();
    var cr_mobile = $('.cr_mobile').val();
    var cr_mail = $('.cr_mail').val();
    var cr_flat = $('.cr_flat').val();
    var cr_house = $('.cr_house').val();
    var cr_street = $('.cr_street').val();
    var cr_locality = $('.cr_locality').val();
    var cr_town = $('.cr_town').val();
    var cr_pin = $('.cr_pin').val();
    
    var filter = /^[0-9-+]+$/;

    var regx = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;

    if (cr_fname=="") {
        navigator.notification.alert('First name required', null, 'ERROR!', 'OK');
    }else if(cr_sname==""){
        navigator.notification.alert('Surname required', null, 'ERROR!', 'OK');
    }else if(cr_mobile==""){
        navigator.notification.alert('Mobile no. required', null, 'ERROR!', 'OK');
    }else if(!filter.test(cr_mobile)){
        navigator.notification.alert('Mobile no. is not valid', null, 'ERROR!', 'OK');
    }else if(cr_mail==""){
        navigator.notification.alert('Email ID required', null, 'ERROR!', 'OK');
    }else if(!regx.test(cr_mail)){
        navigator.notification.alert('Email ID is not valid', null, 'ERROR!', 'OK');
    }else{
        $('.con_cr_err').html('');
        var con_data = 'fname='+cr_fname+'&mname='+cr_mname+'&sname='+cr_sname+
        '&mobile='+cr_mobile+'&mail='+cr_mail+'&flat='+cr_flat+'&house='+cr_house+
        '&street='+cr_street+'&locality='+cr_locality+'&town='+cr_town+'&pin='+cr_pin+
        '&sts='+sts+'&user_id='+user_id;

        $.ajax({
            url:'http://amisapp.ansarullah.co.uk/mobile_app/create_contact',
            data:con_data,
            type:'POST',
            beforeSend:function(){
                $('.ajaxOverlay').show();
                disableBack = true;
            },
            success:function(data){
                if(data==1){
                    setTimeout(function(){
                            $('.ajaxOverlay').hide();
                            disableBack = false;
                            navigator.notification.alert('Contact already exists', null, 'ERROR!', 'OK');
                        }, 2000);
                }else{
                    if(sts==1){
                        setTimeout(function(){
                            $('.ajaxOverlay').hide();
                            disableBack = false;
                            navigator.notification.alert('Contact have been submitted', null, 'THANK YOU!', 'OK');
                        }, 2000);
                    }else if(sts==2){
                        setTimeout(function(){
                            $('.ajaxOverlay').hide();
                            disableBack = false;
                            navigator.notification.alert('Contact have been saved as draft', null, 'THANK YOU!', 'OK');
                        }, 2000);
                    }
                }
                $.mobile.changePage("#contacts_menu", {
                    transition: "none"
                });
                document.getElementById("con_cr_form").reset();
            }
        });
    }
}

function condraft_list() {
    var draftList = "user_id="+user_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/draft_contacts',
        data:draftList,
        type:'POST',
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },success:function(data){
            setTimeout(function(){
                $('.ajaxOverlay').hide();
                disableBack = false;
                $('#con_draft_res').html(data);
                $.mobile.changePage("#con_draft_list", {
                    transition: "none"
                });
            }, 2000);
        }
    });
}

function condraft_details(id) {
    var draftList = "id="+id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/draft_details',
        data:draftList,
        type:'POST',
        dataType:'json',
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },success:function(data){
            setTimeout(function(){
                $('.ajaxOverlay').hide();
                disableBack = false;
                $('.dr_fname').val(data.fname);
                $('.dr_mname').val(data.mname);
                $('.dr_sname').val(data.sname);
                $('.dr_mobile').val(data.mobile);
                $('.dr_mail').val(data.mail);
                $('.dr_flat').val(data.flat);
                $('.dr_house').val(data.house);
                $('.dr_street').val(data.street);
                $('.dr_locality').val(data.locality);
                $('.dr_town').val(data.town);
                $('.dr_pin').val(data.pin);
                $('.dr_id').val(data.c_id);
                $.mobile.changePage("#con_draft_det", {
                    transition: "none"
                });
            }, 2000);
        }
    });
}

//contacts start
function contact_update(sts) {
    var dr_fname = $('.dr_fname').val();
    var dr_mname = $('.dr_mname').val();
    var dr_sname = $('.dr_sname').val();
    var dr_mobile = $('.dr_mobile').val();
    var dr_mail = $('.dr_mail').val();
    var dr_flat = $('.dr_flat').val();
    var dr_house = $('.dr_house').val();
    var dr_street = $('.dr_street').val();
    var dr_locality = $('.dr_locality').val();
    var dr_town = $('.dr_town').val();
    var dr_pin = $('.dr_pin').val();
    var dr_id = $('.dr_id').val();
    
    var filter = /^[0-9-+]+$/;

    var regx = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;

    if (dr_fname=="") {
        navigator.notification.alert('First name required', null, 'ERROR!', 'OK');
    }else if(dr_sname==""){
        navigator.notification.alert('Surname required', null, 'ERROR!', 'OK');
    }else if(dr_mobile==""){
        navigator.notification.alert('Mobile no. required', null, 'ERROR!', 'OK');
    }else if(!filter.test(dr_mobile)){
        navigator.notification.alert('Mobile no. is not valid', null, 'ERROR!', 'OK');
    }else if(dr_mail==""){
        navigator.notification.alert('Email ID required', null, 'ERROR!', 'OK');
    }else if(!regx.test(dr_mail)){
        navigator.notification.alert('Email ID is not valid', null, 'ERROR!', 'OK');
    }else{
        $('.con_dr_err').html('');
        var con_data = 'fname='+dr_fname+'&mname='+dr_mname+'&sname='+dr_sname+
        '&mobile='+dr_mobile+'&mail='+dr_mail+'&flat='+dr_flat+'&house='+dr_house+
        '&street='+dr_street+'&locality='+dr_locality+'&town='+dr_town+'&pin='+dr_pin+
        '&sts='+sts+'&con_id='+dr_id+'&user_id='+user_id;

        $.ajax({
            url:'http://amisapp.ansarullah.co.uk/mobile_app/update_contact',
            data:con_data,
            type:'POST',
            beforeSend:function(){
                $('.ajaxOverlay').show();
                disableBack = true;
            },
            success:function(data){
                if(data==1){
                    setTimeout(function(){
                            $('.ajaxOverlay').hide();
                            disableBack = false;
                            navigator.notification.alert('Contact already exists', null, 'ERROR', 'OK');
                        }, 2000);
                }else{
                    if(sts==1){
                        setTimeout(function(){
                            $('.ajaxOverlay').hide();
                            disableBack = false;
                            navigator.notification.alert('Contact have been submitted', null, 'THANK YOU!', 'OK');
                        }, 2000);
                    }else if(sts==2){
                        setTimeout(function(){
                            $('.ajaxOverlay').hide();
                            disableBack = false;
                            navigator.notification.alert('Contact have been saved as draft', null, 'THANK YOU!', 'OK'); 
                        }, 2000);
                    }
                }
                $.mobile.changePage("#contacts_menu", {
                    transition: "none"
                });
            }
        });
    }
}

function conhistory_list() {
    var draftList = "user_id="+user_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/contacts_history',
        data:draftList,
        type:'POST',
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },success:function(data){
            setTimeout(function(){
                $('.ajaxOverlay').hide();
                disableBack = false;
                $('#con_history_res').html(data);
                $.mobile.changePage("#con_history_list", {
                    transition: "none"
                });
            }, 2000);
        }
    });
}

function conhistory_details(id) {
    var dataString = "id="+id;
    $('#con_his_det').html('');
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/con_his_details',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(data){
            $('#con_his_det').html(data);
            setTimeout(function () {
                $('.ajaxOverlay').hide();
                disableBack = false;
                $.mobile.changePage("#conhis_details", {
                    transition: "none"
                });
            },2000);
            
        }
    });
}

//contacts ends
//salat times calculate
var codeDate = new Date();

function tday() {
    // TODAY Function
    codeDate = new Date;
        if (codeDate.dst() == false) {
            if(latitude){
                times = prayTime.getPrayerTimes(codeDate, latitude, longitude, 0);
            }
            msq_times = prayTime.getPrayerTimes(codeDate, 51.451808, -0.192757, 0);
    }
    else {
        if(latitude){
            times = prayTime.getPrayerTimes(codeDate, latitude, longitude, 1);
        }
      msq_times = prayTime.getPrayerTimes(codeDate, 51.451808, -0.192757, 1);   
    }

// TODAY Code to output
    
    var str = '<li class="ui-li ui-li-static ui-btn-up-c">';
        str += '<div class="ui-link-inherit"><div class="ui-grid-b">';
        str += '<div class="ui-block-a">Prayers</div>';
        str += '<div class="ui-block-b">London</div>';
        str += '<div class="ui-block-b">Location</div>';
        str += '</div></div></li>';

    if(latitude){
        var tRise = times[1];
        var tMagh = times[4];
        var newFajr = calcNewFajr(tRise,tMagh);
    }

    var msq_tRise = msq_times[1];
    var msq_tMagh = msq_times[4];
    var msq_newFajr = calcNewFajr(msq_tRise,msq_tMagh);
                
    for(var i = 0; i < 6; i++) {
        str += '<li class="ui-li ui-li-static ui-btn-up-c">';
        str += '<div class="ui-link-inherit">';
        str += '<div class="ui-grid-b">';
        str += '<div class="ui-block-a">'+ prayTime.timeNames[i]+ '</div>';
        if (i == 0) {
            if(latitude){
                times[0] = newFajr;
            }
            msq_times[0] = msq_newFajr;
        }
            str += '<div class="ui-block-b">'+ msq_times[i]+ '</div>';
        if(latitude){
            str += '<div class="ui-block-b">'+ times[i]+ '</div></div></div></li>';
        }else{
            str += '<div class="ui-block-b">0:00</div></div></div></li>';
        }
    }
    //append times to div
    $('#salat_times').html(str);
}
    // Function to make the Fajr Time a bit more accurate
    function calcNewFajr(tRise,tMagh) {
        var newFajr = '';

        // Convert Sunrise to minutes
        var rise = new Array();
        rise = tRise.split(':');
        sunriseTime = (((rise[0]*1)*60) + (rise[1]*1));

        // Convert Maghrib to minutes
        var magh = new Array();
        magh = tMagh.split(':');
        maghribTime = (((magh[0]*1)*60) + (magh[1]*1));

        // Do a few tests and adjustments
        fajrTime = (sunriseTime - 90);

        // Then convert the result to hh:mm format
        var Hours = Math.floor(fajrTime/60);
        var Minutes = fajrTime%60;
        var Time = Hours + ":" + Minutes;
        var hours = zeroPad(Hours,2);
        var mins  = zeroPad(Minutes,2);
        var newFajr  = hours + ":" + mins;

        // Return the result
        return newFajr
    }

    function zeroPad(num,count) {
        var numZeropad = num + '';
        while(numZeropad.length < count) {
            numZeropad = "0" + numZeropad;
        }
        return numZeropad;
    }

// these two Date prototype function added from http://javascript.about.com/library/bldst.htm
    Date.prototype.stdTimezoneOffset = function() {
        var jan = new Date(this.getFullYear(), 0, 1);
        var jul = new Date(this.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    Date.prototype.dst = function() {
        return this.getTimezoneOffset() < this.stdTimezoneOffset();
    }


$(document).on('click','.org-view-btn',function(){
    var oe_id = $(this).attr('data-id');
    var oe_name = $(this).attr('data-n');
    var oe_tym = $(this).attr('data-t');
    window.localStorage.setItem("oe_id", oe_id);
    $('.org-ev-title').html(oe_name);
    $('.org-ev-tym').html(oe_tym);
    $.mobile.changePage("#orgView", {transition: "none"});
});

$(document).on('click','.oc-btn',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/get_chart_img',
        type:'POST',
        data:dataString,
        dataType:'json',
        beforeSend:function(){
            $('.panzoom').attr('src','');
            $('.tbl_by_lvl').html('');
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(res){
            $('.panzoom').attr('src',res.chart);
            $('.tbl_by_lvl').html(res.level);
            setTimeout(function () {
                $('.ajaxOverlay').hide();
                disableBack = false;
                $.mobile.changePage("#org_chart", {
                    transition: "none"
                });
            },2000);     
        }
    });
});

$(document).on('click','.oc-chbtn',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/get_child_chart',
        type:'POST',
        data:dataString,
        dataType:'json',
        beforeSend:function(){
            $('.panzoom').attr('src','');
            $('.tbl_by_lvl').html('');
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(res){
			$("#inverted-containch").empty();
			if(res.chart){
			for(var i=0;i<res.chart.length;i++){
				$("#inverted-containch").append('<div class="panzoom-parent"><img class="panzoom" src="'+res.chart[i]+'" ><div class="zoomInOn"></div>                <div class="zoomOutOff"></div></div><br />');
			}
			}else{
				$("#inverted-containch").append('<div>No Child Charts</div>');
			}
           // $('.panzoom').attr('src',res.chart);
            $('.tbl_by_lvl').html(res.level);
            setTimeout(function () {
                $('.ajaxOverlay').hide();
                disableBack = false;
                $.mobile.changePage("#child_chart", {
                    transition: "none"
                });
            },2000);     
        }
    });
});

(function() {
    var $section = $('#inverted-contain');
    $section.find('.panzoom').panzoom({
    $zoomIn: $section.find(".zoomInOn"),
    $zoomOut: $section.find(".zoomOutOff"),
    $reset: $section.find(".reset"),
    startTransform: 'scale(1.1)',
    increment: 0.1,
    minScale: 1,
    contain: 'invert'
    }).panzoom('zoom');
})();

$(document).on('click','.zoomInOn',function(){
	var $section = $(this).parent();
    $section.find('.panzoom').panzoom({
    $zoomIn: $section.find(".zoomInOn"),
    $zoomOut: $section.find(".zoomOutOff"),
    $reset: $section.find(".reset"),
    startTransform: 'scale(1.1)',
    increment: 0.1,
    minScale: 1,
    contain: 'invert'
    }).panzoom('zoom');
});

$(document).on('click','.oc-docs',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/get_docs_path',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(res){
            if(res==""){
                $('.ajaxOverlay').hide();
                disableBack = false;
                navigator.notification.alert('There is no documents', null, 'Error!', 'OK'); 
            }else{
                downloadFile(res);
            }
        }
    });
});

$(document).on('click','.oc-meetings',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/get_meetings',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('#meetings_list_all').nextAll().remove();
        },
        success:function(res){
            $('#meetings_list_all').after(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#meetings-list", {
                    transition: "none"
                });
            }, 2000);
        }
    });
});

$(document).on('click','.meetings_view',function(){
    var m_id = $(this).attr('data-id');
    var dataString = "meetings_id="+m_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/meetings_view',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('#details_meetings').html('');
        },
        success:function(res){
            $('#details_meetings').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#meetings_details", {
                    transition: "none"
                });
            }, 2000);
        }
    });
});

$(document).on('click','.oc-task',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id+"&asigned_to="+user_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/get_tasks',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('#task_list_all').nextAll().remove();
        },
        success:function(res){
            $('#task_list_all').after(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#task-list", {
                    transition: "none"
                });
            }, 2000);
        }
    });
});

$(document).on('click','.task_view',function(){
    var m_id = $(this).attr('data-id');
    var dataString = "task_id="+m_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/task_view',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('#details_task').html('');
        },
        success:function(res){
            $('#details_task').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#task_details", {
                    transition: "none"
                });
            }, 2000);
        }
    });
});

$(document).on('click','.oc-finance',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/get_financial',
        type:'POST',
        data:dataString,
        dataType:'json',
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('#financial_list_int').nextAll().remove();
            $('#financial_list_ext').nextAll().remove();
        },
        success:function(res){
            $('#financial_list_int').after(res.int);
            $('#financial_list_ext').after(res.ext);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#financial-list", {
                    transition: "none"
                });
            }, 2000);
        }
    });
});

$(document).on('click','.financial_internal',function(){
    var m_id = $(this).attr('data-id');
    var dataString = "int_id="+m_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/financial_internal',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('#details_financial').html('');
        },
        success:function(res){
            $('#details_financial').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#financial_details", {
                    transition: "none"
                });
            }, 2000);
        }
    });
});

$(document).on('click','.financial_external',function(){
    var m_id = $(this).attr('data-id');
    var dataString = "ext_id="+m_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/financial_external',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('#details_financial').html('');
        },
        success:function(res){
            $('#details_financial').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#financial_details", {
                    transition: "none"
                });
            }, 2000);
        }
    });
});


$(document).on('click','.oc-reports',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/get_opt_meeting',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('#opt_meeting').html('');
        },
        success:function(res){
            $('#opt_meeting').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#event_reports", {
                    transition: "none"
                });
            }, 2000);
        }
    });
});

$(document).on('click','.report_btn',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var meeting_id = $('#opt_meeting').val();
    var rpt_type = $(this).attr('data-typ');
    var dataString = "event_id="+event_id+"&meeting_id="+meeting_id+"&rpt_type="+rpt_type;
    if(meeting_id!=""){
        $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/meeting_report_pdf',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
        },
        success:function(res){
            $('.ajaxOverlay').hide();
            if(res==""){
                disableBack = false;
                navigator.notification.alert('There is no reports', null, 'Error!', 'OK'); 
            }else{
                downloadFile(res);
            }
        }
    });
    }else{
        navigator.notification.alert('Please select the meeting', null, 'Error!', 'OK');
    }
});  

$(document).on('click','.action_point',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id+"&mem_id="+user_id+"&ap_sts=1";
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/my_action_points',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('.my_ap_tbl').html('');
        },
        success:function(res){
            $('.my_ap_tbl').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#my_ap",{transition: "none"});
            }, 2000);
        }
    });
});

$(document).on('click','.my_team_ap',function(){
    var event_id = window.localStorage.getItem("oe_id");
    //user_id
    var dataString = "event_id="+event_id+"&mem_id="+user_id+"&ap_sts=1";
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/ap_team_all',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('.my_team_ap_tbl').html('');
        },
        success:function(res){
            $('.my_team_ap_tbl').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#my_team_ap",{transition: "none"});
            }, 2000);
        }
    });
});

$(document).on('click','.all_ap',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id+"&mem_id=0&ap_sts=1";
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/ap_team_all',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('.all_ap_tbl').html('');
        },
        success:function(res){
            $('.all_ap_tbl').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#all_ap",{transition: "none"});
            }, 2000);
        }
    });
});


$(document).on('click','.ap-task',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id+"&mem_id="+user_id+"&ap_sts=2";
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/my_action_points',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('.my_task_tbl').html('');
        },
        success:function(res){
            $('.my_task_tbl').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#my_task",{transition: "none"});
            }, 2000);
        }
    });
});

$(document).on('click','.my_team_task',function(){
    var event_id = window.localStorage.getItem("oe_id");
    //user_id
    var dataString = "event_id="+event_id+"&mem_id="+user_id+"&ap_sts=2";
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/ap_team_all',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('.my_team_task_tbl').html('');
        },
        success:function(res){
            $('.my_team_task_tbl').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#my_team_task",{transition: "none"});
            }, 2000);
        }
    });
});

$(document).on('click','.all_task',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id+"&mem_id=0&ap_sts=2";
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/ap_team_all',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('.all_task_tbl').html('');
        },
        success:function(res){
            $('.all_task_tbl').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#all_task",{transition: "none"});
            }, 2000);
        }
    });
});

$(document).on('click','.red-book',function(){
    var event_id = window.localStorage.getItem("oe_id");
    var dataString = "event_id="+event_id;
    $.ajax({
        url:'http://amisapp.ansarullah.co.uk/mobile_app/events_red_books',
        type:'POST',
        data:dataString,
        beforeSend:function(){
            $('.ajaxOverlay').show();
            disableBack = true;
            $('.red_book_tbl').html('');
        },
        success:function(res){
            $('.red_book_tbl').html(res);
            setTimeout(function(){
                disableBack = false;
                $('.ajaxOverlay').hide();
                $.mobile.changePage("#red_book",{transition: "none"});
            }, 2000);
        }
    });
});

var folderName = 'event documents';
var fileName;

function downloadFile(URL) {
    //step to request a file system 
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

    function fileSystemSuccess(fileSystem) {
        var download_link = encodeURI(URL);
        fileName = download_link.substr(download_link.lastIndexOf('/') + 1); //Get filename of URL
        var directoryEntry = fileSystem.root; // to get root path of directory
        directoryEntry.getDirectory(folderName, {
            create: true,
            exclusive: false
        }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
        var rootdir = fileSystem.root;
        var fp = fileSystem.root.toURL(); // Returns Fullpath of local directory
        fp = fp + "/" + folderName + "/" + fileName; // fullpath and name of the file which we want to give
        // download function call
        filetransfer(download_link, fp);
    }
    function onDirectorySuccess(parent) {
        // Directory created successfuly
    }
    function onDirectoryFail(error) {
        //Error while creating directory
        $('.ajaxOverlay').hide();
        disableBack = false;
        //alert("Unable to create new directory: " + error.code);
        navigator.notification.alert("Unable to create new directory: " + error.code, null, 'Error!', 'OK');

    }
    function fileSystemFail(evt) {
        //Unable to access file system
        $('.ajaxOverlay').hide();
        disableBack = false;
        //alert(evt.target.error.code);
        navigator.notification.alert(evt.target.error.code, null, 'Error!', 'OK');
    }
}

function filetransfer(download_link, fp) {
    var fileTransfer = new FileTransfer();
    // File download function with URL and local path
    fileTransfer.download(download_link, fp,
        function(entry) {
            $('.ajaxOverlay').hide();
            disableBack = false;
            //alert("download complete: " + entry.fullPath);
            navigator.notification.alert("Download complete: " + entry.fullPath, null, 'Success!', 'OK');
        },
        function(error) {
            //Download abort errors or download failed errors
            $('.ajaxOverlay').hide();
            disableBack = false;
            //alert("download error source " + error.source);
            navigator.notification.alert("Download error source " + error.source, null, 'Error!', 'OK');
        }
    );
}