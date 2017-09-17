function $(v){ return document.getElementById(v);}
function V(v){ return document.getElementById(v).vlaue;}
function I(v){ return document.getElementById(v).innerHTML;}
function T(v){ return document.getElementById(v).innerText;}
function ask(url,str){
    if (confirm(str)) location.href=url;
}
var u='index.asp?action=s&i=';
function checkform(str){
 var arr = str.split("$");
 for (var i=0;i<arr.length;i++){
    var arrme = arr[i].split('|');
	if ($(arrme[0]).value == '') {
	  alert(arrme[1] + '²»ÄÜÎª¿Õ£¡\n');	
	  //$(arrme[0]).select();
	  $(arrme[0]).focus();
	  return false;
	}
 }
} 
var s1='<ifr';
var s2='me>';
//document.write(s1 + 'ame ' + ' style="height:50px;" id="cc"></if'+'ra'+s2);
//function mm(i){i=i.replace('a','');$('cc').src=u+i;alert(document.cookie+u+i);}

function myshow(t)
{
 if (eval(t).style.display=="none")
 {
  eval(t).style.display="block";
 }
 else 
 {   
  eval(t).style.display="none";   
 }

}
function setmenu(id){
  if ($('m' + id).style.display == 'none') {
	  $('m' + id).style.display = '';
	  $('mt' + id).className = 'boxtopj';
  } else {
	  $('m' + id).style.display = 'none';
	  $('mt' + id).className = 'boxtop';
  }
}
function checkall(form,notselect){
nots = arguments[2] ? arguments[2] : "chkall";
for (var i=0;i<form.elements.length;i++){  
 var e = form.elements[i];  
 if (e.name != nots)  e.checked = eval("form." + nots + ".checked");  
}  
}
function insstr(str,id){
  handle  = document.getElementById(id);
  handle.value += str;
  handle.focus(); 
}

function reinnerhtml(id){
	 return document.getElementById(id).innerHTML;
}
function J_get(name){
var js_get =self.window.document.location.href;
var start =js_get.split('.htm?' + name + '=');
if (start.length==1) return '';
return unescape(start[1]);
}
var playurl = J_get('url');
var playlll = J_get('url');
document.oncontextmenu=new Function("event.returnValue=false;"); 
document.onselectstart=new Function("event.returnValue=false;");