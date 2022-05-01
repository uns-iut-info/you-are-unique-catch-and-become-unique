import Affichage from "./Affichage.js";
import Particles from "./Particles.js";


export default class Main {
    boule;
    key;
    inputStates = {};
    allStep = [];
    ind = 0;
    allObstacles = [];
    jump = true;
    impulseDown = false;
    level = 0;
    nbrLevel=11;
    move = false;
    faille;
    affichage;
    life=[];
    nbrLife=3;
    access=true;
    floorisLava;
    pique=false;
    camera;


    constructor(scene, ground, respawnPoint) {
        this.scene = scene;
        this.ground = ground;
        this.nbrJeton = 5; // nombre de jetons restant a créer
        this.nbrJetonToGenerate = 5; // nombre de jetons courant a recuperer
        this.allJeton = 5; // nombre de jetons crée au total dans le niveau
        this.respawn = respawnPoint;
        this.printer = new Affichage(this);
        this.music = new BABYLON.Sound("music_fond", "sounds/music_fond.wav", scene, null, {loop: true, autoplay: true});
        this.generatorParticles = new Particles(scene);
    }

    createGround(scene, x, y, z, id) {
        let ground = BABYLON.Mesh.CreateGround("ground_" + id, 500, 500, 1, scene);
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

    createSphere() {
        let boule = new BABYLON.MeshBuilder.CreateSphere("heroboule", {diameter: 7}, this.scene);
        boule.applyGravity = true;
        boule.position = new BABYLON.Vector3(this.respawn.x, this.respawn.y, this.respawn.z);
        boule.checkCollisions = true;
        this.scene.registerBeforeRender(() => {
            this.castRay(boule);
        })


        boule.speed=2;
        boule.applyGravity = true;
        boule.material = new BABYLON.StandardMaterial("s-mat", this.scene);
        boule.material.diffuseTexture = new BABYLON.Texture("images/lightning.jpg", this.scene);
        boule.material.emissiveColor = new BABYLON.Color3.Red;
        boule.material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boule.material.diffuseTexture.uScale *= 4;
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, this.light);
        shadowGenerator.addShadowCaster(boule);
        shadowGenerator.useExponentialShadowMap = true;
        var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, this.light);
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
            this.move = true;

            let velocityLin = boule.physicsImpostor.getLinearVelocity();
            let angularVel = boule.physicsImpostor.getAngularVelocity();

            if (velocityLin.y < -1 && this.impulseDown) {
                this.impulseDown = false;
            }
            if (this.inputStates.up && velocityLin.x < 30) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, angularVel.z-this.boule.speed+this.boule.speed/1.5, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x + this.boule.speed, velocityLin.y, velocityLin.z));

            }
            if (this.inputStates.down && velocityLin.x > -30) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0,angularVel.z+this.boule.speed-this.boule.speed/1.5, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x - this.boule.speed, velocityLin.y, velocityLin.z));
            }
            if (this.inputStates.left && velocityLin.z < 30) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(angularVel.x+this.boule.speed-this.boule.speed/1.5, 0, 0, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x, velocityLin.y, velocityLin.z + this.boule.speed));
            }
            if (this.inputStates.right && velocityLin.z > -30) {
                boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(angularVel.x-this.boule.speed+this.boule.speed/1.5, 0, 0, 0));
                boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x, velocityLin.y, velocityLin.z - this.boule.speed));
            }
            if (this.inputStates.space && this.jump && velocityLin.y<15) {
                this.jump = false;
                boule.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 100, 0), boule.getAbsolutePosition());

            }
            this.ground.position.x = boule.position.x;
            this.ground.position.z = boule.position.z;
            this.light.position.x = boule.position.x-20;
            this.light.position.z = boule.position.z;
            if(this.level%9===8)this.light.position.y = boule.position.y+70;


        };


        return boule;
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

    collision() {
        if (!this.boule.actionManager)this.boule.actionManager = new BABYLON.ActionManager(this.scene);
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
                        if(jeton !== this.key){
                            jeton.particles=this.generatorParticles.createParticlesForJeton(jeton.position.x,jeton.position.y+3,jeton.position.z)
                            setTimeout(function () {
                                jeton.particles.stop();
                            }.bind(this), 200);
                        }
                        jeton.physicsImpostor.dispose();
                        jeton.dispose();

                        var music = new BABYLON.Sound("Violons", "sounds/coin.wav", this.scene, null, {
                            loop: false,
                            autoplay: true
                        });

                        this.nbrJetonToGenerate -= 1;

                    }
                    this.affichage.dispose();
                    this.printer.printNumberOfJeton();


                }
            ));
        });
        if (this.key) {
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
                    if (step.physicsImpostor && this.inputStates.space) {
                        var music = new BABYLON.Sound("Violons", "sounds/rebond.wav", this.scene, null, {
                            loop: false,
                            autoplay: true
                        });
                    }

                }));
        });


    }

    events(ground) {
        if (this.boule.intersectsMesh(ground, true) || this.pique ) {
            this.pique=false;
            this.boule.position = new BABYLON.Vector3(this.respawn.x, this.respawn.y, this.respawn.z);
            this.boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, 0, 0));
            this.boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
            console.log(this.life,this.nbrLife);
            this.life[this.nbrLife].dispose();
            this.nbrLife-=1;
            console.log(this.life,this.nbrLife);
            if(this.nbrLife===0){
                var gameover = new BABYLON.Sound("gameover", "sounds/game_over.wav", this.scene, null, {loop: false, autoplay: true});
                this.resetGame();
                return true;
            }
            var looseLife = new BABYLON.Sound("looseLife", "sounds/looseLife.wav", this.scene, null, {loop: false, autoplay: true});
            if(this.nbrLife===1)this.music = new BABYLON.Sound("heartbeat", "sounds/heartbeat.wav", this.scene, null, {loop: true, autoplay: true});

            if (this.floorisLava) {// si c'est le niveau floorIsLava on doit regenerer le niveau completement
                this.affichage.dispose();
                return true;
            }
            if(this.level%this.nbrLevel===3){
                this.scene.getPhysicsEngine().setGravity(new BABYLON.Vector3(this.scene.getPhysicsEngine().gravity.x, -80,this.scene.getPhysicsEngine().gravity.z));
                return false;
            }
            if (this.level % this.nbrLevel===8) {
                this.generatorLevel.ascenseur.position.y=this.respawn.y - 5;
                this.generatorLevel.ascenseur.monte=false;
            }



        }
        if(this.access){
            this.printer.printLife();
            this.access=false;
        }

    }

    resetGame(){
        this.music.stop();
        this.level = 0;
        this.nbrLife=3;
        delete this.key;
        this.access=true;
        if (this.boule.key)this.boule.key=false;
        this.affichage.dispose();

    }




}