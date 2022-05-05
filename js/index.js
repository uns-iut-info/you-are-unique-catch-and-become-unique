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
    main.boule = main.createSphere();

    main.generatorLevel = new GeneratorLevel(obstacle, main);

    scene.activeCamera = main.createArcCamera(scene, main.boule);

    main.camera = scene.activeCamera;
    main.level=-1;

    engine.runRenderLoop(() => {
        let reLoadLevel = main.events(ground);
        main.boule.move();
        scene.render();
        if (reLoadLevel) {
            main.generatorLevel.createNewLevel = reLoadLevel;
            main.generatorLevel.deleteLevel();

        }
        main.generatorLevel.generateLevel();
    });
}

window.addEventListener("resize", () => {
    engine.resize()
});

function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -80, 0));
    createLights(scene);

    /*var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size: 1000.0}, scene);
    //skybox.scaling.y=0.25;
    //skybox.position.y-=50;
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/galaxie2/galaxie", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;*/
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
    //ground.material.diffuseTexture = new BABYLON.Texture("images/diffuse.jpg", scene);
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


