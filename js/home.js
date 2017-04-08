var codeDate = new Date();
$(document).ready(function(e) {
	latitude = window.localStorage.getItem("latitude");
    longitude = window.localStorage.getItem("longitude");
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
    
    var str = '';

    if(latitude){
        var tRise = times[1];
        var tMagh = times[4];
        var newFajr = calcNewFajr(tRise,tMagh);
    }

    var msq_tRise = msq_times[1];
    var msq_tMagh = msq_times[4];
    var msq_newFajr = calcNewFajr(msq_tRise,msq_tMagh);
                
    for(var i = 0; i < 6; i++) {
        
        str += '<div class="w-row list-message"><div class="w-col w-col-tiny-5"><div class="message-title">'+ prayTime.timeNames[i]+ '</div></div>';
        if (i == 0) {
            if(latitude){
                times[0] = newFajr;
            }
            msq_times[0] = msq_newFajr;
        }
            str += '<div class="w-col w-col-tiny-3"><div class="message-title">'+ msq_times[i]+ '</div></div>';
        if(latitude){
            str += '<div class="w-col w-col-tiny-3"><div class="message-title">'+ times[i]+ '</div></div></div>';
        }else{
            str += '<div class="w-col w-col-tiny-3"><div class="message-title">0:00</div></div></div>';
        }
    }
	$(".salat-times").append(str);
  /*  $(".salat-times").append('<div class="w-row list-message"><div class="w-col w-col-5 w-col-small-5 w-col-tiny-5 n-p-l"><div class="message-title">dfg</div></div><div class="w-col w-col-3 w-col-small-3 w-col-tiny-3"><div class="message-title">dfg</div></div><div class="w-col w-col-2 w-col-small-2 w-col-tiny-2 n-p-r"><div class="message-title">dfg</div></div></div>');*/
});

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