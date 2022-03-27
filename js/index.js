import Obstacles from "./Obstacles.js";
import Main from "./Main.js";
let canvas;
let engine;
let scene;
let faille;
let key;
window.onload = startGame;
let level2=true;
let ground;
let main;
let obstacle;


async function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = await createScene();

    scene.jetons=[];
    let ground = createGround(scene,0,0,0,1);

    main = new Main(scene,ground,faille,{x:0,y:10,z:0});
    obstacle = new Obstacles(main);

    main.modifySettings(window);
    main.createSphere(scene);

    scene.activeCamera = createArcCamera(scene, main.boule);




    // Creation des obstacles
    //main.createInvisibleHouse(-50,0);
    //main.nbrJeton=obstacle.stepByStep(100,0);

    //main.nbrJeton=obstacle.poutre(280,0);

    main.createStep(20,20,40 ,10,0 );
    main.createStep(5,5,70,12,0);
    main.createStep(20,5,120,30,0);


    faille=main.coffreFort(450,50);
    key = main.generateJetons();

    main.collision();
    main.nbrJeton=11;
    engine.runRenderLoop(() => {
        main.events();
        main.boule.move();
        scene.activeCamera.move();
        scene.render();
        main.key.rotation.z+=0.02;
        if (main.nbrJeton === 10 && level2){
            level2=false;
            createLevel2();
        }
    });
}

window.addEventListener("resize", () => {
    engine.resize()
});

async function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics();

    createLights(scene);
    /*BABYLON.SceneLoader.ImportMesh("", "3D_Dude/", "Bubble_Bass.gltf", scene,  (newMeshes, particleSystems, skeletons) => {
        let heroDude = newMeshes[0];
        heroDude.position = new BABYLON.Vector3(0, 0, 5);  // The original dude
        // make it smaller
        heroDude.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);

    });*/
    //await BABYLON.SceneLoader.AppendAsync("3D_Dude/", "Bubble_Bass.gltf", scene);
    var music = new BABYLON.Sound("music_fond", "sounds/music_fond.wav", scene, null, { loop: true, autoplay: true });

    return scene;
}

function createGround(scene,x,y,z,id) {
    ground = BABYLON.Mesh.CreateGround("ground_"+id, 1000, 200, 1, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: -1 }, scene);
    ground.material = new BABYLON.GridMaterial("groundMaterial"+id, scene);
    ground.checkCollisions = true;
    ground.position = new BABYLON.Vector3(x,y,z);
    ground.wireframe = true;
    return ground;
}
function createLights(scene) {
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);
    let light1 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(1, 1, 0), scene);

}

function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    camera.checkCollisions = true;
    // avoid flying with the camera
    camera.applyGravity = true;

    camera.keysUp.push('z'.charCodeAt(0));
    camera.keysDown.push('s'.charCodeAt(0));
    camera.keysLeft.push('q'.charCodeAt(0));
    camera.keysRight.push('d'.charCodeAt(0));
    camera.keysUp.push('Z'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));
    camera.keysLeft.push('Q'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));

    return camera;
}


function createArcCamera(scene,target){
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 60, target, scene);
    camera.alpha = -3.14;
    camera.beta = 3.14/3;
    camera.move = ()=>{
    }
    return camera;
}

//Level2

function createLevel2(){
    floorIsLava();
}

function floorIsLava(){
    var acc=0;
    for (let i = 0; i < 7; i++) {
        acc+=20;
        var pos = (i%2)===0 ? 40 : -40;
        console.log(pos)
        let step = main.createStep(15,15,480+acc,acc,pos);
        main.boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {trigger : BABYLON.ActionManager.OnIntersectionExitTrigger,
                parameter : step},
            () => {
                step.dispose();

            }));
    }

}
