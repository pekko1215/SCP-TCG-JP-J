const { GameControler, Card, SandBox, GameEvent } = require('./SCP-TCG-J/scptcg.js');

var pool = require('./cards/card1.js');

module.exports = () => {
    return {
        safe: [
            pool[0](),
            pool[0](),
            pool[0](),
            pool[0](),
            pool[0](),
            pool[0](),
            pool[0]()
        ],
        euclid: [
            pool[1](),
            pool[1](),
            pool[1](),
            pool[1]()
        ],
        keter: [
            pool[2](),
            pool[2]()
        ],
        tale: [
            pool[5](),
            pool[5]()
        ],
        human: [
            pool[4]()
        ],
    }
}