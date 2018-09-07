var genId = 0;

/*
yield new GameEventを
await new GameEventに変更
それに伴い、GameEventをGameControllerに依存させなければいけない

 */

const dbgMode = true;
function log(a){
	if(!dbgMode) return;
	console.log(a)
}

class Card {
	constructor(){
		this.type = null;
		this.class = null;
		this.genId = genId++;
	}
}

class GameHandler {
	constructor(sandBox,src,place){
		this.sandBox = sandBox;
		this.place = place;
		this.src = src;
		this.enemmy = sandBox.enemmy;
	}
	async cancel(){
		throw 'Effect Cancel';
	}
}

class SandBox{
	constructor(cards,partner){
		var {safe,euclid,keter,human,tale} = cards;
		this.safe = safe.length == 7 && safe;
		this.euclid = euclid.length == 4 && euclid;
		this.keter = keter.length == 2 && keter;
		this.human = human.length == 1 && human;
		this.tale = tale.length == 2 && tale;
		this.types = ['safe','euclid','keter','human','tale'];
		this.site = Array(6).fill(null);
		this.decommissioned = [];
		this.secureDefault = {
			safe:4,
			euclid:8,
			keter:12
		}
		this.field = {
			safe:this.safe,
			euclid:this.euclid,
			keter:this.keter,
			human:this.human,
			tale:this.tale,
			site:this.site,
			decommissioned:[]
		};
		this.secure = Object.assign({},this.secureDefault);
		// this.types.forEach(key=>this[key].forEach(d=>d.sandBox = this))
		this.gameControler = null;
		this.partner = partner;
		this.partner.isPartner = true;
		this.findAndMove(partner,'site',3);
	}
	shuffle(){
		this.types.forEach(key=>{
			var arr = this[key];
			var ret = [];
			while(arr.length){
				var idx = ~~(Math.random()*arr.length)
				ret.push(arr[idx]);
				arr.splice(idx, 1);
			}
			this[key] = ret;
		})
	}
	triggerEvent(name,arg){
		return this.sandBox.triggerEvent(name,triggerEvent)
	}
	async wakeEffect(target){

	}
	async downEffect(target){

	}
	async crossTest(card,target){

	}
	async actionEffect(card){
		await card.action(new GameHandler(this,card,null));
	}
	async decommission(card){
		await this.triggerListener('decommission');
		card.decommission = true;
		Object.keys(this.field).find(key=>{
			this[key] = this[key].filter(c=>c).filter(c=>c.genId != card.genId);
		})
		this.decommissioned.push(card);
	}
	async summon(card){
		log(`${card.name}の収容違反`);
		var idx = await this.triggerEvent(GameEvent.SelectBlankSite());
		if(idx == -1){
			return await this.triggerEvent(GameEvent.KClassScenario('NK'));
		}
		log(`サイト${idx}が選択`);
		log(`自身の収容違反時効果`);
		await this.triggerListener('mySummon',card)
		log(`相手の収容違反時効果`);
		await this.triggerListener('enemmySummon',card)
		card.decommissioned = false;
		this.site[idx] = card;
		if(card.summon){
			log(`収容違反時効果の発動`);
			await card.summon(new GameHandler(this,card,'site'));
		}
	}
	async damage(target,value){
		log(`${target}に対する${value}のダメージ`)
		this.secure[target] -= value;
		log(`確保力減算処理`);
		log(this.secure);
		if(this.secure[target] <= 0){
			log(`${target}による収容違反発生`)
			this.secure[target] = this.secureDefault[target];
			if(this[target].length == 0){
				return await this.triggerEvent(GameEvent.KClassScenario('ZK'));
			}
			await this.summon(this[target].pop());
		}
	}
	async weffectSummon(card){
		return await this.summon(card);
	}
	async changeCost(card,val){
		card.cost += val;
		if(card.cost<0){
			card.cost = 0;
		}
	}
	async changeProtect(card,val){
		card.protect += val;
		if(card.protect<0){
			card.protect = 0;
		}
	}
	async triggerListener(key,src){
		var box = this;
		if(/enemmy/.test(key)){
			box = this.enemmy;
		}
		var cards = ['site','tale','human'].reduce((a,b)=>{
			a.push(...box[b].filter(c=>c).map(card=>{
				return {place:b,card}
			}))
			return a;
		},[]);
		for(var card of cards){
			if(!card.card[key])break;
			await card.card[key](new GameHandler(box,src,card.place))
		}
	}
	async findAndMove(card,target,arg){
		Object.keys(this.field).find(key=>{
			var idx = this[key].findIndex(c=>c.genId == card.genId);
			if(idx == -1) return;
			if(key == 'site'){
				this[key] == null;
			}else{
				this[key].splice(idx,1);
			}
			if(target == 'decommission') card.decommissioned = true;
			switch(arg){
				case 'push':
					this[target].push(card)
				break
				case 'unshift':
					this[target].unshift(card)
				break
				default:
				this[target][arg] = card;
			}
			return true;
		})
	}
	toSendData(){
		return {
			safe:this.safe,
			euclid:this.euclid,
			keter:this.keter,
			field:this.field,
			secure:this.secure,
			site:this.site,
			human:this.human,
			tale:this.tale,
			decommissioned:this.decommissioned,
			secureDefault:this.secureDefault,
			enemmy:{
				secure:this.enemmy.secure,
				site:this.enemmy.site,
				lengths:{
					safe:this.enemmy.safe.length,
					euclid:this.enemmy.euclid.length,
					keter:this.enemmy.keter.length,
					tale:this.enemmy.tale.length,
					human:this.enemmy.human.length
				},
				decommissioned:this.enemmy.decommissioned
			}
		}
	}
	async triggerEvent(gameEvent){
		console.log(`triggerEventメソッドをオーバーライドしてください。`,gameEvent);
		return null;
	}
}

class GameEvent {
	constructor(name,arg){
		this.name = name;
		this.arg = arg
	}
	static Confirm(text){
		return new this('confirm',text);
	}
	static EffectConfirm(card){
		return this.Confirm(`${card.name} の効果を発動しますか？`)
	}
	static SelectBlankSite(){
		return new this('select',{type:'summon'});
	}
	static SelectSandBox(target){
		if(target.me == 'all'){
			target.me = ['safe','euclid','keter'];
		}
		if(target.target == 'all'){
			target.target = ['safe','euclid','keter'];
		}
		target.type = 'sandBox'
		return new this('select',target)
	}
	static KClassScenario(type){
		throw {
			name:'KClassScenario',
			message:type,
			toString(){
				return `Kクラスシナリオ-${type}が発生`
			}
		}
	}
	static SelectAction(){
		return new this('select',{
			type:'action'
		})
	}
}

class GameControler {
	constructor(sand1,sand2){
		// this.newGame(sand1,sand2)
	}
	async newGame(sand1,sand2){
		this.init(sand1,sand2);
		var sands = [sand1,sand2];
		try{
			while(true){
				await this.Turn(sand1,sand2);
				await this.Turn(sand2,sand1);
			}
		}catch(e){
			console.log(e)
		}
	}
	init(s1,s2){
		s1.shuffle();
		s2.shuffle();
		s1.gameControler = this;
		s2.gameControler = this;
		s1.enemmy = s2;
		s2.enemmy = s1;
	}
	async Turn(me,target){
		// 自身のターン前効果処理
		await me.wakeEffect(me);
		await me.enemmy.wakeEffect(me);
		while(true){
			var card = await me.triggerEvent(GameEvent.SelectAction());
			if(!card) break;
			switch(card.type){
				case 'object':
					if(card.tested) break;
					var target = await me.triggerEvent(new GameEvent('select',{target:['site']}));
					await me.crossTest(card,target);
					break;
				case 'human':
				case 'tale':
					await me.actionEffect(card);
					break;
			}
		}
		// 自身のターン終了効果処理
		await me.downEffect(me.enemmy);
		await me.enemmy.downEffect(me);
	}
}


module.exports = {GameControler,Card,SandBox,GameEvent}