export default class Main {



    boule;

    key;
    inputStates = {};


    constructor(scene,ground,faille, respawnPoint) {
        this.scene = scene;
        this.ground=ground;
        this.faille=faille;
        this.nbrJeton=11;
        this.respawn = respawnPoint;
        this.createStep(10,10,respawnPoint.x,respawnPoint.y-5,respawnPoint.z)

    }
    createSphere(scene) {
        let boule = new BABYLON.MeshBuilder.CreateSphere("heroboule", {diameter: 7}, scene);
        boule.applyGravity = true;
        boule.position =new BABYLON.Vector3(this.respawn.x,this.respawn.y,this.respawn.z);
        boule.checkCollisions = true;
        let speed = 2;
        boule.applyGravity = true;
        boule.material = new BABYLON.StandardMaterial("s-mat", scene);
        boule.material.diffuseTexture = new BABYLON.Texture("images/lightning.jpg", scene);
        boule.material.emissiveColor = new BABYLON.Color3.Red;
        boule.material.diffuseTexture.uScale *= 4;

        boule.physicsImpostor = new BABYLON.PhysicsImpostor(boule, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: 50,
            restitution: 0
        },  scene);
        let canJump = true;
        boule.move = () => {
            let velocityLin = boule.physicsImpostor.getLinearVelocity();
            if (this.inputStates.up && velocityLin.x < 30) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, -speed, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x + speed, velocityLin.y, velocityLin.z));
            }
            if (this.inputStates.down && velocityLin.x > -30) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, speed, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x - speed, velocityLin.y, velocityLin.z));
            }
            if (this.inputStates.left && velocityLin.z < 30) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(speed, 0, 0, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x, velocityLin.y, velocityLin.z + speed));
            }
            if (this.inputStates.right && velocityLin.z > -30) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(-speed, 0, 0, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x, velocityLin.y, velocityLin.z - speed));
            }

            if (this.inputStates.space && canJump) {
                canJump= false;
                boule.physicsImpostor.applyImpulse(new BABYLON.Vector3(0,500,0),boule.getAbsolutePosition());
                setTimeout(()=>{canJump= true;},1500)
            }
        };

        this.boule=boule;
        return this.boule;
    }

    modifySettings(window) {
        // key listeners for the tank
        this.inputStates.left = false;
        this.inputStates.right = false;
        this.inputStates.up = false;
        this.inputStates.down = false;
        this.inputStates.space = false;

        //add the listener to the main, window object, and update the states
        window.addEventListener('keydown', (event) => {
            if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
                this.inputStates.left = true;
            } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
                this.inputStates.up = true;
            } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
                this.inputStates.right = true;
            } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
                this.inputStates.down = true;
            }  else if (event.key === " ") {
                this.inputStates.space = true;
            }
        }, false);

        //if the key will be released, change the states object
        window.addEventListener('keyup', (event) => {
            if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
                this.inputStates.left = false;
            } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
                this.inputStates.up = false;
            } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
                this.inputStates.right = false;
            } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
                this.inputStates.down = false;
            }  else if (event.key === " ") {
                this.inputStates.space = false;
            }
        }, false);
    }

    createJeton(i, x, y, z) { // cree un jeton aux coordonnées (x,y,z)
        let jeton = new BABYLON.MeshBuilder.CreateSphere("jeton_" + i, {diameter: 2}, this.scene);
        let jetonMaterial = new BABYLON.StandardMaterial("jetonMaterial", this.scene);
        jeton.position = new BABYLON.Vector3(x, y, z)
        jetonMaterial.emissiveColor = new BABYLON.Color3.Blue;
        jeton.material = jetonMaterial;
        jeton.checkCollisions = true;
        return jeton;
    }

    generateJetons() { //genere des jetons a des endroits aleatoire

        this.scene.jetons[ this.nbrJeton] = this.createKey();
        this.key =  this.scene.jetons[ this.nbrJeton];
        for (let i = 0; i <  this.nbrJeton; i++) {
            let xrand = Math.floor(Math.random() * 1000 - 480);
            let zrand = Math.floor(Math.random() * 200 - 100);
             this.scene.jetons[i] = this.createJeton(i, xrand, 1, zrand);
        }
        return this.key;


    }

    collision() {
         this.boule.actionManager = new BABYLON.ActionManager( this.scene);
         this.scene.jetons.forEach(jeton => {
             this.boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: jeton
                },
                () => {
                    if (jeton === this.key) {
                         this.boule.key = true;
                        this.key.particles.stop();
                    }
                    jeton.dispose();
                     this.nbrJeton -= 1;
                }
            ));
        });
         this.boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: this.faille
            },
            () => {
                if ( this.boule.key) this.faille.dispose();


            }));
         this.boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                parameter: this.ground
            },
            () => {
                var music = new BABYLON.Sound("Violons", "sounds/rebond.wav",  this.scene, null, {
                    loop: false,
                    autoplay: true
                });

            }));
    }

    createStep(w, s, x, y, z) {
        let step = new BABYLON.MeshBuilder.CreateBox("step_", {size: s, width: w, height: 2}, this.scene);
        step.physicsImpostor = new BABYLON.PhysicsImpostor(step, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0
        }, this.scene);
        step.material = new BABYLON.StandardMaterial("stepMaterial", this.scene);
        step.material.diffuseTexture = new BABYLON.Texture("images/diffuse.jpg");
        step.checkCollisions = true;
        step.position = new BABYLON.Vector3(x, y, z);
        return step;
    }


    coffreFort(x, z) {
        //TODO faire un beau coffre
        let cote1 = this.createStep(20, 20, x + 10, 10, z + 10);
        this.faille = this.createStep(20, 20, x - 10, 10, z + 10);
        let cote2 = this.createStep(22, 20, x, 10, z);
        let cote3 = this.createStep(22, 20, x, 10, z + 20);
        let toit = this.createStep(22, 22, x, 20, z + 10);

        cote1.rotate(BABYLON.Axis.Z, 1.57);
        this.faille.rotate(BABYLON.Axis.Z, 1.57);
        //faille.material.diffuseTexture = new BABYLON.Texture("images/coffre.jpg");

        cote3.rotate(BABYLON.Axis.Z, 1.57);
        cote3.rotate(BABYLON.Axis.X, 1.57);

        cote2.rotate(BABYLON.Axis.Z, 1.57);
        cote2.rotate(BABYLON.Axis.X, 1.57);

        cote1.material.emissiveColor = new BABYLON.Color3.Gray();
        cote2.material.emissiveColor = new BABYLON.Color3.Gray();
        cote3.material.emissiveColor = new BABYLON.Color3.Gray();
        toit.material.emissiveColor = new BABYLON.Color3.Gray();

        this.scene.jetons[this.nbrJeton] = this.createJeton(this.nbrJeton, x, 7, z + 10);
        this.nbrJeton -= 1;

        // panneau
        this.createPanneau(toit, 0, 10, 0, "Find \nthe key", "You have to find the key for open the bunker")
        return this.faille;

    }

    createKey() {
        let cercle = new BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.55, diameter: 3},this.scene);
        let barre = new BABYLON.MeshBuilder.CreateCylinder("cylinder", {
            height: 5,
            diameterTop: 0.5,
            diameterBottom: 0.5
        });
        let trait1 = new BABYLON.MeshBuilder.CreateCylinder("trait1", {
            height: 1,
            diameterTop: 0.3,
            diameterBottom: 0.3
        });
        let trait2 = new BABYLON.MeshBuilder.CreateCylinder("trait2", {
            height: 1,
            diameterTop: 0.3,
            diameterBottom: 0.3
        });

        cercle.material = new BABYLON.StandardMaterial("cercle",  this.scene);
        barre.material = new BABYLON.StandardMaterial("barre",  this.scene);
        trait1.material = new BABYLON.StandardMaterial("trait1",  this.scene);
        trait2.material = new BABYLON.StandardMaterial("trait2",  this.scene);

        cercle.material.emissiveColor = new BABYLON.Color3.Yellow();
        barre.material.emissiveColor = new BABYLON.Color3.Yellow();
        trait1.material.emissiveColor = new BABYLON.Color3.Yellow();
        trait2.material.emissiveColor = new BABYLON.Color3.Yellow();

        cercle.rotation = new BABYLON.Vector3(1.58, 1.58, 0);
        barre.rotation = new BABYLON.Vector3(0, 1.58, 1.58);

        this.createStep(12, 12, 300, 14, 100);

        let socle = this.createStep(12, 12, 250, 30, 130);
        cercle.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 5, socle.position.z);
        trait2.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 4.5, socle.position.z - 5.7);
        trait1.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 4.5, socle.position.z - 5);
        barre.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 5, socle.position.z - 4);

        cercle.particles = new BABYLON.ParticleHelper.CreateDefault(new BABYLON.Vector3(250, 38, 130))
        cercle.particles.minSize = 0.25;
        cercle.particles.maxSize = 0.55;

        cercle.particles.minLifeTime = 20;
        cercle.particles.maxLifeTime = 30;

        cercle.particles.start();


        this.createStep(12, 12, 200, 14, 100);

        cercle.addChild(barre);
        barre.addChild(trait1);
        barre.addChild(trait2);

        return cercle;

    }

    events(){
        if(this.boule.intersectsMesh(this.ground,true)){
            this.boule.position = new BABYLON.Vector3(this.respawn.x,this.respawn.y,this.respawn.z);
            this.boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, 0, 0));
            this.boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0,0));
        }
    }


    createPanneau(parent, x, y, z, message, messageOnClick) {
        var plane = BABYLON.Mesh.CreatePlane("plane", 10, this.scene);
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
        plane.parent = parent;
        plane.position = new BABYLON.Vector3(x, y, z);
        plane.rotation.y = 1.58;

        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", message);
        button1.width = 20;
        button1.height = 20;
        button1.color = "white";
        button1.fontSize = 200;
        button1.background = "green";
        button1.onPointerUpObservable.add(function () {
            alert(messageOnClick);
        });
        advancedTexture.addControl(button1);

        return button1;
    }


    createInvisibleHouse(x, z) {
        let cote1 = this.createStep(20, 20, x + 10, 10, z);
        let coteB = this.createStep(10, 20, x - 10, 5, z);
        let cote2 = this.createStep(22, 20, x, 10, z - 10);
        let cote3 = this.createStep(22, 20, x, 10, z + 10);
        let toit = this.createStep(22, 22, x, 20, z);

        cote1.rotate(BABYLON.Axis.Z, 1.57);
        coteB.rotate(BABYLON.Axis.Z, 1.57);

        cote3.rotate(BABYLON.Axis.Z, 1.57);
        cote3.rotate(BABYLON.Axis.X, 1.57);

        cote2.rotate(BABYLON.Axis.Z, 1.57);
        cote2.rotate(BABYLON.Axis.X, 1.57);

        coteB.material.alpha = 0;
        cote1.material.alpha = 0;
        cote2.material.alpha = 0;
        cote3.material.alpha = 0;
        toit.material.alpha = 0;

        this.scene.jetons[this.nbrJeton] = this.createJeton(this.nbrJeton, x, 2, z);
        this.nbrJeton -= 1;

        this.createPanneau(toit, 0, 10, 0, "Invisible\n House", "there is a breach in the house where you can pass and get the token")
    }

    setNbrJetons(nbr){
        this.nbrJeton=nbr;
    }









}