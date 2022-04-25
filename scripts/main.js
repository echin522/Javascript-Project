import * as THREE from "three";
import { DirectionalLight } from "three";
import { OrbitControls } from 'OrbitControls';
import { OBJLoader } from "/node_modules/three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "/node_modules/three/examples/jsm/loaders/MTLLoader.js";
import Stats from "/node_modules/three/examples/jsm/libs/stats.module.js";

////////////////////////////////////////////////////////////////////////////////

// Setup our stage for the game
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000);
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: document.querySelector('#background')
});

// Begin setting up the view for the user
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)
renderer.setClearColor( 0x000000, 0);
// scene.background = new THREE.Color(0xa0a0a0)   // Sets the scene background to transparent
// scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
camera.position.setY(100);
camera.position.setZ(30);
// camera.rotation.set();

function render() {
    renderer.render(scene, camera);
}

render();

////////////////////////////////////////////////////////////////////////////////

// Setup the lighting environments
const keyLight = new DirectionalLight(0xffffff, 1.0);
keyLight.position.set(-100, 0, 100);
const fillLight = new DirectionalLight(0xffffff, 0.75);
fillLight.position.set(20, 20, 20);
const backLight = new DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();
scene.add(keyLight, fillLight, backLight);

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

const myGrid = gridMaker(boxSize, numGridDivs, 6);
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
scene.add(torus)

const modLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

// Load in the model within the texture loader. The MTL file must be loaded in first 
// This is mostly boilerplate code from the official three.js documentation website 
mtlLoader.load(
    "/resources/models/jotaro/Jotaro.mtl",
    function(materials) {
        materials.preload();
        modLoader.load(
            "/resources/models/jotaro/Jotaro.obj",
        
            function (obj) {
                scene.add(obj);
            },
            // onProgress and onError functions are optional. Testing passed so poggers
            // function (xhr) {
            //     console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            // },
        
            // function (err) {
            //     console.error( "error has occured" );
            // },
        )
    },
    // function (xhr) {
    //     console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    // },

    // function (err) {
    //     console.error( "error has occured" );
    // },
)

////////////////////////////////////////////////////////////////////////////////

// FPS Counter for fun
const stats = Stats();
document.body.appendChild(stats.dom);

// camera.position.set(0, 0, 20);

// load a resource
// objLoader.load(
// 	// resource URL
// 	'/resources/models/jotaro/Jotaro.obj',
// 	// called when resource is loaded
// 	function ( object ) {
// 		scene.add( object );
// 	},
// 	// called when loading is in progresses
// 	function ( xhr ) {
// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
// 	},
// 	// called when loading has errors
// 	function ( error ) {
// 		console.log( 'An error happened' );
// 	}
// );

var animate = function() {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    controls.update();
    stats.update

    render();
}


// Setup the game characters
// const player
// const enemy

// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `

animate();