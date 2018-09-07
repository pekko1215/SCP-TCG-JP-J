const {GameControler,Card,SandBox,GameEvent} = require('./SCP-TCG-J/scptcg.js');

var pool = require('./cards/card1.js');
var gameControler = new GameControler(pool);

var deck1 = {
	safe:[
		new pool[0],
		new pool[0],
		new pool[0],
		new pool[0],
		new pool[0],
		new pool[0],
		new pool[0]
	],
	euclid:[
		new pool[1],
		new pool[1],
		new pool[1],
		new pool[1]
	],
	keter:[
		new pool[2],
		new pool[2]
	],
	tale:[
		new pool[5],
		new pool[5]
	],
	human:[
		new pool[4]
	],
}

var deck2 = {
	safe:[
		new pool[0],
		new pool[0],
		new pool[0],
		new pool[0],
		new pool[0],
		new pool[0],
		new pool[0]
	],
	euclid:[
		new pool[1],
		new pool[1],
		new pool[1],
		new pool[1]
	],
	keter:[
		new pool[2],
		new pool[2]
	],
	tale:[
		new pool[5],
		new pool[5]
	],
	human:[
		new pool[4]
	],
}


var box1 = new SandBox(deck1,deck1.safe[0]);
var box2 = new SandBox(deck2,deck2.safe[0]);
console.log(box1.shuffle)
// console.log(box1.tale[0]);
var r;

box1.triggerEvent = async function(gameEvent){
	console.log(gameEvent)
	switch(gameEvent.name){
		case 'select':
			switch(gameEvent.arg.type){
			case 'action':
				return box1.tale[1];
				break
			case 'summon':
				return box1.site.findIndex(d=>!d);
				break
			case 'sandBox':
				return ['safe','euclid','keter'][~~(Math.random()*3)];
				break
			}
		break
		case 'confirm':
		return true;
	}
}
var gc = gameControler.newGame(box1,box2);

 // var v;
 // setInterval(()=>{
	// var p = gc.next(r);
	// v = p.value;
	// if(typeof v !== 'object') return
	// switch(v.name){
	//	case 'select':
	//	
	//	break;
	//	case 'confirm':
	//		r = true
	//		break
	// }
 // },1000)