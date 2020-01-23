import ControlKit from 'controlkit';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import modelFile from './suzanne.glb';
import jsDeformer from './deformer';
import { deformer as wasmDeformer } from '../deformer-rs/Cargo.toml';

let mesh;
let origPosition;

/*
 * Quick and dirty benchmark
 */

const N = 1000;
const runs = 20;

function bench(f) {
	let total = 0;
	for (let r = 0; r < runs; r++) {
		const t = performance.now();
		for (let i = 0; i < N; i++) {
			const position = mesh.geometry.attributes.position;
			f(position.array, origPosition, settings.angle);
		}
		total += performance.now() - t;
	}

	return Math.round(total / runs);
}

/*
 * UI
 */

const controlKit = new ControlKit();
const panel = controlKit.addPanel();
panel.addButton('bench', () => {
	if (!mesh) {
		alert('Mesh not ready');
		return;
	}



	const jsTime = bench(jsDeformer);
	const wasmTime = bench(wasmDeformer);

	alert(`js: ${jsTime}ms\nwasm: ${wasmTime}ms`);
});

const settings = {
	angle: 0,
	angleRange: [0, 3],
	deformer: 'js',
	deformers: ['js', 'wasm'],
};

panel.addSelect(settings, 'deformers', {target: 'deformer'});

panel.addSlider(
	settings,
	'angle',
	'angleRange',
	{
		onChange: () => {
			const f = settings.deformer === 'js' ? jsDeformer : wasmDeformer;
			const position = mesh.geometry.attributes.position;
			f(position.array, origPosition, settings.angle);
			position.needsUpdate = true;
		},
	},
);

/*
 * Basic THREE.js setup
 */

const container = document.createElement('div');
document.body.appendChild(container);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 5);

const scene = new THREE.Scene();

const light = new THREE.PointLight(0xFFFFFF, 1);
light.position.set(0, 10, 10);
scene.add(light);

const ambient = new THREE.AmbientLight(0xEEA97F);
scene.add(ambient);

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearColor(0x719886, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

/*
 * Load model
 */

const material = new THREE.MeshPhongMaterial({
	color: 0xF4905E,
	flatShading: true,
});

const loader = new GLTFLoader();
loader.load(modelFile, gltf => {
	mesh = gltf.scene.children[0];
	mesh.material = material;
	origPosition = new Float32Array(mesh.geometry.attributes.position.array);

	scene.add(mesh);
});

/*
 * Run
 */

const animate = () => {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
};

animate();
