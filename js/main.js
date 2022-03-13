let canvas;     //http://127.0.0.1:5501/index.html
let engine;
let scene;
let boule;
let ground;
let nbrJeton=20;
// vars for handling inputs
let inputStates = {};

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    //let bullet = createBullet(scene);

    // modify some default settings (i.e pointer events to prevent cursor to go 
    // out of the game window)
    modifySettings();
    generateJetons(scene);
    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); // remind you something ?

        boule.move();
        collision();
        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    ground = createGround(scene);
    let freeCamera = createFreeCamera(scene);

    boule = createBoule(scene);
    

    // second parameter is the target to follow
    let followCamera = createFollowCamera(scene, boule);
    scene.activeCamera = followCamera;

    createLights(scene);
 
   return scene;
}

function createGround(scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:100, onReady: onGroundCreated};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene); 

    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/grass.jpg");
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
    }
    return ground;
}

function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);

}

function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    camera.checkCollisions = true; 
    // avoid flying with the camera
    camera.applyGravity = true;

    // Add extra keys for camera movements
    // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
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

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("bouleFollowCamera", target.position, scene, target);
    camera.radius = 50; // how far from the object to follow
	camera.heightOffset = 14; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit
    return camera;
}

let zMovement = 5;
function createBoule(scene) {
    boule = new BABYLON.MeshBuilder.CreateSphere("heroboule", {diameter : 7}, scene);
    let bouleMaterial = new BABYLON.StandardMaterial("bouleMaterial", scene);
    bouleMaterial.diffuseColor = new BABYLON.Color3.White;
    bouleMaterial.emissiveColor = new BABYLON.Color3.Black;
    boule.material = bouleMaterial;

    // By default the box/boule is in 0, 0, 0, let's change that...
    boule.position.y = 3.5;
    boule.speed = 1;
    boule.frontVector = new BABYLON.Vector3(0, 0, 1);
    boule.move = () => {
                //boule.position.z += -1; // speed should be in unit/s, and depends on
                                 // deltaTime !

        // if we want to move while taking into account collision detections
        // collision uses by default "ellipsoids"

        let yMovement = 0;
       
        if (boule.position.y > 2) {
            zMovement = 0;
            yMovement = -2;
        } 
        //boule.moveWithCollisions(new BABYLON.Vector3(0, yMovement, zMovement));

        
        if(inputStates.up) {
            //boule.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*boule.speed));
            boule.moveWithCollisions(boule.frontVector.multiplyByFloats(boule.speed, boule.speed, boule.speed));
        }    
        if(inputStates.down) {
            //boule.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*boule.speed));
            boule.moveWithCollisions(boule.frontVector.multiplyByFloats(-boule.speed, -boule.speed, -boule.speed));

        }  
        if(inputStates.left) {
            //boule.moveWithCollisions(new BABYLON.Vector3(-1*boule.speed, 0, 0));
            boule.rotation.y -= 0.02;
            boule.frontVector = new BABYLON.Vector3(Math.sin(boule.rotation.y), 0, Math.cos(boule.rotation.y));
        }    
        if(inputStates.right) {
            //boule.moveWithCollisions(new BABYLON.Vector3(1*boule.speed, 0, 0));
            boule.rotation.y += 0.02;
            boule.frontVector = new BABYLON.Vector3(Math.sin(boule.rotation.y), 0, Math.cos(boule.rotation.y));
        }
        if(inputStates.space){
            
        }
        
    }

    return boule;
}

window.addEventListener("resize", () => {
    engine.resize()
});

function modifySettings() {
    // as soon as we click on the game window, the mouse pointer is "locked"
    // you will have to press ESC to unlock it

    // key listeners for the boule
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

function createJeton(i,scene){
    let xrand = Math.floor(Math.random()*500 - 250);
    let zrand = Math.floor(Math.random()*500 - 250);
    let jeton = new BABYLON.MeshBuilder.CreateSphere("jeton_"+i, {diameter : 2}, scene);
    let jetonMaterial = new BABYLON.StandardMaterial("jetonMaterial", scene);
    jeton.position.y = 1;
    jeton.position.x = xrand;
    jeton.position.z = zrand;
    jetonMaterial.emissiveColor = new BABYLON.Color3.Blue;
    jeton.material = jetonMaterial;
    jeton.checkCollisions=false;

    createBoundingBox(jeton);
    createBoundingBox(boule);
    return jeton;
}

function createBoundingBox(elt){
    let eltMin = elt.getBoundingInfo().boundingBox.minimum;
    let eltMax = elt.getBoundingInfo().boundingBox.maximum;

    let bouleMin = ground.getBoundingInfo().boundingBox.minimum;
    let bouleMax = ground.getBoundingInfo().boundingBox.maximum;

    let newMin = BABYLON.Vector3.Minimize(eltMin, bouleMin);
    let newMax = BABYLON.Vector3.Maximize(eltMax, bouleMax);

    elt.setBoundingInfo(new BABYLON.BoundingInfo(newMin, newMax));
    elt.showBoundingBox = false;
}

function generateJetons(scene){
    scene.jeton = []
    for (let i = 0; i < nbrJeton; i++) {
        scene.jeton[i] = createJeton(i,scene); 
    }
}

function collision(){
    boule.actionManager = new BABYLON.ActionManager(scene);
        // register an action for when the cannonball intesects a dude, so we need to iterate on each dude
        scene.jeton.forEach(jeton => {
            boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {trigger : BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter : jeton}, // dude is the mesh, Dude is the instance if Dude class that has a bbox as a property named bounder.
                                                // see Dude class, line 16 ! dudeMesh.Dude = this;
                () => {
                    //console.log("HIT !")
                    jeton.dispose();
                    //cannonball.dispose(); // don't work properly why ? Need for a closure ?
                }
            ));
        });
}


