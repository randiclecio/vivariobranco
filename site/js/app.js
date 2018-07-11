M.AutoInit();
var deb = $("deb");

var urls = './';
function urlreplace() {
	"index.html" == window.location.href.split("/")[4] && window.history.pushState("object or string", "Title", "./");
	if(window.location.href.split("/")[2]!='localhost'){
		deb.remove();
		if(window.location.href.split("/")[0]=='http:'){
			location.href = 'https://vivariobranco.com.br';
		}
	}
}
function resize() {
	var a = $("#topo .midle").outerWidth();
	b = $(document).width();
	var squad = $("img.squad").outerWidth();
	squad = (squad/4)*3;
	$("img.squad").css({
		height: squad
	});
	deb.is(":visible") && deb.html("f."+b+" - m."+a);
}
$(window).resize(function () {
	resize();
});
$(document).ready(function () {
	//localStorage.clear();
	urlreplace();
	resize();
	slider();
	galeria();
	datas();
	notificacoes();
});
function today(){
	var data = new Date();
	var dia     = data.getDate();
	var mes     = data.getMonth();
	var ano4    = data.getFullYear();
	return str_data = ano4+(mes+1)+dia;
}
function galeria(){
	if(!localStorage.getItem('galeria')){
		var url = "https://vivariobranco.com.br/api/galeria.php";
		fetch(url, { method:'GET' }, {mode:'no-cors'}).then(response => response.json()).then(dados => {
			var li = '';
			for(var k in dados) {
				li += `<img src="thumb/galerias/`+dados[k]["ga_img"]+`" class="squad" alt="`+dados[k]["ga_alt"]+`">`;
			}
			localStorage.setItem('galeria', li)
			$('#galeria').html(localStorage.getItem('galeria'));
		}).catch(err => {})	
		
	}else{
		$('#galeria').html(localStorage.getItem('galeria'));
	}
}

function datas(){
	var sem		= new Array('Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sabado');
	var li = '';
	var dat		= new Date();
	var data	= new Date();
	for(i=0; i<=6; i++){
		data.setDate(dat.getDate()+i);
		var dsm     = data.getDay();
		var dia     = data.getDate();
		var mes     = data.getMonth()+1;
		if(mes<10){mes='0'+mes;}
		var ano		= data.getFullYear();
			li += '<li><a data-events="'+dia+'/'+(mes)+'/'+ano+'">'+sem[dsm]+' <span>'+dia+'/'+(mes)+'/'+ano+'</span><i></i></a></li>';		
	}
	$(".datas ul").html(li);
}

function agenda(data,upd){
	if(upd.length!='0'){ updt = upd; }else{ updt = 'null'; }
	var dt = "#events .evento[data-evento='"+data+"']";
	var url = 'https://vivariobranco.com.br/api/eventos.php?data='+data+'&upd='+updt;
	
	fetch(url, { method:'GET' }, {mode:'no-cors'}).then(response =>
		response.json()).then(dados => {
			if(dados.ev_id==-1){
				M.toast({html: 'Desculpe nenhum evento para está data!'})
			}else{
				if($(dt).length){
					for(var k in dados) {
						$(dt+" li.tab[data-id='"+dados[k]['ev_id']+"']").remove();
						$(dt+" div.event[data-id='"+dados[k]['ev_id']+"']").remove();
					}
					for(var k in dados) {
						$(dt+" ul.tabs").append('<li class="tab" data-id="'+dados[k]['ev_id']+'" data-update="'+dados[k]['ev_update']+'"><a href="event-'+dados[k]['ev_id']+'">'+dados[k]['ev_hora']+'</a></li>');
						$(dt+" div.list").append('<div id="event-'+dados[k]['ev_id']+'" class="event" data-update="'+dados[k]['ev_update']+'"><h2>'+dados[k]['ev_nome']+'</h2><p class="data">'+dados[k]['ev_data']+' - '+dados[k]['ev_hora']+'</p><p class="local">'+dados[k]['ev_local']+'</p><div class="texto">'+dados[k]['ev_texto']+'</div></div>');
					}
					$("#events .evento[data-evento='"+data+"']").show(300);
				}else{
					html  = '<div class="evento" data-evento="'+data+'">';
					html += '<button class="sair" data-event="'+data+'">X</button>';
					html += '<div class="events" data-events="'+data+'">';
					html +=     '<ul id="tabs-swipe-demo" class="tabs">';
					for(var k in dados) {
						html +=    '<li class="tab" data-id="'+dados[k]['ev_id']+'" data-update="'+dados[k]['ev_update']+'">';
						html +=        '<a href="event-'+dados[k]['ev_id']+'">'+dados[k]['ev_hora']+'</a>';
						html +=    '</li>';
					}
					html +=     '</ul>';
					html += 	'<div class="list">';
					for(var k in dados) {
						html +=    '<div id="event-'+dados[k]['ev_id']+'" class="event" data-update="'+dados[k]['ev_update']+'">';
						html +=        '<h2>'+dados[k]['ev_nome']+'</h2>';
						html +=        '<p class="data">'+dados[k]['ev_data']+' - '+dados[k]['ev_hora']+'</p>';
						html +=        '<p class="local">'+dados[k]['ev_local']+'</p>';
						html +=        '<div class="texto">'+dados[k]['ev_texto']+'</div>';
						html +=    '</div>';
					}
					html +=    '</div>';
					html += '</div>';
					html += '</div>';				
					$("#events").append(html);
					$("#events .evento[data-evento='"+data+"']").show(300);
				}
				var events = $("#events").html();
				localStorage.setItem('events', events);
			}
		}).catch(err => {})	
}
$(".datas").on("click","a",function(){
	var data = $(this).attr("data-events");
	var upd = new Array; i=0;
	$("#events .events[data-events='"+data+"'] ul li.tab").each(function(){
		upd[i] = $(this).attr('data-update');
		i++;
	});
	agenda(data,upd);
});
$("#events").on("click",".tab a",function(){
	var id = $(this).attr('href');
	$("#events .list .event").fadeOut(0);
	$("#events .list .event#"+id).fadeIn(200);
	return false;
});
$("#events").on("click","button.sair",function(){
	var event = $(this).attr('data-event');
	$("#events .evento[data-evento='"+event+"']").hide();
});

function slideIn(){	
	var sliders = $('#slider');
	sliders.owlCarousel({
		margin: 0,
		items: 1,
		nav: false,
		autoplay: 5000,
		loop: true,
		smartSpeed: 3000,
		dotsEach: true,
	});
}
function slideNew(){
	var url = 'https://vivariobranco.com.br/api/slider.php';
	fetch(url, { method:'GET' }, {mode:'no-cors'})
      .then(response => response.json()).then(res => {
			var i=0;
			for(var k in res){
				if(!$("#slider figure[data-id='"+res[k]["is_img"]+"']").length){
					i++;
				}
			}
			if(i>0){
				$('#slider').owlCarousel('destroy');
				$('#slider').html('');
				htmlr = '';		
				for(var k in res){
					for(var k in res){
						htmlr += '<figure data-id="'+res[k]["is_img"]+'">';
						htmlr += 	'<img class="img" src="https://vivariobranco.com.br/files/slider/'+res[k]["is_img"]+'" alt="'+res[k]["is_nome"]+'">';
						htmlr += 	'<h1>'+res[k]["is_nome"]+'</h1>';
						htmlr += '</figure>';
					}
				}
				$('#slider').html(htmlr);
				localStorage.setItem('slider', htmlr);
				slideIn();
			}
    }).catch(err => {})		
}
function slider(){
	if(!localStorage.getItem('slider')){
		slideNew();
	}else{
		$('#slider').html(localStorage.getItem('slider'));
		slideIn();
		slideNew();
	}
}
var stop = setInterval(function(){ 
	slideNew();
	notificacoes();
}, 60000);



function notif(icon,title,mensagem,link,id){
	if(Notification.permission!=="granted"){
		Notification.requestPermission()
	}else{
		var n = new Notification(title, {
			icon: icon,
			body: mensagem,
			vibrate: [100,50,100]
		})
		n.onclick = function(){
			window.open(link);
		}
		localStorage.setItem('notificacoes', id)
		/*setTimeout(function(){
			n.close()
		},3000)*/
	}
}


	
if(window.Notification&&Notification.permission!=="denied"){
	Notification.requestPermission(function(status){})
}

function notificacoes(){
	var url = urls+'https://vivariobranco.com.br/api/notificacoes.php';
    fetch(url).then(response => response.json()).then(dados => {
		if(dados.ev_id!=-1){
			if(localStorage.getItem('notificacoes')!=dados.ev_id){
				var txt		= dados.ev_txt;
				var img		= './files/icons/icon_192x192.png';
				var nome	= dados.ev_nome;
				var link	= './';
				setTimeout(function(){
					notif(img,nome,txt,link,dados.ev_id)
				},3000)
			}
		}
	})
	.catch(err => {})
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
    	navigator.serviceWorker.register('./sw.js')
		.then(function (registration) {
    		// Registration was successful
    		//console.log('ServiceWorker registration successful with scope: ', registration.scope);
    	}).catch(function (err) {
    		// registration failed :(
    		//console.log('ServiceWorker registration failed: ', err);
    	});
    });
}

if(navigator.share !== undefined){
	document.addEventListener('DOMContentLoaded', e =>{
		let shareBtn = document.getElementById('share')
		shareBtn.addEventListener('click', e =>{
			navigator.share({
				title: document.title,
				text: 'Olar sou um conteúdo para compartilhar',
				url: window.location.href
			})
			.then()
			.catch()
		})
	})
}

if('serviceWorker' in navigator && 'SyncManager' in window){
	function registerBGSync(){
		navigator.serviceWorker.ready
		.then(registration => {
			return registration.sync.register('galeria')
			.then(() => console.log('sincronização feita'))
			.catch(err => console.log('falou a sincronização', err))
		})
	}
}


