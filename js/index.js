import Obstacles from "./Obstacles.js";
import Main from "./Main.js";
let canvas;
let engine;
let scene;
let faille;
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
    obstacle.stepByStep(40,0);
    obstacle.poutre(150,0);
    main.createStep(100,5,320,10,-10);
    main.createStep(100,100,470,10,0);
    main.faille=obstacle.coffreFort(505,12,20);
    obstacle.createKey(290,8,10);


    main.collision();
    //main.nbrJeton=11;
    engine.runRenderLoop(() => {
        main.events();
        main.boule.move();
        scene.activeCamera.move();
        scene.render();
        main.key.rotation.z+=0.02;
        if (main.nbrJetonToGenerate === 1 && level2){
            level2=false;
            createLevel2();
            //main.collision();
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
    var music = new BABYLON.Sound("music_fond", "sounds/music_fond.wav", scene, null, { loop: true, autoplay: true });

    return scene;
}

function createGround(scene,x,y,z,id) {
    ground = BABYLON.Mesh.CreateGround("ground_"+id, 3000, 3000, 1, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: -1 }, scene);
    ground.material = new BABYLON.GridMaterial("groundMaterial"+id, scene);
    ground.checkCollisions = true;
    ground.position = new BABYLON.Vector3(x,y,z);
    ground.wireframe = true;
    return ground;
}
function createLights(scene) {
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);
    let light1 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(1, 5, 0), scene);

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
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 80, target, scene);
    camera.alpha = -3.14;
    camera.beta = 3.14/3;
    camera.move = ()=>{
    }
    return camera;
}

//Level2

function createLevel2(){
    floorIsLava(440,0,0);
    main.createStep(100,100,670,45,0,true);
    obstacle.createInvisibleHouse(670,45,0);
}

function floorIsLava(x,y,z){
    var acc=6;
    for (let i = 0; i < 7; i++) {
        acc+=6;
        var pos = (i%2)===0 ? 7 : -7;
        let step = main.createStep(15,15,x+(acc*3),y+acc,z+pos,false);
        step.modifyMass = ()=>{
            step.physicsImpostor.mass=0.1;

        }
        step.disparait = () =>{
            step.dispose();
        }
        main.boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {trigger : BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter : step},
            () => {
                setTimeout(step.modifyMass, 3000);
                setTimeout(step.disparait, 5000);
            }));
    }

}
