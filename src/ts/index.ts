import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, PerspectiveCamera, Scene, SphereGeometry, Vector2, Vector3, WebGLRenderer } from 'three';
import '../scss/style.scss';

const main = () => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new AmbientLight(0x404040); // soft white light
    scene.add(light);
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    const boxDepth = 1;

    const paddleLength = 6;
    const paddleBreadth = 1;
    const paddleGeometry = new BoxGeometry(paddleLength, paddleBreadth, boxDepth);
    const paddleMaterial = new MeshStandardMaterial({ color: 'coral' });
    const paddle = new Mesh(paddleGeometry, paddleMaterial);
    const paddleOffset = 28;
    paddle.position.setY(-paddleOffset);
    scene.add(paddle);

    const ballRadius = 1;

    const ballGeometry = new SphereGeometry(ballRadius);
    const ballMaterial = new MeshPhongMaterial({ color: 'red' });
    const ball = new Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    const ballDirection = new Vector2(0.1, 0.1);

    const wallColor = "lightsteelblue"
    const sideWallLength = 56;
    const wallBreadth = 3;
    const wallHorizontalOffset = 24;

    const rightWallGeometry = new BoxGeometry(wallBreadth, sideWallLength, boxDepth);
    const rightWallMaterial = new MeshStandardMaterial({ color: wallColor });
    const rightWall = new Mesh(rightWallGeometry, rightWallMaterial);
    rightWall.position.setX(-wallHorizontalOffset);
    scene.add(rightWall);

    const leftWallGeometry = new BoxGeometry(wallBreadth, sideWallLength, boxDepth);
    const leftWallMaterial = new MeshStandardMaterial({ color: wallColor });
    const leftWall = new Mesh(leftWallGeometry, leftWallMaterial);
    leftWall.position.setX(wallHorizontalOffset);
    scene.add(leftWall);

    const topWallGeometry = new BoxGeometry(48, wallBreadth * 2, boxDepth);
    const topWallMaterial = new MeshStandardMaterial({ color: wallColor });
    const topWall = new Mesh(topWallGeometry, topWallMaterial);
    const topWallOffset = wallHorizontalOffset + 1
    topWall.position.setY(topWallOffset);
    scene.add(topWall);

    camera.position.z = 36;
    const keyHandler = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
            paddle.position.setX(paddle.position.x - 0.5);
        } else if (event.key === "ArrowRight") {
            paddle.position.setX(paddle.position.x + 0.5);
        }
    }
    const animate = () => {
        requestAnimationFrame(animate);
        ball.position.add(new Vector3(ballDirection.x, ballDirection.y));
        const safeHorizontalOffset = wallHorizontalOffset - (wallBreadth / 2) - ballRadius;
        if (Math.abs(ball.position.x) >= safeHorizontalOffset) {
            ballDirection.setX(-ballDirection.x);
        }
        const ballSafeTopOffset = topWallOffset - wallBreadth - ballRadius;
        if (ball.position.y >= ballSafeTopOffset) {
            ballDirection.setY(-ballDirection.y);
        }
        const ballSafeBottomOffset = paddleOffset - (paddleBreadth / 2) - ballRadius;
        if (ball.position.y <= -ballSafeBottomOffset) {
            ballDirection.setY(-ballDirection.y);
        }
        renderer.render(scene, camera);
    };
    animate();
    window.addEventListener("keydown", keyHandler);
};

main();
