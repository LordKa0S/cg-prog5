import { AmbientLight, Box3, BoxGeometry, Color, DirectionalLight, EdgesGeometry, LineBasicMaterial, LineSegments, Mesh, MeshPhongMaterial, MeshStandardMaterial, MeshToonMaterial, PerspectiveCamera, Plane, PlaneGeometry, Scene, Sphere, SphereGeometry, Vector3, WebGLRenderer } from 'three';

interface ProgramOptions {
    demo: boolean,
    fp: boolean,
    pair: boolean,
    music: boolean,
    level: number,
    score: number,
}

const getProgramOptions = (): ProgramOptions => {
    const searchParams = new URLSearchParams(window.location.search);
    const demo = searchParams.has('demo');
    let pair = (searchParams.get('pair') ?? 'true') === 'true';
    const fp = (!pair || !searchParams.has('pair')) && searchParams.has('fp');
    if (fp) {
        pair = false;
    }
    const music = (searchParams.get('music') ?? 'true') === 'true';
    return {
        demo,
        fp,
        pair,
        music,
        level: 1,
        score: 0,
    };
}

const playLevel = (options: ProgramOptions): Promise<void> => {
    const shadowSize = 64;

    const ballRadius = 1;

    const minBallSpeed = 0.2;
    const maxBallSpeed = 0.6;

    const paddleSpeed = 0.4;

    const wallColor = "lightsteelblue";
    const wallBreadth = 2;
    const wallHorizontalOffset = 24;

    const paddleLength = 10 / options.level;
    const paddleHeight = 1;
    const paddleOffset = wallHorizontalOffset + (2 * wallBreadth);

    const scene = new Scene();
    const camera = new PerspectiveCamera(112.5, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new WebGLRenderer({ antialias: true });
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

    const paddleOneGeometry = new BoxGeometry(paddleLength, paddleHeight, paddleLength);
    const paddleOneMaterial = new MeshStandardMaterial({ color: 'coral' });
    const paddleOne = new Mesh(paddleOneGeometry, paddleOneMaterial);
    paddleOne.receiveShadow = true;
    paddleOne.position.setY(-paddleOffset);
    scene.add(paddleOne);

    const paddleTwoGeometry = new BoxGeometry(paddleLength, paddleHeight, paddleLength);
    const paddleTwoMaterial = new MeshStandardMaterial({ color: 'cyan' });
    const paddleTwo = new Mesh(paddleTwoGeometry, paddleTwoMaterial);
    paddleTwo.receiveShadow = true;
    paddleTwo.position.setY(-paddleOffset);
    paddleTwo.position.setX(paddleOne.position.x + paddleLength);
    scene.add(paddleTwo);
    if (!options.pair) {
        paddleTwo.visible = false;
    }

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

    const floorGeometry = new PlaneGeometry(wallHorizontalOffset * 2 + wallBreadth, wallHorizontalOffset * 2 + wallBreadth);
    const floorMaterial = new MeshStandardMaterial({ color: 'DarkSlateGray' });
    const floor = new Mesh(floorGeometry, floorMaterial);
    const floorOffset = paddleOffset + paddleHeight;
    floor.receiveShadow = true;
    floor.position.setY(-floorOffset);
    floor.rotateX(-Math.PI / 2)
    scene.add(floor);

    const brickHeight = paddleHeight * 2;
    const numBrickHalfVertical = 2;
    const numBrickHalfHorizontal = 3;

    const brickLength = (wallHorizontalOffset - (wallBreadth / 2)) / numBrickHalfHorizontal;
    const multipliers = [1, -1];

    const bricks: {
        mesh: Mesh<BoxGeometry, MeshToonMaterial>;
        edges: LineSegments<EdgesGeometry<BoxGeometry>, LineBasicMaterial>;
    }[] = [];

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
                            const brickEdgesGeometry = new EdgesGeometry(brickGeometry);
                            const brickEdges = new LineSegments(brickEdgesGeometry, new LineBasicMaterial({ color: 0xffffff }));
                            brickEdges.position.copy(brick.position);
                            scene.add(brickEdges);
                            bricks.push({ mesh: brick, edges: brickEdges });
                            brickGeometry.boundingBox = new Box3().setFromObject(brick);
                        }
                    }
                }
            }
        }
    }

    let bricksRemain = 8 * (numBrickHalfVertical * numBrickHalfHorizontal * numBrickHalfHorizontal);

    if (options.fp) {
        camera.position.copy(paddleOne.position);
        camera.lookAt(0, 0, 0);
        camera.up = new Vector3(0, 0, 1);
    }

    let angle = 0;

    const arrowActive = {
        up: false,
        down: false,
        left: false,
        right: false,
    };

    const wasdActive = {
        w: false,
        a: false,
        s: false,
        d: false,
    };

    const keyDownHandler = (event: KeyboardEvent) => {
        const music = document.querySelector('audio.music') as HTMLAudioElement;
        if (music?.paused) {
            music.volume = 0.25;
            if (options.music) {
                void music.play();
            }
        }
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
        if (["w", "a", "s", "d"].includes(event.key)) {
            wasdActive[event.key as keyof typeof wasdActive] = true;
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
            const newZ = 50 * Math.cos(angle);
            const newX = 50 * Math.sin(angle);
            if (options.fp) {
                camera.up = new Vector3(newX, 0, newZ).normalize();
            } else {
                camera.position.z = newZ;
                camera.position.x = newX;
                camera.lookAt(0, 0, 0);
            }
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
        if (["w", "a", "s", "d"].includes(event.key)) {
            wasdActive[event.key as keyof typeof wasdActive] = false;
        }
    };

    let score = options.score;

    const updateScoreSpan = () => {
        const scoreSpan = document.querySelector('span.score') as HTMLSpanElement;
        scoreSpan.innerText = score.toString();
    };

    updateScoreSpan();

    const animate = (resolveLevel: { (value: void | PromiseLike<void>): void; (): void; }) => {
        if (bricksRemain > 0) {
            requestAnimationFrame(animate.bind(this, resolveLevel));
        } else {
            options.score = score;
            resolveLevel();
        }

        if (ball.position.y <= - (paddleOffset + paddleHeight)) {
            ball.position.set(0, 0, 0);
            ballDirection.set(-1 + (2 * Math.random()), 1, -1 + (2 * Math.random()));
            ballDirection.setLength(minBallSpeed + (maxBallSpeed - minBallSpeed) * Math.random());
            score -= 2;
            updateScoreSpan();
        }

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
        const isBallDescending = ballDirection.y < 0;
        const ballSafeBottomOffset = ballBottomMarginOfError - (paddleHeight / 2);
        const isBallAtPaddleHeight = ball.position.y <= -ballSafeBottomOffset && ball.position.y >= -ballBottomMarginOfError;
        const isBallOnPaddleOne = Math.abs(ball.position.x - paddleOne.position.x) <= (paddleLength / 2) &&
            Math.abs(ball.position.z - paddleOne.position.z) <= (paddleLength / 2);
        const isBallOnPaddleTwo = Math.abs(ball.position.x - paddleTwo.position.x) <= (paddleLength / 2) &&
            Math.abs(ball.position.z - paddleTwo.position.z) <= (paddleLength / 2);
        if (isBallDescending && isBallAtPaddleHeight && (isBallOnPaddleOne || (options.pair && isBallOnPaddleTwo))) {
            ballDirection.setY(-ballDirection.y / Math.abs(ballDirection.y));
            ballDirection.setX(-1 + (2 * Math.random()))
            ballDirection.setZ(-1 + (2 * Math.random()))
            ballDirection.setLength(minBallSpeed + (maxBallSpeed - minBallSpeed) * Math.random());
        }

        const playBrickSound = () => {
            const sound = document.querySelector('audio.brick') as HTMLAudioElement;
            const soundClone = sound.cloneNode(true) as HTMLAudioElement;
            void soundClone.play();
        }

        for (const { mesh, edges } of bricks) {
            const ballSphere = new Sphere().set(ball.position, ballRadius);
            if (mesh.visible && mesh.geometry.boundingBox?.intersectsSphere(ballSphere)) {
                const brickMin = mesh.geometry.boundingBox?.min;
                const brickMax = mesh.geometry.boundingBox?.max;
                const brickBottomFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), brickMin);
                const brickTopFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), brickMax);
                if (brickBottomFace.intersectsSphere(ballSphere) || brickTopFace.intersectsSphere(ballSphere)) {
                    ballDirection.setY(-ballDirection.y);
                    mesh.visible = false;
                    edges.visible = false;
                    playBrickSound();
                    ++score;
                    updateScoreSpan();
                    bricksRemain -= 1;
                    break;
                }
                const brickLeftFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(1, 0, 0), brickMin);
                const brickRightFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(1, 0, 0), brickMax);
                if (brickLeftFace.intersectsSphere(ballSphere) || brickRightFace.intersectsSphere(ballSphere)) {
                    ballDirection.setX(-ballDirection.x);
                    mesh.visible = false;
                    edges.visible = false;
                    ++score;
                    updateScoreSpan();
                    bricksRemain -= 1;
                    playBrickSound();
                    break;
                }
                const brickRearFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, 1), brickMin);
                const brickFrontFace = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, 1), brickMax);
                if (brickFrontFace.intersectsSphere(ballSphere) || brickRearFace.intersectsSphere(ballSphere)) {
                    ballDirection.setZ(-ballDirection.z);
                    mesh.visible = false;
                    edges.visible = false;
                    ++score;
                    updateScoreSpan();
                    bricksRemain -= 1;
                    playBrickSound();
                    break;
                }
            }
        }

        const paddleOneDirection = new Vector3();
        if (arrowActive.left) {
            paddleOneDirection.x -= 1;
        }
        if (arrowActive.right) {
            paddleOneDirection.x += 1;
        }
        if (arrowActive.up) {
            paddleOneDirection.z -= 1;
        }
        if (arrowActive.down) {
            paddleOneDirection.z += 1;
        }
        if (options.fp) {
            paddleOneDirection.z *= -1;
        }
        paddleOneDirection.setLength(paddleSpeed);
        const newPaddleOnePosition = paddleOne.position.clone();
        newPaddleOnePosition.add(paddleOneDirection);
        const safePaddleOffset = wallHorizontalOffset - (wallBreadth / 2) - (paddleLength / 2);
        if (Math.abs(newPaddleOnePosition.x) > safePaddleOffset) {
            paddleOneDirection.setX(0)
        }
        if (Math.abs(newPaddleOnePosition.z) > safePaddleOffset) {
            paddleOneDirection.setZ(0);
        }
        paddleOneDirection.setLength(paddleSpeed);
        paddleOne.position.add(paddleOneDirection);

        const paddleTwoDirection = new Vector3();
        if (wasdActive.a) {
            paddleTwoDirection.x -= 1;
        }
        if (wasdActive.d) {
            paddleTwoDirection.x += 1;
        }
        if (wasdActive.w) {
            paddleTwoDirection.z -= 1;
        }
        if (wasdActive.s) {
            paddleTwoDirection.z += 1;
        }
        paddleTwoDirection.setLength(paddleSpeed);
        const newPaddleTwoPosition = paddleTwo.position.clone();
        newPaddleTwoPosition.add(paddleTwoDirection);
        if (Math.abs(newPaddleTwoPosition.x) > safePaddleOffset) {
            paddleTwoDirection.setX(0)
        }
        if (Math.abs(newPaddleTwoPosition.z) > safePaddleOffset) {
            paddleTwoDirection.setZ(0);
        }
        paddleTwoDirection.setLength(paddleSpeed);
        paddleTwo.position.add(paddleTwoDirection);

        if (options.demo) {
            if (Math.abs(ball.position.x) < safePaddleOffset) {
                paddleOne.position.setX(ball.position.x);
            }
            if (Math.abs(ball.position.z) < safePaddleOffset) {
                paddleOne.position.setZ(ball.position.z);
            }
        }

        if (options.fp) {
            camera.position.copy(paddleOne.position);
            camera.lookAt(paddleOne.position.x, 0, paddleOne.position.z);
        }

        renderer.render(scene, camera);
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    return new Promise((resolve) => {
        animate(resolve);
    });
};

const toggleView = (options: ProgramOptions) => {
    if (options.fp) {
        window.location.href = '/';
    } else {
        window.location.href = '/?fp';
    }
};

const main = async () => {
    const options = getProgramOptions();

    const fpvButton = document.querySelector('button.view') as HTMLButtonElement;
    fpvButton.onclick = toggleView.bind(this, options);

    if (options.fp) {
        const p2Manual = document.querySelector('div.two');
        p2Manual?.remove();
    }

    while (options.level <= 2) {
        await playLevel(options);
        options.level += 1;
    }

    const banner = document.querySelector('span.scoreboard>span') as HTMLSpanElement;
    banner.innerText = 'YOU WON!';
}

void main();
