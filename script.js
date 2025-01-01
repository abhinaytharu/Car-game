// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 10, -10);
scene.add(directionalLight);

// Load Player Car Model
let playerCar;
const loader = new THREE.GLTFLoader();
loader.load('assets/scene.gltf', function(gltf) {
    playerCar = gltf.scene;
    playerCar.scale.set(0.1, 0.1, 0.1);  // Adjust scale to make the car smaller
    playerCar.position.set(0, 0.25, 0);
    scene.add(playerCar);
});

// Road
const roadGeometry = new THREE.PlaneGeometry(10, 200);
const roadTexture = new THREE.TextureLoader().load('https://cdn.pixabay.com/photo/2016/03/09/09/45/asphalt-1246725_1280.jpg');
const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
scene.add(road);

// Obstacles
const obstacles = [];
function createObstacle() {
    const obstacleGeometry = new THREE.BoxGeometry(1, 0.5, 2);
    const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set((Math.random() - 0.5) * 8, 0.25, -50);
    obstacles.push(obstacle);
    scene.add(obstacle);
}

// Generate obstacles periodically
setInterval(createObstacle, 2000);

// Camera Position
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Movement Controls
const keys = { ArrowLeft: false, ArrowRight: false };
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Score and Timer
let score = 0;
let gameOver = false;
const scoreDisplay = document.createElement('div');
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '10px';
scoreDisplay.style.left = '10px';
scoreDisplay.style.color = 'white';
scoreDisplay.style.fontSize = '20px';
document.body.appendChild(scoreDisplay);

function updateScore() {
    score += 1;
    scoreDisplay.textContent = `Score: ${score}`;
}
setInterval(updateScore, 100);

// Game Loop
function animate() {
    if (gameOver) return;

    requestAnimationFrame(animate);

    // Move Player Car
    if (playerCar) {
        if (keys.ArrowLeft && playerCar.position.x > -4.5) playerCar.position.x -= 0.1;
        if (keys.ArrowRight && playerCar.position.x < 4.5) playerCar.position.x += 0.1;
    }

    // Move Obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.position.z += 0.2;

        // Check for collision
        if (playerCar && obstacle.position.z > 0 && Math.abs(obstacle.position.x - playerCar.position.x) < 1 && Math.abs(obstacle.position.z - playerCar.position.z) < 1) {
            alert("Game Over! Your Score: " + score);
            gameOver = true;
        }

        // Remove obstacle if out of view
        if (obstacle.position.z > 10) {
            scene.remove(obstacle);
            obstacles.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}

animate();

// Background Music
const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
audio.loop = true;
audio.play();
