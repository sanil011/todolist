 //jshint esversion:6


module.exports = function (){
var today = new Date();
var option = {
    weekday: "long",
    day : "numeric",
    month : "long"
} ;
var day= today.toLocaleDateString("en-us",option);
return day;
}
