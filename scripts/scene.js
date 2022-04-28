import * as THREE from "three";
import { DirectionalLight } from "three";
import { OrbitControls } from 'OrbitControls';
import { Character, Game } from "./game.js"
import { GLTFLoader } from "/resources/nodes/GLTFLoader.js";
import Stats from "/resources/nodes/stats.module.js";

// Setup up some constants
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000);
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: document.querySelector('#background'),
});
let lights = [];
let controls;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// scene.fog = new THREE.FogExp2(0xDFCDCA, .1);
scene.fog = new THREE.Fog(0x000000, 0, 0)

// FPS Counter for fun
const stats = Stats();
document.body.appendChild(stats.dom);

var player = "";
var enemy = "";
let mixer;
let mixers = [];


// Setup our stage for the game
export class LoadScene {
    constructor() {
        this.initialize();
    }
    
    initialize() {
        // This code is awful and I despise it. Refactor this please, future Edgar
        ////////////////////////////////////////////////////////////////////////////////
        
        // Begin setting up the view for the user
        document.body.appendChild(renderer.domElement)
        renderer.setClearColor( 0x800000, 0.02);
        camera.position.setX(0);
        camera.position.setY(7);
        camera.position.setZ(12);
        
        ////////////////////////////////////////////////////////////////////////////////
        
        // Setup the lighting environments
        const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0xF1CAC4, .5);
        
        const keyLight = new DirectionalLight(0xffffff, 1.0);
        keyLight.position.set(0, 30 , 0);
        const fillLight = new DirectionalLight(0xffffff, 0.75);
        fillLight.position.set(0, 30, 0);
        const backLight = new DirectionalLight(0xffffff, 1.0);
        backLight.position.set(0, 30, 0).normalize();
        
        const keyLightHelper = new THREE.PointLightHelper(keyLight);
        const fillLightHelper = new THREE.PointLightHelper(fillLight);
        const backLightHelper = new THREE.PointLightHelper(backLight);
        scene.add(keyLightHelper, fillLightHelper, backLightHelper);
        scene.add(keyLight, fillLight, backLight);
        scene.add(hemiLight);
        
        lights = [keyLightHelper, fillLightHelper, backLightHelper, keyLight, fillLight, backLight, hemiLight];

        ////////////////////////////////////////////////////////////////////////////////
        
        // Setup camera controls and grid for testing
        // THIS IS VERY UGLY, PLEASE REFACTOR AND MAKE IT MORE DRY LATER

        controls = new OrbitControls(camera, renderer.domElement);
        controls.minPolarAngle = Math.PI / 4; // radians
        controls.maxPolarAngle = Math.PI / 3; // radians
        controls.minDistance= 0;
        controls.maxDistance=100;

        const boxSize = 200;
        const numGridDivs = 50;
        const numGrids = 6
        function gridMaker(size, divs, num) {
            const gridSides = [];
            for (let i = 0; i < num; i ++) {
                gridSides.push( new THREE.GridHelper(size, divs));
            }
            return gridSides
        }
        
        const myGrid = gridMaker(boxSize, numGridDivs, numGrids);
        myGrid[1].rotation.x = Math.PI / 2;
        myGrid[2].rotation.x = Math.PI / 2;
        myGrid[3].rotation.z = Math.PI / 2;
        myGrid[4].rotation.z = Math.PI / 2;
        myGrid[1].position.setY(100);
        myGrid[1].position.setZ(100);
        myGrid[2].position.setY(100);
        myGrid[2].position.setZ(-100);
        myGrid[3].position.setX(100);
        myGrid[3].position.setY(100);
        myGrid[4].position.setX(-100);
        myGrid[4].position.setY(100);
        myGrid[5].position.setY(200);
        scene.add(myGrid[0], myGrid[1], myGrid[2], myGrid[3], myGrid[4], myGrid[5]);
        
        // function gridSetter(grid, pos, rot) {
        //     console.log(pos[1])
        //     grid.position.setX = pos[0];
        //     grid.position.setY = pos[1];
        //     grid.position.setZ = pos[2];

        //     grid.rotation.x = rot[0];
        //     grid.rotation.y = rot[1];
        //     grid.rotation.z = rot[2];

        //     return grid;
        // }
        
        // let pi = Math.PI;
        // let gridPositions = [[0, 0, 0], [0, 100, 100], [0, 100, 100],
        //                      [100, 100, 0], [-100, 100, 0], [0, 200, 0]];
        // let gridRotations = [[0, 0, 0], [pi / 2, 0, 0], [pi / 2, 0, 0],
        //                      [0, 0, pi / 2], [0, 0, pi / 2], [0, 0, 0]];
        
        // for (let i = 0; i < 6; i++) {
        //     gridSetter(myGrid[i], gridPositions[i], gridRotations[i]);
        //     scene.add(myGrid[i]);
        // }

        ////////////////////////////////////////////////////////////////////////////////
        
        // Load our characters into the scene
        player = new Character(scene, "jotaro", 500);
        enemy = new Character(scene, "dio", 500);

        player.loadModel(scene, "jotaro", 3.4, [-4, 0, 7], [0, 2.6, 0]);
        enemy.loadModel(scene, "dio", 5, [4, 0, 2.5], [0, -.85, 0]);

        ////////////////////////////////////////////////////////////////////////////////

        // I'm not quite sure why this needs to go here but my camera won't move if I put it up top.
        // Figure it out once you get more than 11 hours of sleep in 72 hours
        camera.rotateX(.4)
        camera.rotateY(.1)
    }
}


const loader = new GLTFLoader();
loader.setPath("/resources/models/")

function render() {
    renderer.render(scene, camera);
}

function animate() {
    if (!gamePaused) {
        requestAnimationFrame(animate);
        stats.update();
        const delta = clock.getDelta();
        if (mixers[0]) {
            mixers.forEach( m => m.update(delta));
        }
        if (gamePhase < 2) {
            changeFog();
            // shakeScreen();
        }
        render();
    }
}

// Reload everything because I'm incompetent and don't know how to assign
// animations to generic models. Will refactor one day
let punchLoop = true;
let menuLoaded = false;
let isMuted = false;
let gamePaused = false;
let musicPaused = false;
let logPhrase = new AudioControl();
let themeSong = new Audio('/resources/assets/Sols_Theme.mp3');
let pauseButton = document.querySelector("#pause");
let muteButton = document.querySelector("#sound");
let musicButton = document.querySelector("#music");
let confirmVoiceButton = document.querySelector("#affirmative");
let redoVoiceButton = document.querySelector("#negative");
let goButton = document.querySelector("#start-game-button")
let preStartItems = document.querySelectorAll(".hide-before-start");
let menus = document.querySelectorAll(".menu");
let cursor = document.getElementById("cursor");
let pauseMenu = document.querySelector("#pause-menu");
let healthSlider = document.querySelector("#health-slider");
let timerSlider = document.querySelector("#timer-slider");
let gameTime = 10;
let enemyHealth = 200;
let game;
let gamePhase = 0;
let playerModel;
let enemyModel;
let action;
let punchPhrase;

function pause() {
    if (!gamePaused) {
        themeSong.volume = 0.3;
        pauseMenu.style.display = "inline"
        cursor.style.display = "none"
        gamePaused = true;
    } else {
        themeSong.volume = 1;
        pauseMenu.style.display = "none"
        cursor.style.display = "inline"
        gamePaused = false;
        animate();
    }
}

function loadAnimation(model, anim, startPos, rotation, scale, add, once, actionName) {
    loader.load(`${model}/${anim}.gltf`, function (gltf) {
        let newAnim = gltf.scene;
        newAnim.name = `${model}_${anim}`;
        newAnim.scale.setScalar(scale);
        newAnim.traverse(c => c.castShadow = true);
        newAnim.position.setX(startPos[0]);
        newAnim.position.setY(startPos[1]);
        newAnim.position.setZ(startPos[2]);
        newAnim.setRotationFromEuler(new THREE.Euler( rotation[0], rotation[1], rotation[2], 'XYZ' ));
        mixer = new THREE.AnimationMixer(gltf.scene);
        action = mixer.clipAction(gltf.animations[0]);
        if (once) action.setLoop(THREE.LoopOnce);
        if (add) scene.add(newAnim);
        mixers.push(mixer);
    });
}

function startGame() {
    playerModel = scene.getObjectByName(player.character);
    enemyModel = scene.getObjectByName(enemy.character);
    scene.remove(playerModel);
    enemyModel.scale.setScalar(4);
    enemyModel.position.setX(2)
    enemyModel.position.setZ(4.5)
    enemyModel.rotateX(.08)
    loadAnimation("jotaro", "punchCombo", [-2, 0, 7], [0, 2.1, 0], 4, true, false);
    document.querySelector("#title").style.display = 'none';
    document.querySelector("#game-menus").style.display = 'none';
    menus.forEach (menu => {menu.style.display = 'none'});
}


function loadMenu() {
    new LoadScene();
    preStartItems.forEach (elem => elem.style.display = "flex");
    editTitle();
    render();
    animate();
    themeSong.play();
    menuLoaded = true;
}

function editTitle() {
    let title = document.querySelector("#title");
    let titleElems = document.querySelectorAll("#title > p");
    document.body.classList.add("B");
    titleElems.forEach(p => p.classList.add("B"));
    title.style.padding = 0;
}

function resetCamera() {
    camera.position.setX(0);
    camera.position.setY(7);
    camera.position.setZ(12);
    camera.rotateX(0);
    camera.rotateY(0);
    camera.rotateZ(0);
}

function changeFog() {
    if (gamePhase === 0 && scene.fog.far <= 8) {
        scene.fog.near += .14;
        scene.fog.far += .2;
    } else if (gamePhase === 1 && scene.fog.far < 200) {
        scene.fog.near -= .1;
        scene.fog.far += 1;
    }
}

function shakeScreen() {
    // Do this one day
}

////////////////////////////////////////////////////////////////////////////////
// I really hope no one looks at this as it is now because it's making me want to puke

pauseButton.addEventListener('click', () => {
    pause();
})

musicButton.addEventListener('click', () => {
    if (musicPaused) {
        themeSong.play();
        musicPaused = false;
    } else {
        themeSong.pause()
        musicPaused = true;
    }
});

muteButton.addEventListener('click', () => {
    if (isMuted) {
        themeSong.volume = 1;
        isMuted = false;
    } else {
        themeSong.volume = 0;
        isMuted = true;
    }
})

themeSong.addEventListener("ended", (e) => {
    themeSong.currentTime = 0;
    themeSong.play();
}, false);

healthSlider.oninput = function() {
    document.querySelector("#health-slider-num").innerHTML = healthSlider.value;
}

timerSlider.oninput = function() {
    document.querySelector("#timer-slider-num").innerHTML = timerSlider.value;
}

window.addEventListener("click", () => {
    if (!menuLoaded) {
        loadMenu();
    } else if (gamePhase === 2) {
        document.getElementById("cursor-message").innerHTML = "";
        game.start();
        gamePhase += 1;
        logPhrase.recognition.start();
    } else if (gamePhase === 3) {
        document.getElementById("cursor-message").innerHTML = "";
        if (punchLoop) {
            logPhrase.recognition.start();
            scene.remove(scene.children[scene.children.length - 1]);
            loadAnimation("jotaro", "heavyPunch", [-1.8, .5, 6.6], [0, 2.2, 0], 4.3, true, true);
            camera.position.setX(0);
            camera.position.setY(9);
            camera.position.setZ(10);
            punchLoop = false;
        } else if (!punchLoop) {
            logPhrase.recognition.start();
            scene.remove(scene.children[scene.children.length - 1]);
            loadAnimation("jotaro", "punchCombo", [-2, 0, 7], [0, 2.1, 0], 4, true, false);
            controls.reset();
            punchLoop = true;
        }
    }
});

logPhrase.recognition.addEventListener("result", (e) => {
    punchPhrase = logPhrase.getResult().split(" ")
    if (gamePhase === 0) { 
        document.querySelector("#punchphrase").innerHTML = logPhrase.getResult().split(" ").slice(0, 3).join(" ") 
    } else if (gamePhase === 1) {
        game.updatePhrase(punchPhrase);
    } else if (gamePhase > 2) {
        let dmg = game.calculateDamage(punchPhrase)
        game.damageEnemy(dmg);
        action.play();
        if (game.over()) {
            gamePhase += 1; // Phase 4
            themeSong.volume = 0.3;
            pauseMenu.style.display = "inline"
            game.endGame(scene);
            scene.add(...lights);
            if (game.isWon()) {
                // loadAnimation("jotaro", "win", [0, 0, 0], [0, 0, 0], 3, true, false);
                loader.load(`jotaro/win.gltf`, function (gltf) {
                    let newAnim = gltf.scene;
                    newAnim.position.setZ(-6);
                    newAnim.scale.setScalar(2.2);
                    camera.position.setY(14);
                    newAnim.traverse(c => c.castShadow = true);
                    let mixer = new THREE.AnimationMixer(gltf.scene);
                    let action = mixer.clipAction(gltf.animations[0]);
                    scene.add(newAnim);
                    mixers.push(mixer);
                    action.play();
                });
            } else {
                // loadAnimation("jotaro", "lose", [0, 0, 0], [0, 0, 0], 3, true, false);
                loader.load(`jotaro/lose.gltf`, function (gltf) {
                    let newAnim = gltf.scene;
                    newAnim.scale.setScalar(3);
                    newAnim.traverse(c => c.castShadow = true);
                    mixer = new THREE.AnimationMixer(gltf.scene);
                    let action = mixer.clipAction(gltf.animations[0]);
                    scene.add(newAnim);
                    mixers.push(mixer);
                    action.play();
                });
            }
            pauseMenu.addEventListener("click", () => {
                location.reload();
            });
        }
    }
});

// Phase 0
document.getElementById("player-menu").addEventListener("click", () => {
    if (gamePhase === 0) {
        if (punchPhrase) document.querySelector("#punchphrase").innerHTML = "retrying..." ;
        logPhrase.recognition.start();
        changeFog();
    }
});

// Phase 1
confirmVoiceButton.addEventListener("click", () => {
    if (punchPhrase) {
        document.querySelector("#enemy-menu").classList.add("B");
        document.querySelector("#player-menu").classList.remove("B");
        document.querySelector("#player-menu").style.display = "none";
        changeFog();
        gamePhase += 1;
    }
});

// Phase 2
goButton.addEventListener("click", () => {
    gamePhase += 1;
    enemyHealth = healthSlider.value;
    gameTime = timerSlider.value;
    game = new Game(gameTime, punchPhrase, player, enemy, enemyHealth);
    game.updateAllowedWords();
    resetCamera();
    controls.reset();
    startGame();
});

// For fun

// window.addEventListener("mousemove", (e) => {
//     cursor.style.left = e.clientX + "px";
//     cursor.style.top = e.clientY + "px";
// });

// var title = document.querySelector("#title");

// window.addEventListener('mousemove', (e) => {
//     console.log(document.body.clientHeight)
//     console.log(e.clientX)
//     title.style.left = (width / 3) + (e.clientX / 300)+ "px" ;
//     title.style.top = (height * 1.25)  + (e.clientY / 300)+ "px";
// });