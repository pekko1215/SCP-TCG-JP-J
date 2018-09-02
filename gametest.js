const {GameControler,Card,SandBox,GameEvent} = require('./SCP-TCG-J/scptcg.js');

var pool = require('./cards/card1.js');
var gameControler = new GameControler(pool);

var deck1 = {
	safe:[
		pool[0](),
		pool[0](),
		pool[0](),
		pool[0](),
		pool[0](),
		pool[0](),
		pool[0]()
	],
	euclid:[
		pool[1](),
		pool[1](),
		pool[1](),
		pool[1]()
	],
	keter:[
		pool[2](),
		pool[2]()
	],
	tale:[
		pool[5](),
		pool[5]()
	],
	human:[
		pool[4]()
	],
}

var deck2 = {
	safe:[
		pool[0](),
		pool[0](),
		pool[0](),
		pool[0](),
		pool[0](),
		pool[0](),
		pool[0]()
	],
	euclid:[
		pool[1](),
		pool[1](),
		pool[1](),
		pool[1]()
	],
	keter:[
		pool[2](),
		pool[2]()
	],
	tale:[
		pool[5](),
		pool[5]()
	],
	human:[
		pool[4]()
	],
}


var box1 = new SandBox(deck1,deck1.safe[0]);
var box2 = new SandBox(deck2,deck2.safe[0]);
// console.log(box1)
var gc = gameControler.newGame(box1,box2);
// console.log(box1.tale[0]);
var r;
var v;
setInterval(()=>{
	var p = gc.next(r);
	v = p.value;
	if(typeof v !== 'object') return
	switch(v.name){
		case 'select':
		switch(v.arg.type){
			case 'action':
				r = box1.tale[1];
				break
			case 'summon':
				r = box1.site.findIndex(d=>!d);
				break
			case 'sandBox':
				r = ['safe','euclid','keter'][~~(Math.random()*3)];
				break
		}
		break;
		case 'confirm':
			r = true
			break
	}
},1000)