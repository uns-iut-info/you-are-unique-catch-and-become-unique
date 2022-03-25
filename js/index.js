let canvas;
let engine;
let scene;
let nbrJeton=20;
let boule;
let faille;
let key;
let inputStates = {};
window.onload = startGame;


function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    modifySettings();
    boule = scene.getMeshByName("heroboule");
    scene.jetons=[];

    // Creattion des obstacles
    createPipe(20,0);
    stepByStep(100,0);
    poutre(280,0);
    coffreFort(450,50);
    generateJetons();



    collision();
    engine.runRenderLoop(() => {
        boule.move();
        scene.activeCamera.move();
        scene.render();
        key.rotation.z+=0.02;
    });
}

window.addEventListener("resize", () => {
    engine.resize()
});

function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics();
    let ground = createGround(scene);
    let boule = createSphere(scene, ground);
    scene.activeCamera = createArcCamera(scene, boule);
    createLights(scene);
    return scene;
}

function createGround(scene) {
    const ground = BABYLON.Mesh.CreateGround("ground1", 1000, 200, 1, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: -1 }, scene);
    ground.material = new BABYLON.GridMaterial("groundMaterial", scene);
    ground.checkCollisions = true;
    ground.wireframe = true;
    return ground;
}
function createLights(scene) {
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);

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
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 100, target, scene);
    camera.alpha = -3.14
    camera.beta = 3.14/3
    camera.move = ()=>{
    }
    return camera;
}

function jump(boule){
    boule.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 120, 0), boule.getAbsolutePosition());
}

function createSphere(scene,ground) {
    let boule = new BABYLON.MeshBuilder.CreateSphere("heroboule", {diameter : 7}, scene);
    boule.applyGravity=true;
    boule.position = new BABYLON.Vector3(-480,10,-10)
    boule.checkCollisions = true;
    let speed = 5;
    boule.applyGravity=true;
    boule.material = new BABYLON.StandardMaterial("s-mat", scene);
    boule.physicsImpostor = new BABYLON.PhysicsImpostor(boule, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 20, restitution: 0 }, scene);

    let myCamera = scene.activeCamera;

    boule.move = () => {
        if(boule.intersectsMesh(ground,false) &&  !inputStates.space){
            jump(boule);
        }
        let velocityLin = boule.physicsImpostor.getLinearVelocity();
        if(inputStates.up) {
            boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0,0,-speed,0));
            boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x+speed,velocityLin.y,velocityLin.z));

        }
        if(inputStates.down) {
            boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0,0,speed,0));
            boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x-speed,velocityLin.y,velocityLin.z));
        }
        if(inputStates.left) {
            boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(speed,0,0,0));
            boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x,velocityLin.y,velocityLin.z + speed));
        }
        if(inputStates.right) {
            boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(-speed,0,0,0));
            boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x,velocityLin.y,velocityLin.z-speed));
        }

    };

    return boule;
}

function modifySettings() {
    // key listeners for the tank
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;

    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
            inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
            inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
            inputStates.right = true;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
            inputStates.down = true;
        }  else if (event.key === " ") {
            inputStates.space = true;
        }
    }, false);

    //if the key will be released, change the states object
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
            inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
            inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
            inputStates.right = false;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
            inputStates.down = false;
        }  else if (event.key === " ") {
            inputStates.space = false;
        }
    }, false);
}

function createJeton(i,x,y,z){ // cree un jeton aux coordonnées (x,y,z)
    let jeton = new BABYLON.MeshBuilder.CreateSphere("jeton_"+i, {diameter : 2}, scene);
    let jetonMaterial = new BABYLON.StandardMaterial("jetonMaterial", scene);
    jeton.position = new BABYLON.Vector3(x,y,z)
    jetonMaterial.emissiveColor = new BABYLON.Color3.Blue;
    jeton.material = jetonMaterial;
    jeton.checkCollisions=true;
    return jeton;
}

function generateJetons(){ //genere des jetons a des endroits aleatoire
    for (let i = 0; i < nbrJeton; i++) {
        let xrand = Math.floor(Math.random()*1000 - 480);
        let zrand = Math.floor(Math.random()*200 - 100);
        scene.jetons[i] = createJeton(i,xrand,1,zrand);
    }
    scene.jetons[nbrJeton-1] = createKey();
    key = scene.jetons[nbrJeton-1]
}

function collision(){// detecte quand la boule rentre en colision avec un jeton ou la porte du coffre
    boule.actionManager = new BABYLON.ActionManager(scene);
    scene.jetons.forEach(jeton => {
        boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {trigger : BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter : jeton},
            () => {
                if(jeton===key)boule.key=true
                jeton.dispose();
                nbrJeton-=1;
            }
        ));
    });
    boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        {trigger : BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter : faille},
        () => {
            if(boule.key)faille.dispose();


        }));

}

//############ Creation des obstacles ###################
function createStep(w,s,x,y,z){
    let step = new BABYLON.MeshBuilder.CreateBox("step_",{size:s,width : w,height:2},scene);
    step.physicsImpostor = new BABYLON.PhysicsImpostor(step, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);
    step.material = new BABYLON.StandardMaterial("stepMaterial", scene);
    step.checkCollisions = true;
    step.position = new BABYLON.Vector3(x,y,z);
    return step;

}

function stepByStep(x,z){
    createStep(20,20,x,7,z);
    createStep(10,10,x+23,14,z);
    createStep(5,5,x+38,21,z);
    createStep(10,10,x+53,14,z);
    createStep(20,20,x+73,7,z);
    scene.jetons[nbrJeton]=createJeton(nbrJeton,x+38,24,z);
    nbrJeton-=1;

}

function createPipe(x,z){
    const pipe = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height:40,diameterTop:1,diameterBottom:60},scene);
    //pipe.physicsImpostor = new BABYLON.PhysicsImpostor(pipe, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 0, restitution: 1 }, scene);
    pipe.position = new BABYLON.Vector3(x,1,z);
    pipe.checkCollisions = true;
    scene.jetons[nbrJeton]=createJeton(nbrJeton,x,24,z);
    nbrJeton-=1;
}


function poutre(x,z){
    createStep(20,20,x,7,z);
    createStep(10,10,x+23,14,z);
    createStep(10,10,x+83,14,z);
    createStep(20,20,x+103,7,z);

    const poutre = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height:50,diameterTop:1,diameterBottom:1});
    poutre.physicsImpostor = new BABYLON.PhysicsImpostor(poutre, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 0, restitution: 1 }, scene);

    poutre.position = new BABYLON.Vector3(x+53,14,z);
    poutre.rotate(BABYLON.Axis.Z, 1.57);
    poutre.checkCollisions=true;

    scene.jetons[nbrJeton]=createJeton(nbrJeton,poutre.position.x,poutre.position.y+5,poutre.position.z);
    nbrJeton-=1;

}

function coffreFort(x,z) {
    //TODO faire un beau coffre
    let cote1 = createStep(20, 20, x + 10, 10, z + 10);
    faille = createStep(20, 20, x - 10, 10, z + 10);
    let cote2 = createStep(22, 20, x, 10, z);
    let cote3 = createStep(22, 20, x, 10, z + 20);
    let toit = createStep(22, 22, x, 20, z + 10);

    cote1.rotate(BABYLON.Axis.Z, 1.57);
    faille.rotate(BABYLON.Axis.Z, 1.57);

    cote3.rotate(BABYLON.Axis.Z, 1.57);
    cote3.rotate(BABYLON.Axis.X, 1.57);

    cote2.rotate(BABYLON.Axis.Z, 1.57);
    cote2.rotate(BABYLON.Axis.X, 1.57);

    scene.jetons[nbrJeton] = createJeton(nbrJeton, x, 7, z + 10);
    nbrJeton -= 1;

    // panneau
    var plane = BABYLON.Mesh.CreatePlane("plane", 10, scene);
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
    plane.parent = toit;
    plane.position = new BABYLON.Vector3(0,10,0);
    plane.rotation.y=1.58;

    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Find \nthe key");
    button1.width = 20;
    button1.height = 20;
    button1.color = "white";
    button1.fontSize = 200;
    button1.background = "green";
    button1.onPointerUpObservable.add(function () {
        alert("You have to find the key for open the safe");
    });
    advancedTexture.addControl(button1);
}


function createKey(){
    let cercle = new BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.55, diameter: 3});
    let barre = new BABYLON.MeshBuilder.CreateCylinder("cylinder", {height:5,diameterTop:0.5,diameterBottom:0.5});
    let trait1 = new BABYLON.MeshBuilder.CreateCylinder("trait1", {height:1,diameterTop:0.3,diameterBottom:0.3});
    let trait2 = new BABYLON.MeshBuilder.CreateCylinder("trait2", {height:1,diameterTop:0.3,diameterBottom:0.3});

    cercle.material = new BABYLON.StandardMaterial("cercle", scene);
    barre.material = new BABYLON.StandardMaterial("barre", scene);
    trait1.material = new BABYLON.StandardMaterial("trait1", scene);
    trait2.material = new BABYLON.StandardMaterial("trait2", scene);

    cercle.material.emissiveColor = new BABYLON.Color3.Yellow();
    barre.material.emissiveColor = new BABYLON.Color3.Yellow();
    trait1.material.emissiveColor = new BABYLON.Color3.Yellow();
    trait2.material.emissiveColor = new BABYLON.Color3.Yellow();

    cercle.rotation = new BABYLON.Vector3(1.58,1.58,0);
    barre.rotation = new BABYLON.Vector3(0,1.58,1.58);

    createStep(10,10,300,14,150);

    let socle = createStep(10,10,250,30,180);
    cercle.position = new BABYLON.Vector3(socle.position.x,socle.position.y+5,socle.position.z);
    trait2.position = new BABYLON.Vector3(socle.position.x,socle.position.y+4.5,socle.position.z-5.7);
    trait1.position = new BABYLON.Vector3(socle.position.x,socle.position.y+4.5,socle.position.z-5);
    barre.position = new BABYLON.Vector3(socle.position.x,socle.position.y+5,socle.position.z-4);


    createStep(10,10,200,14,150);

    cercle.addChild(barre);
    barre.addChild(trait1);
    barre.addChild(trait2);

    return cercle;

}
