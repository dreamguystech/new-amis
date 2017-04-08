function PrayTime(){this.Jafari=0;this.Karachi=1;this.ISNA=2;this.MWL=3;this.Makkah=4;this.Egypt=5;this.Custom=6;this.Tehran=7;this.Shafii=0;this.Hanafi=1;this.None=0;this.MidNight=1;this.OneSeventh=2;this.AngleBased=3;this.Time24=0;this.Time12=1;this.Time12NS=2;this.Float=3;this.timeNames=new Array('Fajr','Sunrise','Zuhr','Asr','Maghrib','Ishaa');this.InvalidTime='-----';this.calcMethod=2;this.asrJuristic=0;this.zuhrMinutes=0;this.maghribMinutes=6;this.adjustHighLats=1;this.timeFormat=0;var lat;var lng;var timeZone;var JDate;this.numIterations=1;this.methodParams=new Array();this.methodParams[this.Jafari]=new Array(16,0,4,0,14);this.methodParams[this.Karachi]=new Array(18,1,0,0,18);this.methodParams[this.ISNA]=new Array(15,1,0,1,90);this.methodParams[this.MWL]=new Array(18,1,0,0,17);this.methodParams[this.Makkah]=new Array(18.5,1,0,1,90);this.methodParams[this.Egypt]=new Array(19.5,1,0,0,17.5);this.methodParams[this.Tehran]=new Array(17.7,0,4.5,0,15);this.methodParams[this.Custom]=new Array(18,1,0,0,17);}
PrayTime.prototype.getDatePrayerTimes=function(year,month,day,latitude,longitude,timeZone){this.lat=latitude;this.lng=longitude;this.timeZone=this.effectiveTimeZone(year,month,day,timeZone);this.JDate=this.julianDate(year,month,day)-longitude/(15*24);return this.computeDayTimes();}
PrayTime.prototype.getPrayerTimes=function(date,latitude,longitude,timeZone){return this.getDatePrayerTimes(date.getFullYear(),date.getMonth()+1,date.getDate(),latitude,longitude,timeZone);}
PrayTime.prototype.setCalcMethod=function(methodID){this.calcMethod=methodID;}
PrayTime.prototype.setAsrMethod=function(methodID){if(methodID<0||methodID>1)
return;this.asrJuristic=methodID;}
PrayTime.prototype.setFajrAngle=function(angle){this.setCustomParams(new Array(angle,null,null,null,null));}
PrayTime.prototype.setMaghribAngle=function(angle){this.setCustomParams(new Array(null,0,angle,null,null));}
PrayTime.prototype.setIshaaAngle=function(angle){this.setCustomParams(new Array(null,null,null,0,angle));}
PrayTime.prototype.setZuhrMinutes=function(minutes){this.zuhrMinutes=minutes;}
PrayTime.prototype.setMaghribMinutes=function(minutes){this.setCustomParams(new Array(null,1,minutes,null,null));}
PrayTime.prototype.setIshaaMinutes=function(minutes){this.setCustomParams(new Array(null,null,null,1,minutes));}
PrayTime.prototype.setCustomParams=function(params){for(var i=0;i<5;i++){if(params[i]==null)
this.methodParams[this.Custom][i]=this.methodParams[this.calcMethod][i];else
this.methodParams[this.Custom][i]=params[i];}
this.calcMethod=this.Custom;}
PrayTime.prototype.setHighLatsMethod=function(methodID){this.adjustHighLats=methodID;}
PrayTime.prototype.setTimeFormat=function(timeFormat){this.timeFormat=timeFormat;}
PrayTime.prototype.floatToTime24=function(time){if(isNaN(time))
return this.InvalidTime;time=this.fixhour(time+0.5/ 60);var hours=Math.floor(time);var minutes=Math.floor((time-hours)*60);return this.twoDigitsFormat(hours)+':'+this.twoDigitsFormat(minutes);}
PrayTime.prototype.floatToTime12=function(time,noSuffix){if(isNaN(time))
return this.InvalidTime;time=this.fixhour(time+0.5/ 60);var hours=Math.floor(time);var minutes=Math.floor((time-hours)*60);var suffix=hours>=12?' pm':' am';hours=(hours+12-1)%12+1;return hours+':'+this.twoDigitsFormat(minutes)+(noSuffix?'':suffix);}
PrayTime.prototype.floatToTime12NS=function(time){return this.floatToTime12(time,true);}
PrayTime.prototype.sunPosition=function(jd){var D=jd-2451545.0;var g=this.fixangle(357.529+0.98560028*D);var q=this.fixangle(280.459+0.98564736*D);var L=this.fixangle(q+1.915*this.dsin(g)+0.020*this.dsin(2*g));var R=1.00014-0.01671*this.dcos(g)-0.00014*this.dcos(2*g);var e=23.439-0.00000036*D;var d=this.darcsin(this.dsin(e)*this.dsin(L));var RA=this.darctan2(this.dcos(e)*this.dsin(L),this.dcos(L))/ 15;RA=this.fixhour(RA);var EqT=q/15-RA;return new Array(d,EqT);}
PrayTime.prototype.equationOfTime=function(jd){return this.sunPosition(jd)[1];}
PrayTime.prototype.sunDeclination=function(jd){return this.sunPosition(jd)[0];}
PrayTime.prototype.computeMidDay=function(t){var T=this.equationOfTime(this.JDate+t);var Z=this.fixhour(12-T);return Z;}
PrayTime.prototype.computeTime=function(G,t){var D=this.sunDeclination(this.JDate+t);var Z=this.computeMidDay(t);var V=1/15*this.darccos((-this.dsin(G)-this.dsin(D)*this.dsin(this.lat))/(this.dcos(D)*this.dcos(this.lat)));return Z+(G>90?-V:V);}
PrayTime.prototype.computeAsr=function(step,t){var D=this.sunDeclination(this.JDate+t);var G=-this.darccot(step+this.dtan(Math.abs(this.lat-D)));return this.computeTime(G,t);}
PrayTime.prototype.computeTimes=function(times){var t=this.dayPortion(times);var Fajr=this.computeTime(180-this.methodParams[this.calcMethod][0],t[0]);var Sunrise=this.computeTime(180-0.833,t[1]);var Zuhr=this.computeMidDay(t[2]);var Asr=this.computeAsr(1+this.asrJuristic,t[3]);var Maghrib=this.computeTime(0.833,t[4]);;var Ishaa=this.computeTime(this.methodParams[this.calcMethod][4],t[5]);return new Array(Fajr,Sunrise,Zuhr,Asr,Maghrib,Ishaa);}
PrayTime.prototype.computeDayTimes=function(){var times=new Array(5,6,12,13,18,18);for(var i=1;i<=this.numIterations;i++)
times=this.computeTimes(times);times=this.adjustTimes(times);return this.adjustTimesFormat(times);}
PrayTime.prototype.adjustTimes=function(times){for(var i=0;i<7;i++)
times[i]+=this.timeZone-this.lng/ 15;times[2]+=this.zuhrMinutes/ 60;if(this.methodParams[this.calcMethod][1]==1)
times[5]=times[4]+this.methodParams[this.calcMethod][2]/ 60;if(this.methodParams[this.calcMethod][3]==1)
times[5]=times[4]+this.methodParams[this.calcMethod][4]/ 60;if(this.adjustHighLats!=this.None)
times=this.adjustHighLatTimes(times);return times;}
PrayTime.prototype.adjustTimesFormat=function(times){if(this.timeFormat==this.Float)
return times;for(var i=0;i<7;i++)
if(this.timeFormat==this.Time12)
times[i]=this.floatToTime12(times[i]);else if(this.timeFormat==this.Time12NS)
times[i]=this.floatToTime12(times[i],true);else
times[i]=this.floatToTime24(times[i]);return times;}
PrayTime.prototype.adjustHighLatTimes=function(times){var nightTime=this.timeDiff(times[4],times[1]);var FajrDiff=this.nightPortion(this.methodParams[this.calcMethod][0])*nightTime;if(isNaN(times[0])||this.timeDiff(times[0],times[1])>FajrDiff)
times[0]=times[1]-FajrDiff;var IshaaAngle=(this.methodParams[this.calcMethod][3]==0)?this.methodParams[this.calcMethod][4]:18;var IshaaDiff=this.nightPortion(IshaaAngle)*nightTime;if(isNaN(times[6])||this.timeDiff(times[4],times[6])>IshaaDiff)
times[6]=times[4]+IshaaDiff;var MaghribAngle=(this.methodParams[this.calcMethod][1]==0)?this.methodParams[this.calcMethod][2]:4;var MaghribDiff=this.nightPortion(MaghribAngle)*nightTime;if(isNaN(times[5])||this.timeDiff(times[4],times[5])>MaghribDiff)
times[5]=times[4]+MaghribDiff;return times;}
PrayTime.prototype.nightPortion=function(angle){if(this.adjustHighLats==this.AngleBased)
return 1/60*angle;if(this.adjustHighLats==this.MidNight)
return 1/2;if(this.adjustHighLats==this.OneSeventh)
return 1/7;}
PrayTime.prototype.dayPortion=function(times){for(var i=0;i<7;i++)
times[i]/=24;return times;}
PrayTime.prototype.timeDiff=function(time1,time2){return this.fixhour(time2-time1);}
PrayTime.prototype.twoDigitsFormat=function(num){return(num<10)?'0'+num:num;}
PrayTime.prototype.julianDate=function(year,month,day){if(month<=2)
{year-=1;month+=12;}
var A=Math.floor(year/ 100);var B=2-A+Math.floor(A/ 4);var JD=Math.floor(365.25*(year+4716))+Math.floor(30.6001*(month+1))+day+B-1524.5;return JD;}
PrayTime.prototype.calcJD=function(year,month,day){var J1970=2440588.0;var date=new Date(year,month-1,day);var ms=date.getTime();var days=Math.floor(ms/(1000*60*60*24));return J1970+days-0.5;}
PrayTime.prototype.getTimeZone=function(date){var localDate=new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);var GMTString=localDate.toGMTString();var GMTDate=new Date(GMTString.substring(0,GMTString.lastIndexOf(' ')-1));var hoursDiff=(localDate-GMTDate)/(1000*60*60);return hoursDiff;}
PrayTime.prototype.getBaseTimeZone=function(){return this.getTimeZone(new Date(2000,0,15))}
PrayTime.prototype.detectDaylightSaving=function(date){return this.getTimeZone(date)!=this.getBaseTimeZone();}
PrayTime.prototype.effectiveTimeZone=function(year,month,day,timeZone){if(timeZone==null||typeof(timeZone)=='undefined'||timeZone=='auto')
timeZone=this.getTimeZone(new Date(year,month-1,day));return 1*timeZone;}
PrayTime.prototype.dsin=function(d){return Math.sin(this.dtr(d));}
PrayTime.prototype.dcos=function(d){return Math.cos(this.dtr(d));}
PrayTime.prototype.dtan=function(d){return Math.tan(this.dtr(d));}
PrayTime.prototype.darcsin=function(x){return this.rtd(Math.asin(x));}
PrayTime.prototype.darccos=function(x){return this.rtd(Math.acos(x));}
PrayTime.prototype.darctan=function(x){return this.rtd(Math.atan(x));}
PrayTime.prototype.darctan2=function(y,x){return this.rtd(Math.atan2(y,x));}
PrayTime.prototype.darccot=function(x){return this.rtd(Math.atan(1/x));}
PrayTime.prototype.dtr=function(d){return(d*Math.PI)/ 180.0;}
PrayTime.prototype.rtd=function(r){return(r*180.0)/ Math.PI;}
PrayTime.prototype.fixangle=function(a){a=a-360.0*(Math.floor(a / 360.0));a=a<0?a+360.0:a;return a;}
PrayTime.prototype.fixhour=function(a){a=a-24.0*(Math.floor(a / 24.0));a=a<0?a+24.0:a;return a;}
var prayTime=new PrayTime();