const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const {GameControler,Card,SandBox,GameEvent} = require('./SCP-TCG-J/scptcg.js');

app.use(express.static('client'));

var Users = new Map();
var idx = 0;
io.on('connection',(socket)=>{
	var userData = {
		id:idx++,
		socket
	}
	socket.on('regist',(name,fn)=>{
		userData.name = name;
		Users.set(userData.id,userData);
		fn({
			list:[...Users.values()].map(d=>{
				return {id:d.id,name:d.name}
			}),
			id:userData.id
		});
	})
	socket.on('match',(id,fn)=>{
		var enemmy = Users.get(id);
		if(!enemmy) return;
		enemmy.socket.emit('matched',{id:userData.id,name:userData.name})
		Users.delete(id);
		Users.delete(userData.id);
		if(~~(Math.random()*2)){
			[userData,enemmy] = [enemmy,userData];
		}
		match(userData,enemmy);
	})
})

function match(u1,u2){
	var sendData = [
		{name:u1.name},
		{name:u2.name}
	]
	var roomSymbol = Symbol();
	u1.socket.join(roomSymbol);
	u2.socket.join(roomSymbol);
	var cards = require('./testdeck.js')();
	u1.sandBox = new SandBox(cards,cards.safe[0]);
	cards = require('./testdeck.js')();
	u2.sandBox = new SandBox(cards,cards.safe[0]);
	var gameControler = new GameControler();

	u1.sandBox.triggerEvent = function(gameEvent){
		return new Promise(r=>{
			u1.socket.emit('event',{gameEvent,box:u1.sandBox.toSendData()},(data)=>{
				r(responseParser.call(u1.sandBox,data))
			})
		})
	}
	u2.sandBox.triggerEvent = function(gameEvent){
		return new Promise(r=>{
			u2.socket.emit('event',{gameEvent,box:u2.sandBox.toSendData()},(data)=>{
				r(responseParser.call(u2.sandBox,data))
			})
		})
	}
	gameControler.newGame(u1.sandBox,u2.sandBox);

	Promise.all([
		new Promise(r=>u1.socket.emit('initData',u1.sandBox.toSendData(),r)),
		new Promise(r=>u2.socket.emit('initData',u2.sandBox.toSendData(),r))
	]).then(d=>{
		
	})
}

http.listen(8808)

function responseParser(resp){
	switch(resp.type){
		case 'select':
			var current = this;
			var ret;
			(function fn(value){
				switch(true){
					case typeof value === 'object':
						current = current[Object.keys(value)[0]];
						fn(value[Object.keys(value)[0]])
					break
					case typeof value === 'number':
						ret = current[value];
				}
			})(resp.value);
			return ret;
		break
		case 'confirm':
			return resp.value;
			break
		default:
			return resp
	}
}