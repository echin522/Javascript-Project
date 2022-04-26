import * as THREE from "three";
import { AnimationMixer } from "three";

import { GLTFLoader } from "/node_modules/three/examples/jsm/loaders/GLTFLoader.js";

export class Game {
    constructor(timer, playerHealth, enemyHealth) {
        this.models = [];
        this.timer = timer;
        this.player = new Character(">:)", playerHealth);
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

export class Character {
    constructor(scene, model, health) {
        this.scene = scene;
        this.model = model;
        this.health = health;
        this.clock = new THREE.Clock();

        console.log(this.model);
        console.log(this.health);
        
        
    }

    takeDamage(dmg) {
        this.health -= dmg;
    }

    punch(enemy, dmg) {
        this.punchAnimation();
        enemy.takeDamage(dmg);
    }

    punchAnimation() {
        // this.model.punchLoop();
    }

    loadModel(scene, character, scale, pos, rot) {
        const loader = new GLTFLoader();
        loader.setPath("/resources/models/")
        
        loader.load(`${character}/model.gltf`, function (gltf) {
            let model = gltf.scene;
            console.log(gltf.animations)
            model.scale.setScalar(scale);
            model.traverse(c => c.castShadow = true);
            model.position.setX(pos[0]);
            model.position.setY(pos[1]);
            model.position.setZ(pos[2]);
            model.setRotationFromEuler(new THREE.Euler( rot[0], rot[1], rot[2], 'XYZ' ))
            
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

const easyGame = (30, 20);
const normalGame = (30, 50);
const hardGame = (40, 100);
