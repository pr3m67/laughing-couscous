// ES Module imports
// Correct ES Module imports for browser
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/OrbitControls.js';


// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Projects - rotating cubes
const projects = [
    { name: "Project 1", color: 0xff0000 },
    { name: "Project 2", color: 0x00ff00 },
    { name: "Project 3", color: 0x0000ff },
    { name: "Project 4", color: 0xffff00 },
    { name: "Project 5", color: 0xff00ff },
];

const cubes = [];
projects.forEach((proj, i) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: proj.color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(i * 2 - (projects.length-1), 0, 0);
    cube.name = proj.name;
    scene.add(cube);
    cubes.push(cube);
});

// Skills - floating spheres
const skills = [
    { name: "HTML", color: 0xffa500, pos: [-3,2,-2] },
    { name: "CSS", color: 0x00ffff, pos: [3,2,-2] },
    { name: "JavaScript", color: 0xffff00, pos: [-3,-2,-2] },
    { name: "Python", color: 0x00ff00, pos: [3,-2,-2] }
];

skills.forEach(skill => {
    const geom = new THREE.SphereGeometry(0.5,32,32);
    const mat = new THREE.MeshStandardMaterial({ color: skill.color });
    const sphere = new THREE.Mesh(geom, mat);
    sphere.position.set(...skill.pos);
    sphere.name = skill.name;
    scene.add(sphere);
});

// Particle background
const particlesCount = 200;
const particlesGeom = new THREE.BufferGeometry();
const particlesPos = [];
for(let i=0;i<particlesCount*3;i++){
    particlesPos.push((Math.random()-0.5)*20);
}
particlesGeom.setAttribute('position', new THREE.Float32BufferAttribute(particlesPos,3));
const particlesMat = new THREE.PointsMaterial({ color:0xffffff, size:0.05 });
const particles = new THREE.Points(particlesGeom, particlesMat);
scene.add(particles);

camera.position.z = 10;

// Raycaster for clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event)=>{
    mouse.x = (event.clientX / window.innerWidth)*2 -1;
    mouse.y = -(event.clientY / window.innerHeight)*2 +1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if(intersects.length>0){
        alert(`You clicked on ${intersects[0].object.name}`);
    }
});

// Animate
function animate(){
    requestAnimationFrame(animate);

    cubes.forEach(cube=>{
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    });

    controls.update();
    renderer.render(scene,camera);
}
animate();

// Resize
window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
