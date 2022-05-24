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
    canPush=false;
    impulseDown = false;
    level = 0;
    nbrLevel = 12;
    move = false;
    faille;
    affichage;
    life = [];
    nbrLife = 3;
    access = true;
    floorisLava;
    pique = false;
    camera;
    turn = true;
    isDead=false;
    rebond=["sounds/Pyanno_1.mp3","sounds/Pyanno_2.mp3","sounds/Pyanno_3.mp3","sounds/Pyanno_4.mp3"]
    ind_rebond=0;


    constructor(scene, ground, respawnPoint) {
        this.scene = scene;
        this.ground = ground;
        this.nbrJeton = 5; // nombre de jetons restant a créer
        this.nbrJetonToGenerate = 5; // nombre de jetons courant a recuperer
        this.allJeton = 5; // nombre de jetons crée au total dans le niveau
        this.respawn = respawnPoint;
        this.printer = new Affichage(this);
        this.music_fond = new BABYLON.Sound("music_fond", "sounds/music_fond2.wav", scene, null, {
            loop: true,
            autoplay: true
        });
        this.music_fond.setVolume(0.7)
        this.generatorParticles = new Particles(scene);
    }

    createArcCamera(scene, target) {
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 80, target, scene);
        camera.alpha = -3.14;
        camera.beta = 3.14 / 3;
        camera.move = () => {
            camera.alpha += 0.02;
            if(this.lightForMove) this.lightForMove.position=camera.position;
        }
        return camera;
    }

    createMoveCamera(middle) {
        this.cameraToMove = this.createArcCamera(this.scene, new BABYLON.Vector3(middle, 0, 0));
        this.lightForMove = new BABYLON.PointLight("light", new BABYLON.Vector3(middle, 70, 0), this.scene);
        this.lightForMove.intensity = 0.5;
        this.cameraToMove.radius = this.radius;
        this.cameraToMove.turn = () => {
            if (this.cameraToMove.alpha < 3.14) {
                this.cameraToMove.move();
                return false;
            } else {
                if (this.cameraToMove.radius > 80) {
                    this.cameraToMove.target = this.boule.position
                    this.cameraToMove.radius -= 1;
                    if (this.cameraToMove.beta < this.camera.beta) this.cameraToMove.beta += 0.02;
                    if (this.cameraToMove.beta > this.camera.beta) this.cameraToMove.beta -= 0.02;
                    return false;
                }
            }
            this.scene.activeCamera = this.camera;
            this.turn = false;
            this.canMove = true;
            this.hasNeverTurn=false;
            this.lightForMove.dispose();
            this.cameraToMove.dispose();
            this.cameraToMove = undefined;
            this.skip.dispose();
            if ((this.level % this.nbrLevel) === 11) {
                var fight = new BABYLON.Sound("fight", "sounds/fight.wav", this.scene, null, {loop: false, autoplay: true});
            }
            return true;
        }
    }


    createGround(scene, x, y, z, id) {
        let ground = BABYLON.Mesh.CreateGround("ground_" + id, 500, 500, 1, scene);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: -1
        }, scene);
        ground.material = new BABYLON.StandardMaterial("groundMaterial" + id, scene);
        ground.checkCollisions = true;
        ground.position = new BABYLON.Vector3(x, y, z);
        ground.wireframe = true;
        ground.material.alpha = 0;
        return ground;
    }

    castRay(myMesh) {
        this.oneTime=true;
        var ray = new BABYLON.Ray(myMesh.position, new BABYLON.Vector3(0, -1, 0), 4);
        let hit = this.scene.pickWithRay(ray, (mesh) => {
            return (mesh !== myMesh);
        });
        if(hit.pickedMesh) {
            myMesh.actionManager = new BABYLON.ActionManager(this.scene);
            myMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: hit.pickedMesh
                },
                () => {
                    this.jump = true;


                }));
            myMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                    parameter: hit.pickedMesh
                },
                () => {
                    this.jump = false;


                }));
        }
    }

    createSphere() {
        let boule = new BABYLON.MeshBuilder.CreateSphere("heroboule", {diameter: 7}, this.scene);
        boule.applyGravity = true;
        boule.position = new BABYLON.Vector3(this.respawn.x, this.respawn.y, this.respawn.z);
        boule.checkCollisions = true;
        this.scene.registerBeforeRender(() => {
            this.castRay(boule);
        });


        boule.speed = 2;
        boule.applyGravity = true;
        boule.material = new BABYLON.StandardMaterial("s-mat", this.scene);
        boule.material.diffuseTexture = new BABYLON.Texture("images/earth.jpg", this.scene);
        boule.material.emissiveColor = new BABYLON.Color3.White;


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
            if (this.canMove) {
                if (velocityLin.y < -1 && this.impulseDown) {
                    this.impulseDown = false;
                }
                if (this.inputStates.up && velocityLin.x < 30) {
                    if (this.inputStates.swift && this.canPush===true) this.punch();
                    boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, angularVel.z - this.boule.speed + this.boule.speed / 1.5, 0));
                    boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x + this.boule.speed, velocityLin.y, velocityLin.z));

                }
                if (this.inputStates.down && velocityLin.x > -30) {
                    if (this.inputStates.swift && this.canPush===true) this.punch()
                    boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, angularVel.z + this.boule.speed - this.boule.speed / 1.5, 0));
                    boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x - this.boule.speed, velocityLin.y, velocityLin.z));
                }
                if (this.inputStates.left && velocityLin.z < 30) {
                    if (this.inputStates.swift && this.canPush===true) this.punch()
                    boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(angularVel.x + this.boule.speed - this.boule.speed / 1.5, 0, 0, 0));
                    boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x, velocityLin.y, velocityLin.z + this.boule.speed));
                }
                if (this.inputStates.right && velocityLin.z > -30) {
                    if (this.inputStates.swift && this.canPush===true) this.punch()
                    boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(angularVel.x - this.boule.speed + this.boule.speed / 1.5, 0, 0, 0));
                    boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x, velocityLin.y, velocityLin.z - this.boule.speed));
                }
                if (this.inputStates.space && this.jump && velocityLin.y < 15) {
                    this.jump = false;
                    this.oneTime=false;
                    boule.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 100, 0), boule.getAbsolutePosition());

                }
                if (this.inputStates.p) {
                    if (this.cameraToMove) {
                        this.cameraToMove.move();
                    } else {
                        this.createMoveCamera(this.middle);
                    }
                    this.scene.activeCamera = this.cameraToMove;


                }
                this.ground.position.x = boule.position.x;
                this.ground.position.z = boule.position.z;
                this.light.position.x = boule.position.x - 20;
                this.light.position.z = boule.position.z;
                if (this.level % this.nbrLevel === 9) this.light.position.y = boule.position.y + 70;
            }

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
        this.inputStates.p = false;
        this.inputStates.b = false;
        this.inputStates.swift = false;
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
            } else if (event.key === "p") {
                this.inputStates.p = true;
            } else if (event.keyCode === 13) {
                if(this.turn){
                    if(this.skip){
                        this.skip.dispose();
                    }
                    this.turn=false;
                    this.hasNeverTurn=false;
                    this.canMove=true;
                    this.resetCamera();
                }
                if(this.generatorMenu.advancedTexture)this.generatorMenu.pressStartButton(this.generatorMenu.advancedTexture)

                if(this.generatorMenu.pushBonus===true)this.generatorMenu.pushMenu();
            }
            else if (event.keyCode === 16 && (this.level % this.nbrLevel) === 11) {
                this.inputStates.swift = true;
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
            } else if (event.key === "p") {
                if (this.canMove) {
                    this.resetCamera();
                }
                this.inputStates.p = false;
            } else if (event.keyCode === 16) {
                this.boule.speed = 2;
                this.inputStates.swift = false;
            }
        }, false);
    }

    punch(){
        this.boule.speed=120;
        this.canPush=false;
        var nitro = new BABYLON.Sound("music_fond", "sounds/nitro.mp3", this.scene, null, {
            loop: false,
            autoplay: true
        });
        this.generatorMenu.progressBarPush();

        // PARTICULES
        var particleSystem = new BABYLON.ParticleSystem("particles", 20000, this.scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("/textures/flare.png", this.scene);

        // Where the particles come from
        particleSystem.emitter = this.boule; // the starting object, the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, -1); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 1); // To...

        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0, 1, 0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 1.0, 0, 1.0);

        // Size of each particle (random between...
        particleSystem.minSize = 0.5;
        particleSystem.maxSize = 0.9;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 0.5;

        // Emission rate
        particleSystem.emitRate = 20000;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new BABYLON.Vector3(5, 0, 0);
        particleSystem.direction2 = new BABYLON.Vector3(-5, 0, 0);

        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 5;
        particleSystem.updateSpeed = 0.005;
        this.particulePush=particleSystem;
        particleSystem.start();
        setTimeout(()=>{
            this.particulePush.stop();
            this.boule.speed=2;
        },1000)

    }



    collision() {
        if (!this.boule.actionManager) this.boule.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.jetons.forEach(jeton => {
            jeton.actionManager = new BABYLON.ActionManager(this.scene);
            jeton.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.boule
                },
                () => {
                    if (jeton === this.key) {
                        this.boule.key = true;
                        this.key.particles.stop();
                    }
                    if (jeton.physicsImpostor) {
                        if (jeton !== this.key) {
                            jeton.particles = this.generatorParticles.createParticlesForJeton(jeton.position.x, jeton.position.y + 3, jeton.position.z)
                            setTimeout(function () {
                                jeton.particles.stop();
                            }.bind(this), 200);
                        }
                        jeton.physicsImpostor.dispose();
                        jeton.dispose();
                        this.scene.jetons.splice(this.scene.jetons.indexOf(jeton), 1);

                        var music = new BABYLON.Sound("Violons", "sounds/coin.wav", this.scene, null, {
                            loop: false,
                            autoplay: true
                        });

                        this.nbrJetonToGenerate -= 1;

                    }
                    if (this.affichage) this.affichage.dispose();
                    if ((this.level % this.nbrLevel) !== 11 || (this.level % this.nbrLevel) !== 10) this.printer.printNumberOfJeton();

                }
            ));
        });
        if (this.key) {
            this.faille.actionManager = new BABYLON.ActionManager(this.scene);
            this.faille.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.boule
                },
                () => {
                    if (this.boule.key) this.faille.dispose();


                }));
        }
        this.allStep.forEach(step => {
            if (!step.actionManager) step.actionManager = new BABYLON.ActionManager(this.scene);
            step.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                    parameter: this.boule
                },
                () => {
                    if (step.physicsImpostor && this.inputStates.space) {
                        var music = new BABYLON.Sound("Violons", this.rebond[this.ind_rebond%this.rebond.length], this.scene, null, {
                            loop: false,
                            autoplay: true
                        });
                        this.ind_rebond+=1;
                        music.setVolume(13);
                    }

                }));
        });


    }

    events(ground) {
        if (this.boule.intersectsMesh(ground, true) || this.pique) {
            if (this.generatorMenu.rectangle)this.generatorMenu.hud.push(this.generatorMenu.rectangle);
            this.generatorMenu.clearHud();
            this.resetCamera();
            this.hasNeverTurn = false;
            this.pique = false;
            this.resetBoulePosition()
            this.life[this.nbrLife].dispose();
            if (this.generatorMenu.winOrLoose===false)this.nbrLife -= 1;
            if (this.nbrLife === 0) {
                var gameover = new BABYLON.Sound("gameover", "sounds/game_over.wav", this.scene, null, {
                    loop: false,
                    autoplay: true
                });
                this.isDead=true;
                this.music_oneLife.stop();
                this.winOrLoose(false);
                return false;
            }
            var looseLife = new BABYLON.Sound("looseLife", "sounds/looseLife.wav", this.scene, null, {
                loop: false,
                autoplay: true
            });
            if (this.nbrLife === 1) this.music_oneLife = new BABYLON.Sound("heartbeat", "sounds/heartbeat.wav", this.scene, null, {
                loop: true,
                autoplay: true
            });
            if (this.level % this.nbrLevel === 4) {
                this.scene.getPhysicsEngine().setGravity(new BABYLON.Vector3(this.scene.getPhysicsEngine().gravity.x, -80, this.scene.getPhysicsEngine().gravity.z));
                return false;
            }
            if (this.generatorMenu.winOrLoose===false){
                this.generatorMenu.menuMain(this.level % this.nbrLevel);
            }
            if (this.floorisLava || this.level % this.nbrLevel === 11) {// si c'est le niveau floorIsLava on doit regenerer le niveau completement
                if (this.affichage) this.affichage.dispose();
                return true;
            }
            if (this.level % this.nbrLevel === 9) {
                this.generatorLevel.ascenseur.position.y = this.respawn.y - 5;
                this.generatorLevel.ascenseur.monte = false;
            }


        }
        if (this.access) {
            this.printer.printLife();
            this.access = false;
        }

    }

    resetBoulePosition(){
        this.boule.position = new BABYLON.Vector3(this.respawn.x, this.respawn.y, this.respawn.z);
        this.boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, 0, 0));
        this.boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
    }

    resetGame() {
        this.nbrLife = 3;
        this.hasNeverTurn = true;
        if (this.key) delete this.key;
        this.access = true;
        if (this.boule.key) this.boule.key = false;
        if (this.affichage) this.affichage.dispose();

    }

    resetCamera() {
        if(this.cameraToMove)this.cameraToMove.dispose();
        this.cameraToMove = undefined;
        if(this.lightForMove)this.lightForMove.dispose();
        this.scene.activeCamera = this.camera;
    }

    initialisation(){
        this.boule = this.createSphere();
        this.scene.activeCamera = this.createArcCamera(this.scene, this.boule);
        this.camera = this.scene.activeCamera;
    }

    setLevel(i){
        this.level=i;
        this.generatorLevel.createNewLevel=true;
        this.generatorMenu.clearHud();
        this.turn=true;


    }
    winOrLoose(win){
        let title = win===true ? "You Win" : "You Loose";
        let img = win === true ? "images/win.jpg" : "images/loose.jpeg";
        this.setLevel(0);
        this.generatorMenu.menuMain(undefined, img, false, title,true);
        this.resetGame();
    }


}