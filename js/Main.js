export default class Main {
    boule;
    key;
    inputStates = {};
    allStep = [];
    ind = 0;
    allObstacles = [];
    jump = true;
    impulseDown = false;
    level=0;
    move=false;
    faille;

    constructor(scene, ground, respawnPoint) {
        this.scene = scene;
        this.ground = ground;
        this.nbrJeton = 5;
        this.nbrJetonToGenerate = 5;
        this.respawn = respawnPoint;
    }

    createStep(w, s, x, y, z, sound) {
        let step = new BABYLON.MeshBuilder.CreateBox("step_", {
            size: s,
            width: w,
            height: 2,
            restitution: 0,
        }, this.scene);
        step.physicsImpostor = new BABYLON.PhysicsImpostor(step, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0,
            gravity: 18,
            friction : 0.1,
        }, this.scene);
        step.material = new BABYLON.StandardMaterial("stepMaterial", this.scene);
        step.material.diffuseTexture = new BABYLON.Texture("images/diffuse.jpg");
        step.checkCollisions = true;
        step.position = new BABYLON.Vector3(x, y, z);
        if (sound) {
            this.allStep[this.ind] = step;
            this.ind += 1;
        }
        step.receiveShadows = true;
        this.allObstacles[this.ind++] = step;
        return step;
    }

    castRay(myMesh) {
        var ray = new BABYLON.Ray(myMesh.position, new BABYLON.Vector3(0, -1, 0), 4);
        let hit = this.scene.pickWithRay(ray, (mesh) => {
            return (mesh !== myMesh);
        })
        if (hit.pickedMesh) {
            this.jump = true;
            this.impulseDown = true;
        }
    }

    createSphere(light, light2) {
        let boule = new BABYLON.MeshBuilder.CreateSphere("heroboule", {diameter: 7}, this.scene);
        boule.applyGravity = true;
        boule.position = new BABYLON.Vector3(this.respawn.x, this.respawn.y, this.respawn.z);
        boule.checkCollisions = true;
        this.scene.registerBeforeRender(() => {
            this.castRay(boule);
        })

        let speed = 2;
        boule.applyGravity = true;
        boule.material = new BABYLON.StandardMaterial("s-mat", this.scene);
        boule.material.diffuseTexture = new BABYLON.Texture("images/lightning.jpg", this.scene);
        boule.material.emissiveColor = new BABYLON.Color3.Red;
        boule.material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boule.material.diffuseTexture.uScale *= 4;
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.addShadowCaster(boule);
        shadowGenerator.useExponentialShadowMap = true;
        var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light2);
        shadowGenerator2.addShadowCaster(boule);
        shadowGenerator2.usePoissonSampling = true;
        shadowGenerator.getShadowMap().renderList.push(boule);

        boule.physicsImpostor = new BABYLON.PhysicsImpostor(boule, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: 2,
            restitution: 0,
            friction: 0.0
        }, this.scene);
        boule.physicsImpostor.physicsBody.linearDamping = .8;
        boule.physicsImpostor.physicsBody.angularDamping = .8;

        boule.move = () => {
            this.move=true;
            let velocityLin = boule.physicsImpostor.getLinearVelocity();

            if (velocityLin.y < -1 && this.impulseDown) {
                this.impulseDown = false;
            }
            if (this.inputStates.up && velocityLin.x < 20) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, -speed, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x + speed, velocityLin.y, velocityLin.z));
                this.ground.position.x = boule.position.x;
            }
            if (this.inputStates.down && velocityLin.x > -20) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, speed, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x - speed, velocityLin.y, velocityLin.z));
                this.ground.position.x = boule.position.x;
            }
            if (this.inputStates.left && velocityLin.z < 20) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(speed, 0, 0, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x, velocityLin.y, velocityLin.z + speed));
            }
            if (this.inputStates.right && velocityLin.z > -20) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(-speed, 0, 0, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x, velocityLin.y, velocityLin.z - speed));
            }
            if (this.inputStates.space && this.jump) {
                this.jump = false;
                boule.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 100, 0), boule.getAbsolutePosition());

            }
        };
        this.boule = boule;


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
            if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
                this.inputStates.left = true;
            } else if ((event.key === "ArrowUp") || (event.key === "z") || (event.key === "Z")) {
                this.inputStates.up = true;
            } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
                this.inputStates.right = true;
            } else if ((event.key === "ArrowDown") || (event.key === "s") || (event.key === "S")) {
                this.inputStates.down = true;
            } else if (event.key === " ") {
                this.inputStates.space = true;
            }
        }, false);

        //if the key will be released, change the states object
        window.addEventListener('keyup', (event) => {
            if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
                this.inputStates.left = false;
            } else if ((event.key === "ArrowUp") || (event.key === "z") || (event.key === "Z")) {
                this.inputStates.up = false;
            } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
                this.inputStates.right = false;
            } else if ((event.key === "ArrowDown") || (event.key === "s") || (event.key === "S")) {
                this.inputStates.down = false;
            } else if (event.key === " ") {
                this.inputStates.space = false;
            }
        }, false);
    }

    createJeton(i, x, y, z) { // cree un jeton aux coordonnées (x,y,z)
        let jeton = new BABYLON.MeshBuilder.CreateSphere("jeton_" + i, {diameter: 2}, this.scene);
        jeton.physicsImpostor = new BABYLON.PhysicsImpostor(jeton, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: 0,
            restitution: 0
        }, this.scene);
        let jetonMaterial = new BABYLON.StandardMaterial("jetonMaterial", this.scene);
        jeton.position = new BABYLON.Vector3(x, y, z)
        jetonMaterial.emissiveColor = new BABYLON.Color3.Blue;
        jeton.material = jetonMaterial;
        jeton.material.specularColor = new BABYLON.Color3(0, 0, 0);

        jeton.checkCollisions = true;
        this.scene.jetons[i] = jeton;
        this.nbrJeton = i - 1;
        this.allObstacles[this.ind++] = jeton;
        return jeton;

    }
    createShadow(ground) {
        let mirrorMaterial = new BABYLON.StandardMaterial("mirrorMaterial", this.scene);

        mirrorMaterial.specularColor = new BABYLON.Color3.Black;
        mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, this.scene, true);
        mirrorMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -0.1, 0, -0.1);
        mirrorMaterial.reflectionTexture.level = 1; // between 0 and 1
        ground.material = mirrorMaterial;
        mirrorMaterial.reflectionTexture.renderList.push(this.boule);
        return mirrorMaterial;
    }

    generateJetons(xMax,xMin,zMax,zMin) { //genere des jetons a des endroits aleatoire

        for (let i = 0; i < this.nbrJetonToGenerate; i++) {
            let xrand = Math.floor(Math.random() * xMax - xMin);
            let zrand = Math.floor(Math.random() * zMax - zMin);
            this.createJeton(i, xrand, 7, zrand);
        }
        return this.key;

    }

    collision() {
        this.boule.actionManager = new BABYLON.ActionManager(this.scene);
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
                    if (jeton.physicsImpostor) {
                        jeton.physicsImpostor.dispose();
                        jeton.dispose();

                        var music = new BABYLON.Sound("Violons", "sounds/coin.wav", this.scene, null, {
                            loop: false,
                            autoplay: true
                        });
                        this.nbrJetonToGenerate -= 1;
                    }

                }
            ));
        });
        if (this.level===2){
            console.log(this.faille)
            this.boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.faille
                },
                () => {
                    if (this.boule.key) this.faille.dispose();


                }));
        }
        this.allStep.forEach(step => {
            this.boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                    parameter: step
                },
                () => {
                    if (step.physicsImpostor && !this.jump) {
                        var music = new BABYLON.Sound("Violons", "sounds/rebond.wav", this.scene, null, {
                            loop: false,
                            autoplay: true
                        });
                    }

                }));
        });


    }

    events() {
        if (this.boule.intersectsMesh(this.ground, true)) {
            this.boule.position = new BABYLON.Vector3(this.respawn.x, this.respawn.y, this.respawn.z);
            this.boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, 0, 0));
            this.boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        }
    }


    createPanneau(parent, x, y, z, message, messageOnClick) {

        var plane = BABYLON.Mesh.CreatePlane("plane", 10, this.scene);
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
        plane.parent = parent;
        plane.position = new BABYLON.Vector3(x,y,z);
        plane.rotation.y=1.58;

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


}