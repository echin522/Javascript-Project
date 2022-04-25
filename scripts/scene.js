import * as THREE from "three";
import { DirectionalLight } from "three";
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from "/node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "/node_modules/three/examples/jsm/libs/stats.module.js";

////////////////////////////////////////////////////////////////////////////////

// Setup our stage for the game
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000);
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: document.querySelector('#background'),
});

const bgTexture = new THREE.TextureLoader().load('/resources/backgrounds/cairo.jpeg');
// scene.background = bgTexture;

// Begin setting up the view for the user
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)
renderer.setClearColor( 0x000000, 1);
// scene.background = new THREE.Color(0xdddddd)   // Sets the scene background to transparent
// scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
camera.position.setX(-2);
camera.position.setY(10);
camera.position.setZ(16);
camera.lookAt(new THREE.Vector3(10,10,-100))
// camera.rotation.set();

function render() {
    renderer.render(scene, camera);
}

render();

////////////////////////////////////////////////////////////////////////////////

// Setup the lighting environments
const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
scene.add(hemiLight);


const keyLight = new DirectionalLight(0xffffff, 1.0);
keyLight.position.set(-100, 0, 100);
const fillLight = new DirectionalLight(0xffffff, 0.75);
fillLight.position.set(20, 20, 20);
const backLight = new DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();
// scene.add(keyLight, fillLight, backLight);

const keyLightHelper = new THREE.PointLightHelper(keyLight);
const fillLightHelper = new THREE.PointLightHelper(fillLight);
const backLightHelper = new THREE.PointLightHelper(backLight);
scene.add(keyLightHelper, fillLightHelper, backLightHelper);

////////////////////////////////////////////////////////////////////////////////

// Setup camera controls and grid for testing
// THIS IS VERY UGLY, PLEASE REFACTOR AND MAKE IT MORE DRY LATER
const controls = new OrbitControls(camera, renderer.domElement);
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
myGrid[1].position.setZ(100);
myGrid[1].position.setY(100);
myGrid[2].position.setZ(-100);
myGrid[2].position.setY(100);
myGrid[3].position.setX(100);
myGrid[3].position.setY(100);
myGrid[4].position.setX(-100);
myGrid[4].position.setY(100);
myGrid[5].position.setY(200);
scene.add(myGrid[0], myGrid[1], myGrid[2], myGrid[3], myGrid[4], myGrid[5]);

////////////////////////////////////////////////////////////////////////////////

// Start loading in the 3D models
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347, wireframe: false} );
const torus = new THREE.Mesh( geometry, material );
torus.position.setY(25)
// scene.add(torus)

const loader = new GLTFLoader();
loader.load(
    "/resources/models/jotaro/jotaro.gltf",
    function (gltf) {
        scene.add(gltf.scene);
        gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

        gltf.scene.scale.set(5,5,5);
        gltf.scene.position.setX(-4);
        gltf.scene.position.setZ(7);
        gltf.scene.setRotationFromEuler(new THREE.Euler( 0, 2.6, 0, 'XYZ' ))
    }
)

loader.load(
    "/resources/models/dio/dio.gltf",
    function (gltf) {
        scene.add(gltf.scene);
        gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

        gltf.scene.scale.set(5,5,5);
        gltf.scene.position.setX(10);
        gltf.scene.position.setZ(-10);
        gltf.scene.setRotationFromEuler(new THREE.Euler( 0, -0.5, 0, 'XYZ' ))
    }
)

////////////////////////////////////////////////////////////////////////////////

// FPS Counter for fun
const stats = Stats();
document.body.appendChild(stats.dom);

var animate = function() {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    controls.update();
    stats.update();

    // console.log(camera.position)
    render();
}

////////////////////////////////////////////////////////////////////////////////

animate();