const {Card,GameEvent} = require('../SCP-TCG-J/scptcg.js');

module.exports = [
	class extends Card {
		constructor(){
			super();
			this.name = '空気中フランスパン濃度測定所';
			this.id = 'SCP-522-JP';
			this.class = 'safe';
			this.type = 'object';
			this.cost = 1;
			this.protect = 1;
			this.attr = ['SCP-JP','メタ'];
			this.text = 'このオブジェクトが収容違反した場合、自分のサンドボックスを1つ選び、確保力を1減少させることができる。';
			this.flavor = 'フランスパン濃度は「湿度」や「気温」のような日常にありふれた数値であり、あなたは今日の朝もTVでフランスパン濃度予報を観たはずです。';
		}
		async summon(handler){
			var f = await handler.sandBox.triggerEvent(GameEvent.EffectConfirm(this));
			if(!f) return;
			var target = await handler.sandBox.triggerEvent(GameEvent.SelectSandBox({me:'all'}));
			if(!target) return;
			await handler.sandBox.damage(target,1);
		}
	},
	class extends Card {
		constructor(){
			super();
			this.name = '0匹のイナゴ';
			this.id = 'SCP-240-JP';
			this.class = 'euclid';
			this.type = 'object';
			this.cost = 2;
			this.protect = 3;
			this.attr = ['SCP-JP','人工','日本生類創研','昆虫'];
			this.text = 'このオブジェクトが収容違反する時に発動できる。このカードをdecommissionedする。';
			this.flavor = '0匹逃げ、0匹捕まり、0匹死に、0匹生まれ―――今日も、0匹のまま。';
		}
		async summon(handler){
			var f = await handler.sandBox.triggerEvent(GameEvent.EffectConfirm(this));
			if(!f) return;
			await handler.sandBox.decommission(this);
		}
	},
	class extends Card{
		constructor(){
			super();
			this.name = 'タイムマシンリボルバー';
			this.id = 'SCP-710-JP';
			this.class = 'keter';
			this.type = 'object';
			this.cost = 3;
			this.protect = 4;
			this.attr = ['SCP-JP','時空間','武器'];
			this.text = '自分のターンに一度発動できる。相手のサンドボックスを1つ選択する。次の相手のターン開始時、そのサンドボックスの保護力を4減らす。';
			this.flavor = '彼を殺したのは財団だ。だから何の問題もない。';
			this.options = {
				effected:false,
				target:null
			}
		}
		async action(handler){
			if(this.options.effected) return;
			this.options.target = await handler.sandBox.triggerEvent(GameEvent.SelectSandBox({target:'all'}));
			if(this.options.target){
				this.options.effected = true;
			}
		}
		async targetWakeEffect(handler){
			if(this.options.effected){
				this.options.effected = false;
				var {target} = this.options;
				if(!target) return;
				await handler.sandBox.damage(target,4);
			}
		}
	},
	class extends Card {
		constructor(){
			super();
			this.name = 'エージェント・速水';
			this.type = 'tale';
			this.text = '自分サイト上のコストの合計が6の場合に発動できる。パートナーオブジェクトを除いた自分サイト上のオブジェクト全てをdecommissionedに送り、コストの合計が5になるように任意のサンドボックスから収容違反する。';
			this.flavor = '「イイイイッッヤァアアー！！！！！！」';
		}
		async action(handler){
			var {sandBox} = handler;
			var allCost = sandBox.site.filter(d=>d).reduce((a,b)=>{
				return a+b;
			},0);
			if(allCost != 6) return;
			for(var card of sandBox.site){
				if(!card) continue;
				await handler.sandBox.decommission(card);
			}
			var costs = 5;
			var slist = [];
			while(costs){
				var list = [...sandBox.safe,...sandBox.euclid,...sandBox.keter].filter(card=>card.cost <= costs);
				var s = await handler.sandBox.triggerEvent(GameEvent.CardSelect(list,`のこりコスト${costs}`));
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
			for(var card of slist){
				await sandBox.effectSummon(card);
			}
		}
	},
	class extends Card {
		constructor(){
			super();
			this.name = 'エージェント・カナヘビ';
			this.type = 'human';
			this.text = `
相手が人事効果を発動したときに発動できる。サイコロを２回振り、その合計値によって以下の効果が発揮される。

12    :相手の人事は効果が無効化され、decommissionedに送られる。
7～11 :相手の人事効果はこのターンのみ無効化される。
3～6  :自分の全てのサンドボックスの保護力が1減る。
2     :この人事はdecommissionedに送られる。`;
			this.flavor = '「んもう！　泣かせるつもりちゃうかったんやって！　中止や中止！」';
		}
		async targetHuman(handler){
			var f = await handler.sandBox.triggerEvent(GameEvent.EffectConfirm(this));
			if(!f) return;
			var dice  = await handler.sandBox.triggerEvent(GameEvent.Dice());
			    dice += await handler.sandBox.triggerEvent(GameEvent.Dice());
			switch(dice){
				case 2:
					await handler.sandBox.decommission(this);
				break
				case 3:case 4:case 5:case 6:
					var list = ['safe','euclid','keter']
					for(var key of list){
						await handler.sandBox.damage(key,1);
					}
				break
				case 7:case 8:case 9:case 10:case 11:
					await handler.cancel();
				break
				case 12:
					await handler.sandBox.decommission(handler.src);
					await handler.cancel();
				break
			}
		}
	},
	class extends Card {
		constructor(){
			super();
			this.name = 'エージェント・イケゾリ';
			this.type = 'tale';
			this.text = `自分の全てのサンドボックスの保護力が1減る。`;
			this.flavor = '俺部室に住んでるから';
		}
		async action(handler){
			var f = await handler.sandBox.triggerEvent(GameEvent.EffectConfirm(this));
			if(!f) return;
			var list = ['safe','euclid','keter'];
			for(var key of list){
				await handler.sandBox.damage(key,5)
			}
		}
	}
]

// console.log(module.exports.map(f=>f()))