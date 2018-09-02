const {Card,GameEvent} = require('../SCP-TCG-J/scptcg.js');

module.exports = [
	()=>Object.assign(new Card(),{
		name:'空気中フランスパン濃度測定所',
		id:'SCP-522-JP',
		class:'safe',
		type:'object',
		cost:1,
		protect:1,
		attr:['SCP-JP','メタ'],
		text:'このオブジェクトが収容違反した場合、自分のサンドボックスを1つ選び、確保力を1減少させることができる。',
		flavor:'フランスパン濃度は「湿度」や「気温」のような日常にありふれた数値であり、あなたは今日の朝もTVでフランスパン濃度予報を観たはずです。',
		summon:function*(handler){
			var f = yield GameEvent.EffectConfirm(this);
			if(!f) return;
			var target = yield GameEvent.SelectSandBox({me:'all'});
			if(!target) return;
			handler.sandBox.damage(target,1);
		}
	}),
	()=>Object.assign(new Card(),{
		name:'0匹のイナゴ',
		id:'SCP-240-JP',
		class:'euclid',
		type:'object',
		cost:2,
		protect:3,
		attr:['SCP-JP','人工','日本生類創研','昆虫'],
		text:'オブジェクトが収容違反する時に発動できる。このカードをdecommissionedする。',
		flavor:'0匹逃げ、0匹捕まり、0匹死に、0匹生まれ―――今日も、0匹のまま。',
		summon:function*(handler){
			var f = yield GameEvent.EffectConfirm(this);
			if(!f) return;
			handler.sandBox.decommission(this);
		}
	}),
	()=>Object.assign(new Card(),{
		name:'タイムマシンリボルバー',
		id:'SCP-710-JP',
		class:'keter',
		type:'object',
		cost:3,
		protect:4,
		attr:['SCP-JP','時空間','武器'],
		text:'自分のターンに一度発動できる。相手のサンドボックスを1つ選択する。次の相手のターン開始時、そのサンドボックスの保護力を4減らす。',
		flavor:'彼を殺したのは財団だ。だから何の問題もない。',
		options:{
			effected:false,
			target:null
		},
		action:function*(handler){
			if(this.options.effected) return;
			this.options.target = yield GameEvent.SelectSandBox({target:'all'});
			if(this.options.target){
				this.options.effected = true;
			}
		},
		targetWakeEffect:function*(handler){
			if(this.options.effected){
				this.options.effected = false;
				var {target} = this.options;
				if(!target) return;
				handler.sandBox.damage(target,4);
			}
		}
	}),
	()=>Object.assign(new Card(),{
		name:'エージェント・速水',
		type:'tale',
		text:'自分サイト上のコストの合計が6の場合に発動できる。パートナーオブジェクトを除いた自分サイト上のオブジェクト全てをdecommissionedに送り、コストの合計が5になるように任意のサンドボックスから収容違反する。',
		flavor:'「イイイイッッヤァアアー！！！！！！」',
		action:function*(handler){
			var {sandBox} = handler;
			var allCost = sandBox.site.filter(d=>d).reduce((a,b)=>{
				return a+b;
			},0);
			if(allCost != 6) return;
			sandBox.site.filter(d=>d).forEach(card=>{
				handler.sandBox.decommission(card);
			})
			var costs = 5;
			var slist = [];
			while(costs){
				var list = [...sandBox.safe,...sandBox.euclid,...sandBox.keter].filter(card=>card.cost <= costs);
				var s = yield GameEvent.CardSelect(list,`のこりコスト${costs}`);
				if(!s){
					if(!slist.length) continue;
					var b = slist.pop();
					costs += b.cost;
					continue;
				}else{
					slist.push(s);
					costs -= s.cost;
				}
			}
			slist.forEach(card=>{
				sandBox.effectSummon(card);
			})
		}
	}),
	()=>Object.assign(new Card(),{
		name:'エージェント・カナヘビ',
		type:'human',
		text:`
相手が人事効果を発動したときに発動できる。サイコロを２回振り、その合計値によって以下の効果が発揮される。

12    :相手の人事は効果が無効化され、decommissionedに送られる。
7～11 :相手の人事効果はこのターンのみ無効化される。
3～6  :自分の全てのサンドボックスの保護力が1減る。
2     :この人事はdecommissionedに送られる。`,
		flavor:'「んもう！　泣かせるつもりちゃうかったんやって！　中止や中止！」',
		targetHuman:function*(handler){
			var f = yield GameEvent.EffectConfirm(this);
			if(!f) return;
			var dice  = yield GameEvent.Dice();
			    dice += yield GameEvent.Dice();
			switch(dice){
				case 2:
					handler.sandBox.decommission(this);
				break
				case 3:case 4:case 5:case 6:
					var list = ['safe','euclid','keter']
					list.forEach(key=>{
						handler.sandBox.damage(key,1);
					})
				break
				case 7:case 8:case 9:case 10:case 11:
					handler.cancel();
				break
				case 12:
					handler.sandBox.decommission(handler.src);
					handler.cancel();
				break
			}
		}
	}),
	()=>Object.assign(new Card(),{
		name:'エージェント・イケゾリ',
		type:'tale',
		text:`自分の全てのサンドボックスの保護力が1減る。`,
		flavor:'イケゾリなり',
		action:function*(handler){
			var f = yield GameEvent.EffectConfirm(this);
			if(!f) return;
			var list = ['safe','euclid','keter'];
			for(var key of list){
				for(var val,tmp = handler.sandBox.damage(key,5),r = tmp.next();!r.done;r=tmp.next(val)){
					val = yield r.value;
				}
			}
		}
	})
]

// console.log(module.exports.map(f=>f()))