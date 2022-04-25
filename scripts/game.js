class Game {
    constructor(timer, enemyHealth) {
        this.models = [];
        this.timer = timer;
        this.enemy = new Character(":)", enemyHealth);
    }

    isOver() {
        if (this.timer === 0 || this.isWon()) {
            return true;
        }
        return false;
    }

    isWon() {
        if (this.enemy.health === 0) {
            return true;
        }
    }
}

class Character {
    constructor(model, health) {
        this.model = model;
        this.health = health;
    }

    takeDamage(dmg) {
        this.health -= dmg;
    }

    punch(enemy, dmg) {
        enemy.takeDamage(dmg);
    }

    punchAnimation() {
        // this.model.punchLoop();
    }
}

const easyGame = (30, 20);
const normalGame = (30, 50);
const hardGame = (40, 100);