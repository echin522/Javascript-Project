import * as THREE from "three";
import { Clock, DirectionalLight } from "three";
import { OrbitControls } from 'OrbitControls';
import { Character, Game } from "./game.js"
import { AnimationMixer } from "three";
import { GLTFLoader } from "/node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "/node_modules/three/examples/jsm/libs/stats.module.js";

// Setup up some constants
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000);
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: document.querySelector('#background'),
});
let controls
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
var width = document.body.clientWidth;
var height = document.body.clientHeight;


// Setup our stage for the game
export class LoadScene {
    constructor() {
        this.initialize();
    }
    
    initialize() {
        // This code is awful and I despise it. Refactor this please, future Edgar
        ////////////////////////////////////////////////////////////////////////////////
    
        // const bgTexture = new THREE.TextureLoader()
        // bgTexture.load('/resources/backgrounds/cairo.jpeg');
        // scene.background = bgTexture;
        
        // Begin setting up the view for the user
        document.body.appendChild(renderer.domElement)
        renderer.setClearColor( 0x800000, 0.02);
        camera.position.setX(0);
        camera.position.setY(7);
        camera.position.setZ(12);
        
        ////////////////////////////////////////////////////////////////////////////////
        
        // Setup the lighting environments
        const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0xF1CAC4, .5);
        scene.add(hemiLight);
        
        // const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
        // scene.add( ambientLight );
        
        const keyLight = new DirectionalLight(0xffffff, 1.0);
        keyLight.position.set(0, 30 , 0);
        const fillLight = new DirectionalLight(0xffffff, 0.75);
        fillLight.position.set(0, 30, 0);
        const backLight = new DirectionalLight(0xffffff, 1.0);
        backLight.position.set(0, 30, 0).normalize();
        scene.add(keyLight, fillLight, backLight);
        
        const keyLightHelper = new THREE.PointLightHelper(keyLight);
        const fillLightHelper = new THREE.PointLightHelper(fillLight);
        const backLightHelper = new THREE.PointLightHelper(backLight);
        scene.add(keyLightHelper, fillLightHelper, backLightHelper);
        
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
        
        var geometry = new THREE.BoxGeometry( 20, 20, 20);
        var material = new THREE.MeshLambertMaterial( { color: 0x10a315 } );
        var cube = new THREE.Mesh( geometry, material );
        // scene.add( cube );


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
        console.log(gamePhase);
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


// function mutePage() {
//     document.querySelectorAll("video, audio").forEach( elem => muteMe(elem) );
// }

// Reload everything because I'm incompetent and don't know how to assign
// animations to generic models. Will refactor one day
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
let goButton = document.querySelector("#enemy-menu")
let preStartItems = document.querySelectorAll(".hide-before-start");
let menus = document.querySelectorAll(".menu");
let cursor = document.getElementById("cursor");
let pauseMenu = document.querySelector("#pause-menu")
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
        document.querySelector("body").style.cursor = "default"
        gamePaused = true;
    } else {
        themeSong.volume = 1;
        pauseMenu.style.display = "none"
        cursor.style.display = "inline"
        document.querySelector("body").style.cursor = "none"
        gamePaused = false;
    }
}

function loadAnimation(model, anim) {
    loader.load(`${model}/${anim}.gltf`, function (gltf) {
        let model = gltf.scene;
        model.scale.setScalar(4);
        model.traverse(c => c.castShadow = true);
        model.traverse(c => c.castShadow = true);
            model.position.setX(-2);
            model.position.setY(0);
            model.position.setZ(7);
            model.setRotationFromEuler(new THREE.Euler( 0, 2.1, 0, 'XYZ' ));
        // const anim = new GLTFLoader();
        // anim.load("/resources/models/animations/walk.gltf", function (anim) {
            mixer = new THREE.AnimationMixer(gltf.scene);
            // console.log(mixer)
            action = mixer.clipAction(gltf.animations[0]);
            mixers.push(mixer);
        // })
        scene.add(model)
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
    // scene.remove(scene.getObjectByName(enemy.character));
    loadAnimation("jotaro", "punchCombo");
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
    camera.position.setY(0);
    camera.position.setZ(0);
    camera.rotateX(0);
    camera.rotateY(0);
    camera.rotateZ(0);
}

function changeFog() {
    // 1: 4, 8
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
    this.currentTime = 0;
    this.play();
}, false);

window.addEventListener("click", () => {
    if (!menuLoaded) {
        loadMenu();
    } else if (gamePhase == 2) {
        action.play();
        logPhrase.recognition.start();
        document.getElementById("cursor-message").innerHTML = "";
        game.start();
        gamePhase += 1;
    } else if (gamePhase === 3) {
        action.play();
        logPhrase.recognition.start();
    }
});

logPhrase.recognition.addEventListener("result", (e) => {
    punchPhrase = logPhrase.getResult().split(" ")
    if (gamePhase === 0) { 
        document.querySelector("#punchphrase").innerHTML = logPhrase.getResult().split(" ").slice(0, 3).join(" ") 
    } else if (gamePhase === 1) {
        game.updatePhrase(punchPhrase);
    } else if (gamePhase > 2) {
        game.damageEnemy(punchPhrase);
        document.querySelector("#cursor-message").innerHTML = "<br><br>CLICK";
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
        console.log("poggers");
        changeFog();
        gamePhase += 1;
    }
});

// Phase 2
goButton.addEventListener("click", () => {
    gamePhase += 1;
    game = new Game(30, punchPhrase, player, enemy);
    game.updateAllowedWords();
    resetCamera();
    controls.reset();
    startGame();
});


window.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

// 4 fun

// var title = document.querySelector("#title");

// window.addEventListener('mousemove', (e) => {
//     console.log(document.body.clientHeight)
//     console.log(e.clientX)
//     title.style.left = (width / 3) + (e.clientX / 300)+ "px" ;
//     title.style.top = (height * 1.25)  + (e.clientY / 300)+ "px";
// });