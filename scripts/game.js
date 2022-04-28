import * as THREE from "three";
import { GLTFLoader } from "./GLTFLoader.js";

export class Game {
    constructor(timer, phrase, player, enemy, enemyHealth) {
        // Dude how did this even happen
        this.models = [];
        this.timer = timer;
        this.phrase = phrase;
        this.player = player;
        this.enemy = enemy;
        this.enemyHealth = enemyHealth;
        this.healthBar = document.getElementById("health-bar");
        this.allowedWords = {};
        document.getElementById("cursor").style = "height: 80px; width: 80px; display: inline";
        document.querySelector("progress").style = "display: inline";
    }
    
    updateAllowedWords() {
        this.phrase.forEach(word => {
            this.allowedWords[word] = word.length;
        });
    }
    
    updatePhrase(phrase) {
        this.phrase = phrase;
    }
    
    calculateDamage(phrase) {
        let dmg = 0;
        // Calculate damage based on number of valid words and their length
        phrase.forEach(word => {
            if (this.allowedWords[word]) dmg += this.allowedWords[word];
        });
        return dmg
    }

    damageEnemy(dmg) {
        this.player.punch(this.enemy, dmg);
        this.enemyHealth -= dmg
        this.healthBar.value -= dmg
    }
    
    start() {
        this.healthBar.value = this.enemyHealth;
        this.healthBar.max = this.enemyHealth;
        var startTimer = setInterval(() => {
            let cursorTimer = document.getElementById("cursor-timer")
            cursorTimer.innerHTML = this.timer + "s";
            if (--this.timer === 0) {
                document.querySelector("#dmg-counter").innerHTML = "!!!!!"
                cursorTimer.innerHTML = "";
                window.clearInterval(startTimer);
            }
        }, 1000);
    }

    over() {
        if (this.timer < 1 || this.isWon()) {
            return true;
        }
        return false;
    }

    isWon() {
        if (this.enemyHealth <= 0) {
            return true;
        } else {
            return false;
        }
    }

    endGame(scene) {
        let finishingSound;
        while (scene.children.length) {
            scene.remove(scene.children[0]);
        }
        document.querySelector("#cursor-timer").style.display = "none"
        let screen = document.getElementById("pause-menu");
        screen.style.display = "flex"
        document.querySelector("#dmg-counter").style.display = "none";
        document.querySelector("progress").style.display = "none";
        document.querySelector("#dmg-counter").style.display = "none";
        if (this.isWon()) {
            finishingSound = new Audio("/resources/assets/no_maidens.mp3");
            screen.innerHTML = "You Win!";
        } else {
            finishingSound = new Audio("/resources/assets/skill_issue.mp3");
            screen.innerHTML = "You Lose....";
        }
        finishingSound.play();
        
    }
}

export class Character {
    constructor(scene, name, health) {
        this.scene = scene;
        this.model = name;
        this.character = name;
        this.health = health;
        this.clock = new THREE.Clock();
        this.counterSFX = new Audio('/resources/assets/counter.mp3')
    }

    takeDamage(dmg) {
        this.health -= dmg;
    }

    punch(enemy, dmg) {
        this.counterSFX.play();
        document.querySelector("#dmg-counter").innerHTML = dmg;
        document.querySelector("#dmg-counter").style.display = "inline";
        document.querySelector("#dmg-counter").style.fontSize = 40 + (5 * dmg) + "px";
        enemy.takeDamage(dmg);
    }

    punchAnimation() {
        // this.model.punchLoop();
    }

    loadModel(scene, character, scale, pos, rot) {
        const loader = new GLTFLoader();
        loader.setPath("/resources/models/")
        
        loader.load(`${character}/idle.glb`, function (gltf) {
            let model = gltf.scene;
            model.scale.setScalar(scale);
            model.traverse(c => c.castShadow = true);
            model.position.setX(pos[0]);
            model.position.setY(pos[1]);
            model.position.setZ(pos[2]);
            model.setRotationFromEuler(new THREE.Euler( rot[0], rot[1], rot[2], 'XYZ' ))
            model.name = character;
            scene.add(model);
        })
    }
}
