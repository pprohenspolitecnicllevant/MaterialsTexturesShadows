import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";
import "./style.css";

import Cosa from './src/Cosa.js'

import mirlo from './src/img/rock_wall_11_diff_2k.jpg'

const cosa = new Cosa()
// Declaració d'elements principals
//Loader de models GLTF
let loader = null;
//Loader de textures
let textureLoader = null;
const rotationSpeed = 0.0001;
let scene = null;
let camera = null;
let renderer = null;
// array d’objectes dels quals hem d’actualitzar la rotació.
const objects = [];

setupScene();

const albedoRock = mirlo;
const normalRock = "textures/rockwall/rock_wall_11_nor_gl_2k.jpg";
const armRock = "textures/rockwall/rock_wall_11_arm_2k.jpg";
const dispRock = "textures/rockwall/rock_wall_11_disp_2k.png";

const albedoRockTexture = textureLoader.load(albedoRock);
const normalRockTexture = textureLoader.load(normalRock);
const armRockTexture = textureLoader.load(armRock);
const dispRockTexture = textureLoader.load(dispRock);

const albedoMud = "textures/mud/textures/brown_mud_leaves_01_diff_1k.jpg";
const normalMud = "textures/mud/textures/brown_mud_leaves_01_nor_gl_1k.jpg";
const roughMud = "textures/mud/textures/brown_mud_leaves_01_rough_1k.jpg";

const albedoMudTexture = textureLoader.load(albedoMud);
const normalMudTexture = textureLoader.load(normalMud);
const roughMudTexture = textureLoader.load(roughMud);

//plane
const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshStandardMaterial({
  map: albedoMudTexture,
  normalMap: normalMudTexture,
  roughnessMap: roughMudTexture,
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.receiveShadow = true;
plane.position.y = -1;
plane.rotation.x = Math.PI * -0.5;
scene.add(plane);

const sphereGeo = new THREE.SphereGeometry(1);
const sphereMAT = new THREE.MeshStandardMaterial({
  map: albedoRockTexture,
  normalMap: normalRockTexture,
  aoMap: armRockTexture,
  displacementMap: dispRockTexture,
  displacementScale: 0.6,
});

const bolla = new THREE.Mesh(sphereGeo, sphereMAT);
bolla.castShadow = true;
bolla.position.y = 1;
scene.add(bolla);
objects.push(bolla);


camera.lookAt(bolla.position);

////////ENTORN/////////////////
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
  "textures/environmentMaps/sky/px.png",
  "textures/environmentMaps/sky/nx.png",
  "textures/environmentMaps/sky/py.png",
  "textures/environmentMaps/sky/ny.png",
  "textures/environmentMaps/sky/pz.png",
  "textures/environmentMaps/sky/nz.png",
]);

scene.background = environmentMap;
///////////////////////////////

// ////////////////////////////////////////////////
// // assync loading de texture i generació del cub
// ///////////////////////////////////////////////
// textureLoader.load(
//   // resource URL
//   mudTexturePath,

//   // onLoad callback
//   function (texture) {

//     // in this example we create the material when the texture is loaded
//     const material = new THREE.MeshBasicMaterial({
//       map: texture
//     })

//     const cube = new THREE.Mesh(cubeGeometry, material)

//     scene.add(cube)
//     objects.push(cube)
//   },
//   // onError callback
//   function (err) {
//     console.error('An error happened: ' + err)
//   }
// )

// Exemple d´animació amb GSAP, efecte yoyo amb la càmera
gsap.to(camera.position, {
  duration: 3,
  y: 6,
  yoyo: true,
  repeat: -1, // repetir indef
  ease: "power1.inOut", // tipus de transcisió
});



let time = Date.now();
function animate() {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  objects.forEach((obj) => {
    if (obj != null) obj.rotation.y += rotationSpeed * deltaTime;
  });

  camera.lookAt(bolla.position)
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// event javascript per redimensionar de forma responsive
window.addEventListener('resize', () =>
{
    //actualitzem tamany del renderer, de l'aspect ratio de la càmera, i 
    //la matriu de projecció.
    //finalment limitem el pixel ratio a 2 per temes de rendiment
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})


// Preparació de l'escena
function setupScene() {
  //Loader de models GLTF
  loader = new GLTFLoader();
  //Loader de textures
  textureLoader = new THREE.TextureLoader();

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 3, 4);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  //controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  //directional light
  const dirlight = new THREE.DirectionalLight(0xffffff, 2);
  dirlight.castShadow = true;
  dirlight.position.set(4, 4, 2);
  scene.add(dirlight);

  gsap.to(dirlight.position, {
    duration: 10,  
    x: -4,         
    y: 1,
    z: -4,
    repeat: -1,   
    yoyo: true,   
    ease: "power1.inOut",
    onUpdate: () => {
      // Aquí podem afegir qualsevol lògica que necessitem durant l'animació
    },
  });

  //spotlight
  // const spotLight = new THREE.SpotLight(0xffffff, 20, 40, Math.PI/8)
  // spotLight.position.set(-5, 4, 1)
  // spotLight.castShadow=true
  // scene.add(spotLight)
}
