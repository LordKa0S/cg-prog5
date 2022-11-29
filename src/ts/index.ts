import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshPhongMaterial, MeshStandardMaterial, PerspectiveCamera, Scene, SphereGeometry, Vector3, WebGLRenderer } from 'three';
import '../scss/style.scss';

const main = () => {
    const shadowSize = 64;

    const ballRadius = 1;

    const wallColor = "lightsteelblue";
    const wallBreadth = 2;
    const wallHorizontalOffset = 24;

    const paddleLength = 6;
    const paddleBreadth = 1;
    const paddleOffset = wallHorizontalOffset + (2 * wallBreadth);

    const scene = new Scene();
    const camera = new PerspectiveCamera(112.5, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    const ambientLight = new AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);


    const directionalLightFront = new DirectionalLight(0xffffff, 0.5);
    directionalLightFront.position.set(0, 0, 25);
    directionalLightFront.castShadow = true;
    directionalLightFront.shadow.camera.left = - shadowSize;
    directionalLightFront.shadow.camera.right = shadowSize;
    directionalLightFront.shadow.camera.top = shadowSize;
    directionalLightFront.shadow.camera.bottom = - shadowSize;
    scene.add(directionalLightFront);

    const directionalLightRear = new DirectionalLight(0xffffff, 0.5);
    directionalLightRear.position.set(0, 0, -25);
    directionalLightRear.castShadow = true;
    directionalLightRear.shadow.camera.left = - shadowSize;
    directionalLightRear.shadow.camera.right = shadowSize;
    directionalLightRear.shadow.camera.top = shadowSize;
    directionalLightRear.shadow.camera.bottom = - shadowSize;
    scene.add(directionalLightRear);

    const directionalLightRight = new DirectionalLight(0x404040, 0.5);
    directionalLightRight.position.set(25, 0, 0);
    directionalLightRight.castShadow = true;
    directionalLightRight.shadow.camera.left = - shadowSize;
    directionalLightRight.shadow.camera.right = shadowSize;
    directionalLightRight.shadow.camera.top = shadowSize;
    directionalLightRight.shadow.camera.bottom = - shadowSize;
    scene.add(directionalLightRight);

    const directionalLightLeft = new DirectionalLight(0x404040, 0.5);
    directionalLightLeft.position.set(-25, 0, 0);
    directionalLightLeft.castShadow = true;
    directionalLightLeft.shadow.camera.left = - shadowSize;
    directionalLightLeft.shadow.camera.right = shadowSize;
    directionalLightLeft.shadow.camera.top = shadowSize;
    directionalLightLeft.shadow.camera.bottom = - shadowSize;
    scene.add(directionalLightLeft);

    const directionalLightTop = new DirectionalLight(0x404040, 0.5);
    directionalLightTop.position.set(0, 25, 0);
    directionalLightTop.castShadow = true;
    directionalLightTop.shadow.camera.left = - shadowSize;
    directionalLightTop.shadow.camera.right = shadowSize;
    directionalLightTop.shadow.camera.top = shadowSize;
    directionalLightTop.shadow.camera.bottom = - shadowSize;
    scene.add(directionalLightTop);

    const paddleGeometry = new BoxGeometry(paddleLength, paddleBreadth, paddleLength);
    const paddleMaterial = new MeshStandardMaterial({ color: 'coral' });
    const paddle = new Mesh(paddleGeometry, paddleMaterial);
    paddle.receiveShadow = true;
    paddle.position.setY(-paddleOffset);
    scene.add(paddle);

    const ballGeometry = new SphereGeometry(ballRadius);
    const ballMaterial = new MeshPhongMaterial({ color: 'red' });
    const ball = new Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    scene.add(ball);

    const initialDirection = new Vector3(0.1, 0.1, 0);
    const ballDirection = new Vector3(initialDirection.x, initialDirection.y, initialDirection.z);

    const wallDepth = (2 * wallHorizontalOffset) + wallBreadth;
    const sideWallLength = 2 * (paddleOffset);

    const rightWallGeometry = new BoxGeometry(wallBreadth, sideWallLength, wallDepth);
    const rightWallMaterial = new MeshStandardMaterial({ color: wallColor });
    const rightWall = new Mesh(rightWallGeometry, rightWallMaterial);
    rightWall.receiveShadow = true;
    rightWall.position.setX(wallHorizontalOffset);
    scene.add(rightWall);

    const leftWallGeometry = new BoxGeometry(wallBreadth, sideWallLength, wallDepth);
    const leftWallMaterial = new MeshStandardMaterial({ color: wallColor });
    const leftWall = new Mesh(leftWallGeometry, leftWallMaterial);
    leftWall.receiveShadow = true;
    leftWall.position.setX(-wallHorizontalOffset);
    scene.add(leftWall);

    const rearWallGeometry = new BoxGeometry(wallDepth, sideWallLength, wallBreadth);
    const rearWallMaterial = new MeshStandardMaterial({ color: wallColor });
    const rearWall = new Mesh(rearWallGeometry, rearWallMaterial);
    rearWall.receiveShadow = true;
    rearWall.position.setZ(-wallHorizontalOffset);
    scene.add(rearWall);

    const frontWallGeometry = new BoxGeometry(wallDepth, sideWallLength, wallBreadth);
    const frontWallMaterial = new MeshStandardMaterial({ color: wallColor });
    const frontWall = new Mesh(frontWallGeometry, frontWallMaterial);
    frontWall.receiveShadow = true;
    frontWall.position.setZ(wallHorizontalOffset);
    scene.add(frontWall);
    frontWall.visible = false;

    const topWallGeometry = new BoxGeometry(wallHorizontalOffset * 2 + wallBreadth, wallBreadth * 2, wallHorizontalOffset * 2 + wallBreadth);
    const topWallMaterial = new MeshStandardMaterial({ color: wallColor });
    const topWall = new Mesh(topWallGeometry, topWallMaterial);
    const topWallOffset = wallHorizontalOffset + wallBreadth;
    topWall.position.setY(topWallOffset);
    scene.add(topWall);

    let angle = 0;
    const keyHandler = (event: KeyboardEvent) => {
        const changeBy = 0.5;
        if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
            let horizontalChange = changeBy;
            if (event.key === "ArrowLeft") {
                horizontalChange *= -1;
            }
            const newHorizontalPosition = paddle.position.x + horizontalChange;
            const safeHorizontalOffset = wallHorizontalOffset - (wallBreadth / 2) - (paddleLength / 2);
            if (Math.abs(newHorizontalPosition) > safeHorizontalOffset) {
                return;
            }
            paddle.position.setX(newHorizontalPosition);
        }
        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
            let verticalChange = changeBy;
            if (event.key === "ArrowUp") {
                verticalChange *= -1;
            }
            const newVerticalPosition = paddle.position.z + verticalChange;
            const safeVerticalOffset = wallHorizontalOffset - (wallBreadth / 2) - (paddleLength / 2);
            if (Math.abs(newVerticalPosition) > safeVerticalOffset) {
                return;
            }
            paddle.position.setZ(newVerticalPosition);
        }
        if (["n", "m"].includes(event.key)) {
            let angleChange = changeBy * Math.PI / 10;
            if (event.key === "n") {
                angleChange *= -1;
            }
            angle += angleChange;
            if (angle < 0) {
                angle += (2 * Math.PI);
            }
            if (angle > 2 * Math.PI) {
                angle -= (2 * Math.PI);
            }
            camera.position.z = 50 * Math.cos(angle);
            camera.position.x = 50 * Math.sin(angle);
            camera.lookAt(0, 0, 0);
            console.log(angle / Math.PI);
            if (angle <= Math.PI / 4 || angle >= (7 * Math.PI / 4)) {
                frontWall.visible = false;
            } else {
                frontWall.visible = true;
            }
            if (angle >= Math.PI / 4 && angle <= (3 * Math.PI / 4)) {
                rightWall.visible = false;
            } else {
                rightWall.visible = true;
            }
            if (angle >= (3 * Math.PI / 4) && angle <= (5 * Math.PI / 4)) {
                rearWall.visible = false;
            } else {
                rearWall.visible = true;
            }
            if (angle >= (5 * Math.PI / 4) && angle <= (7 * Math.PI / 4)) {
                leftWall.visible = false;
            } else {
                leftWall.visible = true;
            }
        }
    }

    const animate = () => {
        requestAnimationFrame(animate);
        ball.position.add(ballDirection);
        const safeHorizontalOffset = wallHorizontalOffset - (wallBreadth / 2) - ballRadius;
        if (Math.abs(ball.position.x) >= safeHorizontalOffset) {
            ballDirection.setX(-ballDirection.x);
        }
        const ballSafeTopOffset = topWallOffset - wallBreadth - ballRadius;
        if (ball.position.y >= ballSafeTopOffset) {
            ballDirection.setY(-ballDirection.y);
        }
        const ballBottomMarginOfError = paddleOffset - ballRadius;
        const ballSafeBottomOffset = ballBottomMarginOfError - (paddleBreadth / 2);
        if (ball.position.y <= -ballSafeBottomOffset &&
            ball.position.y >= -ballBottomMarginOfError &&
            Math.abs(ball.position.x - paddle.position.x) <= (paddleLength / 2)) {
            ballDirection.setY(-ballDirection.y);
        }
        renderer.render(scene, camera);
    };

    animate();
    window.addEventListener("keydown", keyHandler);
};

main();
