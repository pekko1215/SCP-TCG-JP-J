const { GameControler, Card, SandBox, GameEvent } = require('./SCP-TCG-J/scptcg.js');

var pool = require('./cards/card1.js');

module.exports = () => {
    return {
        safe: [
            new pool[0](),
            new pool[0](),
            new pool[0](),
            new pool[0](),
            new pool[0](),
            new pool[0](),
            new pool[0]()
        ],
        euclid: [
            new pool[1](),
            new pool[1](),
            new pool[1](),
            new pool[1]()
        ],
        keter: [
            new pool[2](),
            new pool[2]()
        ],
        tale: [
            new pool[5](),
            new pool[5]()
        ],
        human: [
            new pool[4]()
        ],
    }
}