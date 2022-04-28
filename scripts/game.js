import * as THREE from "three";
import { AnimationMixer } from "three";
import { GLTFLoader } from "/node_modules/three/examples/jsm/loaders/GLTFLoader.js";

export class Game {
    constructor(timer, phrase, player, enemy) {
        this.models = [];
        this.timer = timer;
        this.phrase = phrase;
        this.player = player;
        this.enemy = enemy;
        this.allowedWords = {};
        document.getElementById("cursor").style = "height: 80px; width: 80px";
        document.getElementById("cursor-message").innerHTML += "Click and<br>Scream";
    }
    
    updateAllowedWords() {
        this.phrase.forEach(word => {
            this.allowedWords[word] = word.length;
        });
    }
    
    updatePhrase(phrase) {
        this.phrase = phrase;
    }
    
    damageEnemy(phrase) {
        console.log(phrase)
        let dmg = 0;
        // Calculate damage based on number of valid words and their length
        phrase.forEach(word => {
            if (this.allowedWords[word]) dmg += this.allowedWords[word];
        });
        this.player.punch(this.enemy, dmg);
    }
    
    start() {
        var startTimer = setInterval(() => {
            let cursorTimer = document.getElementById("cursor-timer")
            cursorTimer.innerHTML = this.timer + "s";
            if (--this.timer < 0) {
                window.clearInterval(startTimer);
                this.endGame();
            }
        }, 1000);
    }

    over() {
        if (this.timer === 0 || this.isWon()) {
            return true;
        }
        return false;
    }

    isWon() {
        if (this.enemy.health === 0) {
            console.log("pog you won")
            return true;
        }
    }

    endGame(scene) {
        if (this.isWon) {
            scene.remove(scene.getObjectByName(player.character));
            scene.remove(scene.getObjectByName(enemy.character));
        }
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
        console.log(`dealt ${dmg} damage!`)
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

            // const mixer = new AnimationMixer(model);
            // const clips = model.animations;
            // const clip = THREE.AnimationClip.findByName(clips, 'dance');
            // const action = mixer.clipAction(clip);
            // action.play();
        })
    }

    loadAnimations(gltf, movement) {
        const anim = new GLTFLoader();
        anim.setPath("resources/models/");
        
        anim.load("jotaro/punchCombo.gltf", function (anim) {
            console.log("walk loaded");
            const mixer = new THREE.AnimationMixer(anim.scene);
            console.log(mixer)
            mixer.clipAction(anim.animations[0]);
        })
    }
}

// const easyGame = (30, 20);
// const normalGame = (30, 50);
// const hardGame = (40, 100);
