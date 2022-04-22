import './style.css';
import * as THREE from 'three';

// Setup our stage for the game
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#background')
});

// Begin setting up the view for the user
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setX(30);
camera.position.setY(30);
camera.position.setZ(30);

renderer.render(scene, camera);

// Setup the game characters
const player
const enemy

// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `
