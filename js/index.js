let canvas;
let engine;
let scene;
let boule;
let ground;
let ground2;
let followCamera;
let nbrJeton=20;
let rotationOffset=180;
let inputStates = {};
let key;
let faille;
let zMovement = 5;

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    scene.enablePhysics();
    modifySettings();

    boule = createBoule();
    followCamera = createFollowCamera( boule);

    scene.activeCamera = followCamera;

    scene.jetons=[];


    //generation des obstacles
    createPipe(50,0);
    tremplin(-150,200)
    stepByStep(5,100);
    poutre(-200,100)
    coffreFort(-400,0)

    createBoundingBox(boule);
    generateJetons();
    collision();

    boule.key=false;
    engine.runRenderLoop(() => {
        
        //followCamera.rotationOffset+=0.5;
        if(nbrJeton>19){
            boule.move();
            scene.render();
        }
        else{
            //boule.moveWithCollisions(new BABYLON.Vector3(0, 1*boule.speed, 0));
            boule.move();
            scene.render();
        }
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics();
    ground = createGround(0,scene);
    ground2 = createGround(200,scene);
    let freeCamera = createFreeCamera();


    createLights();
   return scene;
}

function createGround(y,scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:100, onReady: onGroundCreated};
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene); 
    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/grass.png");
        ground.material = groundMaterial;
        ground.position.y=y;
        ground.checkCollisions = true;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground,
            BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0,restitution: 1 }, scene);
    }
    return ground;
}

function createLights() {
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);

}

function createFreeCamera() {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.attachControl(canvas,false);
    camera.checkCollisions = true; 
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

function createFollowCamera(target) {
    let camera = new BABYLON.FollowCamera("bouleFollowCamera", target.position, scene, target);
    camera.radius = 50; // how far from the object to follow
	camera.heightOffset = 14; // how high above the object to place the camera
	camera.rotationOffset = rotationOffset; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit
    return camera;
}


function createBoule() {
    boule = new BABYLON.MeshBuilder.CreateSphere("heroboule", {diameter : 7}, scene);
    let bouleMaterial = new BABYLON.StandardMaterial("bouleMaterial", scene);
    bouleMaterial.diffuseColor = new BABYLON.Color3.White;
    bouleMaterial.emissiveColor = new BABYLON.Color3.Black;
    bouleMaterial.diffuseTexture = new BABYLON.Texture("images/hmap2.jpg", scene)

    boule.material = bouleMaterial;

    boule.applyGravity=true;
    boule.position.y = 3.5;
    boule.position.z=-10;
    boule.position.x=-30
    boule.speed = 5;
    boule.frontVector = new BABYLON.Vector3(0, 0, 1);
    boule.applyGravity=true;

    boule.physicsImpostor = new BABYLON.PhysicsImpostor(boule, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 1 }, scene);






    boule.actionManager = new BABYLON.ActionManager(scene);
    boule.move = () => { //TODO bien detecter les colisions car la ce n'est pas assez precis
        let yMovement = 0;

        if (boule.position.y > 2) {
            zMovement = 0;
            yMovement = -2;
        }
        if(inputStates.up) {
            boule.moveWithCollisions(boule.frontVector.multiplyByFloats(boule.speed, boule.speed, boule.speed));
        }
        if(inputStates.down) {
            boule.moveWithCollisions(boule.frontVector.multiplyByFloats(-boule.speed, -boule.speed, -boule.speed));
        }
        if(inputStates.left) {
            boule.rotation.y -= 0.02;
            boule.rotate(BABYLON.Axis.Y, -0.02);
            boule.frontVector = new BABYLON.Vector3(Math.sin(boule.rotation.y), 0, Math.cos(boule.rotation.y));

        }
        if(inputStates.right) {
            boule.rotation.y += 0.02;
            boule.rotate(BABYLON.Axis.Y, 0.02);
            boule.frontVector = new BABYLON.Vector3(Math.sin(boule.rotation.y), 0, Math.cos(boule.rotation.y));

        }
        if(inputStates.space){
            boule.pulse();
        }

    }
    return boule;
}

window.addEventListener("resize", () => {
    engine.resize()
});

function modifySettings() {
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;

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
    jeton.position.y = y;
    jeton.position.x = x;
    jeton.position.z = z;
    jetonMaterial.emissiveColor = new BABYLON.Color3.Blue;
    jeton.material = jetonMaterial;
    jeton.checkCollisions=true;
    createBoundingBox(jeton);
    return jeton;
}

function createBoundingBox(elt){ // fonction pour generer les bounding box
    let eltMin = elt.getBoundingInfo().boundingBox.minimum;
    let eltMax = elt.getBoundingInfo().boundingBox.maximum;

    let groundMin = ground.getBoundingInfo().boundingBox.minimum;
    let groundMax = ground.getBoundingInfo().boundingBox.maximum;

    let newMin = BABYLON.Vector3.Minimize(eltMin, groundMin);
    let newMax = BABYLON.Vector3.Maximize(eltMax, groundMax);

    elt.setBoundingInfo(new BABYLON.BoundingInfo(newMin, newMax));
    elt.showBoundingBox = false;
}

function generateJetons(){
    for (let i = 0; i < nbrJeton; i++) {
        let xrand = Math.floor(Math.random()*500 - 250);
        let zrand = Math.floor(Math.random()*500 - 250);
        scene.jetons[i] = createJeton(i,xrand,1,zrand);
    }
    key = scene.jetons[nbrJeton-1];
    key.material.emissiveColor = new BABYLON.Color3.Red;
}

function collision(){// detecte quand la boule rentre en colision avec un jeton
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
function stepByStep(x,z){
    createStep(20,20,x,7,z);
    createStep(10,10,x+23,14,z);
    createStep(5,5,x+38,21,z);
    createStep(10,10,x+53,14,z);
    createStep(20,20,x+73,7,z);
    scene.jetons[nbrJeton]=createJeton(nbrJeton,x+38,24,z);
    nbrJeton-=1;

}

function createStep(w,s,x,y,z){
    let step = new BABYLON.MeshBuilder.CreateBox("step_",{size:s,width : w,height:2},scene);
    step.material = new BABYLON.StandardMaterial("stepMaterial", scene);
    step.checkCollisions = true;
    step.position.x=x;
    step.position.y=y;
    step.position.z = z;
    createBoundingBox(step);
    return step;

}

function createPipe(x,z){
    const pipe = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height:40,diameterTop:1,diameterBottom:60});
    pipe.position.x=x;
    pipe.position.z=z;
    pipe.position.y=1;
    pipe.checkCollisions = true;
    createBoundingBox(pipe);
    scene.jetons[nbrJeton]=createJeton(nbrJeton,x,24,z);
    nbrJeton-=1;
}

function tremplin(x,z){
    const curve = BABYLON.MeshBuilder.CreateSphere("sphere", {arc: 0.25,diameter:60, sideOrientation: 2});
    curve.position.x=x;
    curve.position.z=z;
    curve.position.y=27;
    createBoundingBox(curve);
    curve.checkCollisions=true;

    const torus = BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.85, diameter: 10});
    torus.position.z=z+85;
    torus.position.x=x-20;
    torus.position.y = 36;
    torus.rotation = new BABYLON.Vector3(0, 0, 3.1);
    createBoundingBox(torus);
    torus.checkCollisions=true;

    scene.jetons[nbrJeton]=createJeton(nbrJeton,torus.position.x,torus.position.y,torus.position.z=z+25);
    nbrJeton-=1;

}

function poutre(x,z){
    createStep(20,20,x,7,z);
    createStep(10,10,x+23,14,z);

    const poutre = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height:50,diameterTop:1,diameterBottom:1});
    poutre.position.x = x+53;
    poutre.position.y=14;
    poutre.position.z=z;
    poutre.rotation.z=1.57;
    createBoundingBox(poutre);
    poutre.checkCollisions=true;

    scene.jetons[nbrJeton]=createJeton(nbrJeton,poutre.position.x,poutre.position.y+5,poutre.position.z);
    nbrJeton-=1;

    createStep(10,10,x+83,14,z);
    createStep(20,20,x+103,7,z);
}

function coffreFort(x,z){
    //TODO faire un beau coffre
    let cote1 = createStep(20,20,x+10,10,z+10);
    let cote2 = createStep(20,20,x-10,10,z+10);
    let cote3 = createStep(22,20,x,10,z);
    faille = createStep(22,20,x,10,z+20);

    cote1.rotation.x=1.58;
    cote1.rotation.z=1.58;

    cote2.rotation.x=1.58;
    cote2.rotation.z=1.58;

    cote3.rotation.x=1.58;
    faille.rotation.x=1.58;

    scene.jetons[nbrJeton]= createJeton(nbrJeton,x,7,z+10);
    nbrJeton-=1;

    createStep(22,22,x,20,z+10);

    var plane = BABYLON.Mesh.CreatePlane("plane",10,scene);
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
    plane.parent = faille;
    plane.position.y = -10;
    plane.rotation.x=1.58;
    plane.rotation.y=3.150;
    plane.position.z=-20;
    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Find \nthe key");
    button1.width = 20;
    button1.height = 20;
    button1.color = "white";
    button1.fontSize = 200;
    button1.background = "green";
    button1.onPointerUpObservable.add(function() {
        alert("You have to find the key for open the safe");
    });
    advancedTexture.addControl(button1);

}






