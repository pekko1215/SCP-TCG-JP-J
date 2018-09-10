var socket = io();

var name = prompt();
var userData = {name};
var sandBox = null;
var matching = false;
const observer = riot.observable();

socket.emit('regist',name,(data)=>{
	userData.id = data.id;
	var doms = data.list.filter(d=>d.id!=data.id).map(d=>{
		var e = document.createElement('h3');
		e.innerText = d.name;
		e.addEventListener('click',()=>{
			socket.emit('match',d.id);
		})
		document.getElementById('roomList').appendChild(e);
	})
})

function initializeBattleUI(){
	var k = document.getElementById('roomSelect');
	k.style.display = 'none';
	// document.getElementById('game').style.display = '';
	riot.mount('*')
	observer.trigger('refresh')
}


socket.on('initData',(data,fn)=>{
	sandBox = data;
	initializeBattleUI();
	fn();
})
socket.on('matched',data=>{
	// initializeBattleUI();
})

socket.on('event',({gameEvent,box},cb)=>{
	sandBox = box;
	console.log(gameEvent)
	observer.trigger('refresh')
	window.cb = function(resp){
		cb(resp)
	}
})
