import * as THREE from "three";
import { DirectionalLight } from "three";
import { OrbitControls } from 'OrbitControls';

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
renderer.setClearColor( 0x000000, 1);
// scene.background = new THREE.Color(0xa0a0a0)   // Sets the scene background to transparent
// scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
camera.position.setY(50);
camera.position.setZ(30);
// camera.rotation.set();

renderer.render(scene, camera);

// Setup camera controls. Giving me a lot of problems right now

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
const gridHelper1 = new THREE.GridHelper(200, 50);
const gridHelper2 = new THREE.GridHelper(200, 50);
const gridHelper3 = new THREE.GridHelper(200, 50);
const gridHelper4 = new THREE.GridHelper(200, 50);
const gridHelper5 = new THREE.GridHelper(200, 50);
const gridHelper6 = new THREE.GridHelper(200, 50);
gridHelper2.rotation.x = Math.PI / 2
gridHelper3.rotation.x = Math.PI / 2
gridHelper4.rotation.z = Math.PI / 2
gridHelper5.rotation.z = Math.PI / 2
gridHelper2.position.setZ(100)
gridHelper2.position.setY(100)
gridHelper3.position.setZ(-100)
gridHelper3.position.setY(100)
gridHelper4.position.setX(100)
gridHelper4.position.setY(100)
gridHelper5.position.setX(-100)
gridHelper5.position.setY(100)
gridHelper6.position.setY(200)
scene.add(gridHelper1, gridHelper2, gridHelper3, gridHelper4, gridHelper5, gridHelper6);

////////////////////////////////////////////////////////////////////////////////

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347, wireframe: false} );
const torus = new THREE.Mesh( geometry, material );
torus.position.setY(25)
scene.add(torus)

// const objLoader = new OBJLoader();
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

    renderer.render(scene, camera);
}


// Setup the game characters
// const player
// const enemy

// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `

animate();