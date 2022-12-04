import { AmbientLight, Box3, BoxGeometry, Color, DirectionalLight, Mesh, MeshPhongMaterial, MeshStandardMaterial, MeshToonMaterial, PerspectiveCamera, Plane, Scene, Sphere, SphereGeometry, Vector3, WebGLRenderer } from 'three';
import '../scss/style.scss';

interface ProgramOptions {
    demo: boolean,
}

const getProgramOptions = (): ProgramOptions => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
        demo: searchParams.has('demo'),
    };
}


const main = (options: ProgramOptions) => {
    const shadowSize = 64;

    const ballRadius = 1;

    const minBallSpeed = 0.2;
    const maxBallSpeed = 0.4;

    const paddleSpeed = 0.4;

    const wallColor = "lightsteelblue";
    const wallBreadth = 2;
    const wallHorizontalOffset = 24;

    const paddleLength = 6;
    const paddleHeight = 1;
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

    const paddleGeometry = new BoxGeometry(paddleLength, paddleHeight, paddleLength);
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

    const initialDirection = new Vector3(1, 1, 1);
    const ballDirection = new Vector3(initialDirection.x, initialDirection.y, initialDirection.z);
    ballDirection.setLength(minBallSpeed + (maxBallSpeed - minBallSpeed) * Math.random());

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

    const brickHeight = paddleHeight * 2;
    const numBrickHalfVertical = 2;
    const numBrickHalfHorizontal = 3;

    const brickLength = (wallHorizontalOffset - (wallBreadth / 2)) / numBrickHalfHorizontal;
    const multipliers = [1, -1];

    const bricks: Mesh<BoxGeometry, MeshToonMaterial>[] = [];

    for (let brickColumn = 0; brickColumn < numBrickHalfHorizontal; brickColumn++) {
        const absBrickX = (brickColumn + 0.5) * brickLength;
        for (const mutliplierX of multipliers) {
            const brickX = mutliplierX * absBrickX;
            for (let brickDepthColumn = 0; brickDepthColumn < numBrickHalfHorizontal; brickDepthColumn++) {
                const absBrickZ = (brickDepthColumn + 0.5) * brickLength;
                for (const multiplierZ of multipliers) {
                    const brickZ = multiplierZ * absBrickZ;
                    for (let brickRow = 0; brickRow < numBrickHalfVertical; brickRow++) {
                        const absBrickY = (brickRow + 0.5) * brickHeight;
                        for (const multiplierY of multipliers) {
                            const brickY = multiplierY * absBrickY;
                            const brickGeometry = new BoxGeometry(brickLength, brickHeight, brickLength);
                            const brickColor = new Color(0.25 + ((brickColumn + 1) * 0.5 / numBrickHalfHorizontal), 0.75 - (brickRow * 0.5 / numBrickHalfHorizontal), 0.25 + ((brickDepthColumn + 1) * 0.5 / numBrickHalfHorizontal));
                            const brickMaterial = new MeshToonMaterial({ color: brickColor });
                            const brick = new Mesh(brickGeometry, brickMaterial);
                            brick.position.set(brickX, brickY, brickZ);
                            brick.position.setY(brick.position.y + wallHorizontalOffset - wallBreadth * 3);
                            scene.add(brick);
                            bricks.push(brick);
                            brickGeometry.boundingBox = new Box3().setFromObject(brick);
                        }
                    }
                }
            }
        }
    }

    let angle = 0;
    const arrowActive = {
        up: false,
        down: false,
        left: false,
        right: false,
    };

    const keyDownHandler = (event: KeyboardEvent) => {
        if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
            if (event.key === "ArrowLeft") {
                arrowActive.left = true;
            } else {
                arrowActive.right = true;
            }
        }
        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
            if (event.key === "ArrowUp") {
                arrowActive.up = true;
            } else {
                arrowActive.down = true;
            }
        }
        if (["n", "m"].includes(event.key)) {
            let angleChange = 0.5 * Math.PI / 10;
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

    const keyUpHandler = (event: KeyboardEvent) => {
        if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
            if (event.key === "ArrowLeft") {
                arrowActive.left = false;
            } else {
                arrowActive.right = false;
            }
        }
        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
            if (event.key === "ArrowUp") {
                arrowActive.up = false;
            } else {
                arrowActive.down = false;
            }
        }
    };

    const animate = () => {
        requestAnimationFrame(animate);

        ball.position.add(ballDirection);
        const safeHorizontalOffset = wallHorizontalOffset - (wallBreadth / 2) - ballRadius;
        if (Math.abs(ball.position.x) >= safeHorizontalOffset) {
            ballDirection.setX(-ballDirection.x);
        }
        if (Math.abs(ball.position.z) >= safeHorizontalOffset) {
            ballDirection.setZ(-ballDirection.z);
        }
        const ballSafeTopOffset = topWallOffset - wallBreadth - ballRadius;
        if (ball.position.y >= ballSafeTopOffset) {
            ballDirection.setY(-ballDirection.y);
        }
        const ballBottomMarginOfError = paddleOffset - ballRadius;
        const ballSafeBottomOffset = ballBottomMarginOfError - (paddleHeight / 2);
        if (ball.position.y <= -ballSafeBottomOffset &&
            ball.position.y >= -ballBottomMarginOfError &&
            Math.abs(ball.position.x - paddle.position.x) <= (paddleLength / 2) &&
            Math.abs(ball.position.z - paddle.position.z) <= (paddleLength / 2)) {
            ballDirection.setY(-ballDirection.y);
            ballDirection.setLength(minBallSpeed + (maxBallSpeed - minBallSpeed) * Math.random());
        }

        for (const brick of bricks) {
            const ballSphere = new Sphere().set(ball.position, ballRadius);
            if (brick.visible && brick.geometry.boundingBox?.intersectsSphere(ballSphere)) {
                const brickMin = brick.geometry.boundingBox?.min;
                const brickMax = brick.geometry.boundingBox?.max;
                const brickBottomFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), brickMin);
                const brickTopFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), brickMax);
                if (brickBottomFace.intersectsSphere(ballSphere) || brickTopFace.intersectsSphere(ballSphere)) {
                    ballDirection.setY(-ballDirection.y);
                    brick.visible = false;
                    break;
                }
                const brickLeftFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(1, 0, 0), brickMin);
                const brickRightFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(1, 0, 0), brickMax);
                if (brickLeftFace.intersectsSphere(ballSphere) || brickRightFace.intersectsSphere(ballSphere)) {
                    ballDirection.setX(-ballDirection.x);
                    brick.visible = false;
                    break;
                }
                const brickRearFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, 1), brickMin);
                const brickFrontFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, 1), brickMax);
                if (brickFrontFace.intersectsSphere(ballSphere) || brickRearFace.intersectsSphere(ballSphere)) {
                    ballDirection.setZ(-ballDirection.z);
                    brick.visible = false;
                    break;
                }
            }
        }

        const paddleDirection = new Vector3();
        if (arrowActive.left) {
            paddleDirection.x -= 1;
        }
        if (arrowActive.right) {
            paddleDirection.x += 1;
        }
        if (arrowActive.up) {
            paddleDirection.z -= 1;
        }
        if (arrowActive.down) {
            paddleDirection.z += 1;
        }
        paddleDirection.setLength(paddleSpeed);
        const newPaddlePosition = paddle.position.clone();
        newPaddlePosition.add(paddleDirection);
        const safePaddleOffset = wallHorizontalOffset - (wallBreadth / 2) - (paddleLength / 2);
        if (Math.abs(newPaddlePosition.x) > safePaddleOffset) {
            paddleDirection.setX(0)
        }
        if (Math.abs(newPaddlePosition.z) > safePaddleOffset) {
            paddleDirection.setZ(0);
        }
        paddleDirection.setLength(paddleSpeed);
        paddle.position.add(paddleDirection);

        if (options.demo) {
            if (Math.abs(ball.position.x) < safePaddleOffset) {
                paddle.position.setX(ball.position.x);
            }
            if (Math.abs(ball.position.z) < safePaddleOffset) {
                paddle.position.setZ(ball.position.z);
            }
        }

        renderer.render(scene, camera);
    };

    animate();
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
};

const options = getProgramOptions();
main(options);
