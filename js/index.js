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
let light1;


async function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = await createScene();

    scene.jetons = [];
    let ground = createGround(scene, 0, -10, 0, 1);
    main = new Main(scene, ground, {x: 0, y: 10, z: 0});
    obstacle = new Obstacles(main);
    main.modifySettings(window);
    main.createSphere(light1);
    main.generatorLevel = new GeneratorLevel(obstacle,main)
    scene.activeCamera = createArcCamera(scene, main.boule);
    main.camera=scene.activeCamera;
    main.level=8;

    engine.runRenderLoop(() => {
        let reLoadLevel = main.events(ground);
        main.boule.move();
        scene.activeCamera.move();
        scene.render();
        if(reLoadLevel){
            main.generatorLevel.createNewLevel=reLoadLevel;
            main.generatorLevel.deleteLevel();

        }
        main.generatorLevel.generateLevel();
    });
}

window.addEventListener("resize", () => {
    engine.resize()
});

async function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -80, 0));
    createLights(scene);

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size: 2000.0}, scene);
    //skybox.scaling.y=0.25;
    //skybox.position.y-=50;
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;


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
    //ground.material.diffuseTexture = new BABYLON.Texture("images/diffuse.jpg", scene);
    ground.checkCollisions = true;
    ground.position = new BABYLON.Vector3(x, y, z);
    ground.wireframe = true;
    ground.material.alpha = 0;
    return ground;
}

function createLights(scene) {
    light1 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(1, -2, 1), scene);
}


function createArcCamera(scene, target) {
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 80, target, scene);
    camera.alpha = -3.14;
    camera.beta = 3.14 / 3;
    camera.move = () => {
    }
    return camera;
}
