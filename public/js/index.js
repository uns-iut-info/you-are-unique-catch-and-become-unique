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
let light;
let reLoadLevel;



function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);

    scene = createScene();
    scene.jetons = [];
    let ground = createGround(scene, 0, -10, 0, 1);
    main = new Main(scene, ground, {x: 0, y: 10, z: 0});
    obstacle = new Obstacles(main);
    main.modifySettings(window);
    main.light = light;

    main.generatorLevel = new GeneratorLevel(obstacle, main);
    scene.activeCamera = main.createArcCamera(scene, new BABYLON.Vector3(0, 0, 0));
    main.level = 0;

    engine.runRenderLoop(() => {
        if (main.boule) {
            reLoadLevel = main.events(ground);
            main.boule.move();
        }
        scene.render();

        if (reLoadLevel) {
            main.generatorLevel.createNewLevel = !main.isDead;
            main.generatorLevel.deleteLevel();

        }
        main.generatorLevel.generateLevel();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -80, 0));
    createLights(scene);
    var envTexture = new BABYLON.CubeTexture("images/galaxie2/galaxie", scene);
    let skybox = scene.createDefaultSkybox(envTexture, false, 2000);
    skybox.position.y -= 350;
    skybox.position.x -= 250;


    scene.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    return scene;
}

function createGround(scene, x, y, z, id) {
    ground = BABYLON.Mesh.CreateGround("ground_" + id, 500, 500, 1, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: -1
    }, scene);
    ground.material = new BABYLON.StandardMaterial("groundMaterial" + id, scene);
    ground.checkCollisions = true;
    ground.position = new BABYLON.Vector3(x, y, z);
    ground.wireframe = true;
    ground.material.alpha = 0;
    return ground;
}

function createLights(scene) {
    light = new BABYLON.PointLight("light", new BABYLON.Vector3(-20, 70, 0), scene);
    light.intensity = 1;

}


