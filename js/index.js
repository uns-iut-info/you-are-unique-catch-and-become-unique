import Obstacles from "./Obstacles.js";
import Main from "./Main.js";
import GeneratorLevel from "./GeneratorLevel.js";

let canvas;
let engine;
let scene;
window.onload = startGame;
let ground;
let main;
let obstacle;
let generatorLevel;
let light1;
let light2;


async function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = await createScene();

    scene.jetons = [];
    let ground = createGround(scene, 0, -10, 0, 1);

    main = new Main(scene, ground, {x: 0, y: 10, z: 0});
    obstacle = new Obstacles(main);

    main.modifySettings(window);
    main.createSphere(light1, light2);

    generatorLevel = new GeneratorLevel(obstacle,main)

    scene.activeCamera = createArcCamera(scene, main.boule);


    // Creation des obstacles
    main.level=0;
    engine.runRenderLoop(() => {
        main.events();
        main.boule.move();
        scene.activeCamera.move();
        scene.render();
        generatorLevel.generateLevel();
    });
}

window.addEventListener("resize", () => {
    engine.resize()
});

async function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -80, 0));
    createLights(scene);
    var music = new BABYLON.Sound("music_fond", "sounds/music_fond.wav", scene, null, {loop: true, autoplay: true});

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size: 2000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    return scene;
}

function createGround(scene, x, y, z, id) {
    ground = BABYLON.Mesh.CreateGround("ground_" + id, 500, 500, 1, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: -1
    }, scene);
    ground.material = new BABYLON.StandardMaterial("groundMaterial" + id, scene);
    //ground.material.diffuseTexture = new BABYLON.Texture("images/diffuse.jpg", scene);
    ground.checkCollisions = true;
    ground.position = new BABYLON.Vector3(x, y, z);
    ground.wireframe = true;
    ground.material.alpha = 0;
    return ground;
}

function createLights(scene) {
    //let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);
    light1 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(1, -2, 1), scene);
    light2 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -2, 1), scene);

}


function createArcCamera(scene, target) {
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 80, target, scene);
    camera.alpha = -3.14;
    camera.beta = 3.14 / 3;
    camera.move = () => {
    }
    return camera;
}
