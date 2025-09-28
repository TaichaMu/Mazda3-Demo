import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function startMain(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 光源
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // モデル読み込み
    const loader = new GLTFLoader();
    loader.load('./models/mazda3.glb', (gltf) => {
        scene.add(gltf.scene);
    });

    // OrbitControls（操作は無効）
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enableRotate = false;

    // === カメラ回転制御 ===
    let angle = 0;              // 現在の角度
    const speed = 0.003;        // 回転速度（小さいほどゆっくり）
    const radius = 5;           // 車との距離
    const height = 1.5;         // カメラ高さ

    // 初期位置
    camera.position.set(radius, height, 0);
    camera.lookAt(5, 1, 0);

    function animate() {
        requestAnimationFrame(animate);

        // 時計回り（右回り）
        angle -= speed;

        // カメラ位置更新
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        camera.position.set(x, height, z);
        camera.lookAt(0, 1, 0);

        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // リサイズ対応
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}