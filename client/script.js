var socket = io();

var name = prompt();
var userData = {name};
var sandBox = null;
var matching = false;

socket.emit('regist',name,(data)=>{
	userData.id = data.id;
	var doms = data.list.filter(d=>d.id!=data.id).map(d=>{
		var e = document.createElement('h3');
		e.innerText = d.name;
		e.addEventListener('click',()=>{
			socket.emit('match',d.id);
			initializeBattleUI();
		})
		document.getElementById('roomList').appendChild(e);
	})
})

function initializeBattleUI(){
	var k = document.getElementById('roomSelect');
	k.style.display = 'none';
	document.getElementById('game').style.display = '';
}


socket.on('initData',(data,fn)=>{
	sandBox = data;
	fn();
})

socket.on('matched',data=>{
	console.log('matched',data)
	initializeBattleUI();
})