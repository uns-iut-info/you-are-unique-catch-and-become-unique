import GeneratorToken from "./GeneratorToken.js";
import Particles from "./Particles.js"
import Boss from "./Boss.js";

export default class Obstacles {
    scene;
    main;

    constructor(main) {
        this.main = main;
        this.nbrJeton = main.nbrJeton;
        this.scene = main.scene;
        this.generatorToken = new GeneratorToken(main);
        this.generatorParticles = new Particles(this.scene);


    }

    createStep(w, s, x, y, z, sound, texture) {
        let step = new BABYLON.MeshBuilder.CreateBox("step_", {
            size: s,
            width: w,
            height: 2,
            restitution: 0,
        }, this.scene, false);
        step.physicsImpostor = new BABYLON.PhysicsImpostor(step, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            restitution: 0,
            gravity: 18,
            friction: 0.1,
        }, this.scene);

        step.material = new BABYLON.StandardMaterial("stepMaterial", this.scene);
        step.receiveShadows = true;
        step.material.diffuseTexture = texture ? new BABYLON.Texture(texture) : new BABYLON.Texture("images/asteroid.jpg");
        step.checkCollisions = true;
        step.position = new BABYLON.Vector3(x, y, z);
        if (sound === true) {
            this.main.allStep[this.main.ind] = step;
            this.main.ind += 1;
        } else {
            step.actionManager = new BABYLON.ActionManager(this.scene);
            step.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.main.boule
                },
                () => {


                    var music = new BABYLON.Sound("collision", "sounds/collision.wav", this.scene, null, {
                        loop: false,
                        autoplay: true
                    });


                }));
        }
        this.main.allObstacles[this.main.ind++] = step;
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, this.main.light);
        shadowGenerator.addShadowCaster(this.main.boule);
        shadowGenerator.useExponentialShadowMap = true;
        return step;
    }

    stepByStep(x, z) {
        this.createStep(20, 20, x, 7, z, true);
        this.createStep(10, 10, x + 23, 14, z, true);
        this.createStep(5, 5, x + 38, 21, z, true);
        this.createStep(10, 10, x + 53, 14, z, true);
        this.createStep(20, 20, x + 73, 7, z, true);
        this.generatorToken.createJeton(this.nbrJeton, x + 38, 24, z);
        this.nbrJeton -= 1;
    }

    poutre(x, z) {

        this.createStep(20, 20, x, 7, z, true);
        this.createStep(10, 10, x + 23, 14, z, true);
        this.createStep(10, 10, x + 83, 14, z, true);
        this.createStep(20, 20, x + 103, 7, z, true);

        const poutre = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 50, diameterTop: 1, diameterBottom: 1});
        poutre.physicsImpostor = new BABYLON.PhysicsImpostor(poutre, BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0,
            friction: 0.9,
        }, this.scene);
        this.main.allObstacles[this.main.ind++] = poutre;

        poutre.position = new BABYLON.Vector3(x + 53, 14, z);
        poutre.material = new BABYLON.StandardMaterial("buche", this.scene);
        poutre.material.diffuseTexture = new BABYLON.Texture("images/poutre.jpg");
        poutre.rotate(BABYLON.Axis.Z, 1.57);
        poutre.checkCollisions = true;

        this.generatorToken.createJeton(this.nbrJeton, poutre.position.x, poutre.position.y + 5, poutre.position.z);
        this.nbrJeton -= 1;


    }

    createKey(x, y, z) {
        let cercle = new BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.55, diameter: 3}, this.scene);

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

        cercle.material = new BABYLON.StandardMaterial("cercle", this.scene);
        barre.material = new BABYLON.StandardMaterial("barre", this.scene);
        trait1.material = new BABYLON.StandardMaterial("trait1", this.scene);
        trait2.material = new BABYLON.StandardMaterial("trait2", this.scene);

        cercle.material.emissiveColor = new BABYLON.Color3.Yellow();
        barre.material.emissiveColor = new BABYLON.Color3.Yellow();
        trait1.material.emissiveColor = new BABYLON.Color3.Yellow();
        trait2.material.emissiveColor = new BABYLON.Color3.Yellow();

        cercle.rotation = new BABYLON.Vector3(1.58, 1.58, 0);
        barre.rotation = new BABYLON.Vector3(0, 1.58, 1.58);
        this.createStep(12, 12, x, y, z, true);
        let socle = this.createStep(12, 12, x + 25, y + 6, z + 10, true);
        this.createStep(12, 12, x + 60, y, z, true);
        cercle.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 5, socle.position.z);
        trait2.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 4.5, socle.position.z - 5.7);
        trait1.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 4.5, socle.position.z - 5);
        barre.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 5, socle.position.z - 4);
        cercle.particles = this.generatorParticles.createParticlesForKey(x + 25, y + 14, z + 10)

        cercle.addChild(barre);
        barre.addChild(trait1);
        barre.addChild(trait2);

        this.scene.jetons[this.nbrJeton] = cercle;
        this.nbrJeton -= 1;
        this.main.key = cercle;
        cercle.physicsImpostor = new BABYLON.PhysicsImpostor(cercle, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: 0,
            restitution: 0
        }, this.scene);
        this.main.allObstacles[this.main.ind++] = cercle;
        this.main.allObstacles[this.main.ind++] = cercle.particles;

        return cercle;

    }

    coffreFort(x, y, z) {
        let cote1 = this.createStep(20, 20, x + 10, y + 10, z + 10, false, "images/bunker.png");
        let faille = this.createStep(20, 20, x - 10, y + 10, z + 10, false, "images/bunker.png");
        let cote2 = this.createStep(22, 20, x, y + 10, z, false, "images/bunker.png");
        let cote3 = this.createStep(22, 20, x, y + 10, z + 20, false, "images/bunker.png");
        let toit = this.createStep(22, 22, x, y + 20, z + 10, false, "images/bunker.png");

        cote1.rotate(BABYLON.Axis.Z, 1.57);
        faille.rotate(BABYLON.Axis.Z, 1.57);

        cote3.rotate(BABYLON.Axis.Z, 1.57);
        cote3.rotate(BABYLON.Axis.X, 1.57);

        cote2.rotate(BABYLON.Axis.Z, 1.57);
        cote2.rotate(BABYLON.Axis.X, 1.57);

        cote1.material.emissiveColor = new BABYLON.Color3.Gray();
        cote2.material.emissiveColor = new BABYLON.Color3.Gray();
        cote3.material.emissiveColor = new BABYLON.Color3.Gray();
        toit.material.emissiveColor = new BABYLON.Color3.Gray();

        this.generatorToken.createJeton(this.nbrJeton, x, y + 7, z + 10);
        this.nbrJeton -= 1;


        // panneau
        this.createPanneau(toit, 0, 10, 0, "Find \nthe key", "You have to find the key for open the safe")
        this.main.faille = faille;

    }


    createInvisibleHouse(x, y, z) {
        let cote1 = this.createStep(20, 20, x + 10, y + 10, z, false);
        let coteB = this.createStep(7, 20, x - 10, y + 5, z, false);
        let cote2 = this.createStep(22, 20, x, y + 10, z - 10, false);
        let cote3 = this.createStep(22, 20, x, y + 10, z + 10, false);
        let toit = this.createStep(22, 22, x, y + 20, z, false);

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
        let jeton = this.generatorToken.createJeton(this.nbrJeton, x, y + 2, z);
        this.nbrJeton -= 1;
        jeton.actionManager = new BABYLON.ActionManager(this.scene);
        jeton.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: this.main.boule
            },
            () => {
                if (jeton.physicsImpostor) {
                    jeton.physicsImpostor.dispose();
                    jeton.dispose();
                    this.main.nbrJetonToGenerate -= 1;
                    var music = new BABYLON.Sound("Violons", "sounds/coin.wav", this.scene, null, {
                        loop: false,
                        autoplay: true
                    });
                }

            }));


        this.createPanneau(toit, 0, 10, 0, "Invisible\n House", "There is a breach in the house where you can pass and get the token")
    }

    floorIsLava(x, y, z) {
        this.main.floorisLava = true;
        var acc = 0;
        for (let i = 0; i < 7; i++) {
            acc += 5;
            var pos = (i % 2) === 0 ? 7 : -7;
            let step = this.createStep(15, 15, x + (acc * 3), y + acc, z + pos, true, "images/magma.jpeg");
            step.modifyMass = () => {
                step.physicsImpostor.mass = 0.1;

            }
            step.disparait = () => {
                step.dispose();
            }
            if (!step.actionManager) step.actionManager = new BABYLON.ActionManager(this.scene);
            step.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.main.boule
                },
                () => {
                    var music = new BABYLON.Sound("Violons", "sounds/grill.mp3", this.scene, null, {
                        loop: false,
                        autoplay: true
                    });
                    setTimeout(step.modifyMass, 2000);
                    setTimeout(step.disparait, 5000);

                }));
        }

    }

    createPanneau(parent, x, y, z, message, messageOnClick) {

        var plane = BABYLON.Mesh.CreatePlane("plane", 10, this.main.scene);
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
        plane.parent = parent;
        plane.position = new BABYLON.Vector3(x, y, z);
        plane.rotation.y = 1.58;


        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", message);
        button1.width = "100%";
        button1.height = "100%";
        button1.color = "white";
        button1.fontSize = "20%";
        button1.background = "green";
        var obj = this;
        var main = this.main;
        button1.onPointerUpObservable.add(function () {
            main.generatorLevel.generatorMenu.soundClic();
            obj.panneau(messageOnClick);
        });
        advancedTexture.addControl(button1);

        return button1;
    }

    panneau(message) {
        this.main.canMove = false;
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", message);
        button1.fontSize = "4%";
        button1.width = "30%";
        button1.height = "15%";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "rgba(0, 0, 0, 0.5)";

        var obj = this.main

        button1.onPointerUpObservable.add(function () {
            obj.generatorLevel.generatorMenu.soundClic();
            obj.canMove = true;
            advancedTexture.dispose();
        });
        this.main.generatorMenu.hud.push(button1)
        advancedTexture.addControl(button1);

    }

    createRondin(x, y, z) {
        let poutres = [];
        poutres[0] = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 80, diameterTop: 50, diameterBottom: 50});
        poutres[0].physicsImpostor = new BABYLON.PhysicsImpostor(poutres[0], BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0,
            friction: 0.1,
        }, this.scene);
        poutres[0].position = new BABYLON.Vector3(x, y, z);
        poutres[0].rotate(BABYLON.Axis.Z, 1.57);
        poutres[0].material = new BABYLON.StandardMaterial("poutre1", this.scene);
        poutres[0].material.diffuseTexture = new BABYLON.Texture("images/fleches.png");

        poutres[1] = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 80, diameterTop: 50, diameterBottom: 50});
        poutres[1].physicsImpostor = new BABYLON.PhysicsImpostor(poutres[1], BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0,
            friction: 1,
        }, this.scene);
        poutres[1].position = new BABYLON.Vector3(x + 80, y, z);
        poutres[1].rotate(BABYLON.Axis.Z, 1.57);
        poutres[1].rotate(BABYLON.Axis.X, 3.14);
        poutres[1].material = new BABYLON.StandardMaterial("poutre2", this.scene);
        poutres[1].material.diffuseTexture = new BABYLON.Texture("images/fleches.png");

        poutres[2] = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 80, diameterTop: 50, diameterBottom: 50});
        poutres[2].physicsImpostor = new BABYLON.PhysicsImpostor(poutres[2], BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0,
            friction: 1,
        }, this.scene);
        poutres[2].position = new BABYLON.Vector3(x + 160, y, z);
        poutres[2].rotate(BABYLON.Axis.Z, 1.57);
        poutres[2].material = new BABYLON.StandardMaterial("poutre3", this.scene);
        poutres[2].material.diffuseTexture = new BABYLON.Texture("images/fleches.png");
        return poutres;
    }

    createPique(x, y, z, descendFirst) {
        let step = this.createStep(10, 10, x, y, z, false, "images/magma.jpeg");
        step.monte = !descendFirst;
        var barre = [];
        for (let i = 0; i < 6; i++) {
            barre[i] = new BABYLON.MeshBuilder.CreateCylinder("cylinder", {
                height: 3,
                diameterTop: 2,
                diameterBottom: 0.5
            });
            barre[i].physicsImpostor = new BABYLON.PhysicsImpostor(barre[i], BABYLON.PhysicsImpostor.CylinderImpostor, {
                mass: 0,
                restitution: 0
            }, this.scene);
            barre[i].rotate(BABYLON.Axis.Z, 3.14);
            barre[i].material = new BABYLON.StandardMaterial("pique", this.scene);
            barre[i].material.diffuseTexture = new BABYLON.Texture("images/lava.jpg");
            step.addChild(barre[i]);

        }
        barre[0].position = new BABYLON.Vector3(-3, 2, -3);
        barre[1].position = new BABYLON.Vector3(-3, 2, 0);
        barre[2].position = new BABYLON.Vector3(-3, 2, 3);

        barre[3].position = new BABYLON.Vector3(3, 2, -3);
        barre[4].position = new BABYLON.Vector3(3, 2, 0);
        barre[5].position = new BABYLON.Vector3(3, 2, 3);

        step.move = function movePique(direction) {
            let dir;
            let axe;
            let vecteur = new BABYLON.Vector3(0, 0, 0);
            switch (direction) {
                case "x": {
                    dir = step.position.x;
                    axe = x;
                    vecteur = new BABYLON.Vector3(0.22, 0, 0);
                    break;
                }
                case "y": {
                    dir = step.position.y;
                    axe = y;
                    vecteur = new BABYLON.Vector3(0, 0.22, 0);
                    break;
                }
                case "z": {
                    dir = step.position.z;
                    axe = z;
                    vecteur = new BABYLON.Vector3(0, 0, 0.22);
                    break;
                }
            }
            if (step.monte) {
                if (dir < axe + 7) {
                    step.position = new BABYLON.Vector3(step.position.x + vecteur.x, step.position.y + vecteur.y, step.position.z + vecteur.z);
                } else {
                    step.monte = false;
                }
            } else {
                if (dir > axe - 7) {
                    step.position = new BABYLON.Vector3(step.position.x - vecteur.x, step.position.y - vecteur.y, step.position.z - vecteur.z);
                } else {
                    step.monte = true;
                }
            }
        }

        barre.forEach(b => {
            b.actionManager = new BABYLON.ActionManager(this.scene);
            b.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.main.boule
                },
                () => {
                    this.main.pique = true;

                }));
        });

        return step;
    }


    createBoulet(x, y, z) {

        let manche = new BABYLON.MeshBuilder.CreateCylinder("cylinder", {
            height: 30,
            diameterTop: 2.5,
            diameterBottom: 2.5
        });
        manche.physicsImpostor = new BABYLON.PhysicsImpostor(manche, BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0
        }, this.scene);
        manche.droite = true;
        manche.position = new BABYLON.Vector3(x, y, z);
        manche.rotate(BABYLON.Axis.Z, 3.14);

        var piqueG = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 10, diameterTop: 1, diameterBottom: 10});
        piqueG.physicsImpostor = new BABYLON.PhysicsImpostor(piqueG, BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0,
            friction: 1,
        }, this.scene);

        var piqueD = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 10, diameterTop: 1, diameterBottom: 10});
        piqueD.physicsImpostor = new BABYLON.PhysicsImpostor(piqueD, BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0,
            friction: 1,
        }, this.scene);
        piqueD.position = new BABYLON.Vector3(x, y - 18, z - 5);
        piqueG.position = new BABYLON.Vector3(x, y - 18, z + 5);

        piqueG.rotate(BABYLON.Axis.X, 1.57);
        piqueD.rotate(BABYLON.Axis.X, -1.57);

        manche.material = new BABYLON.StandardMaterial("pique", this.scene);
        manche.material.diffuseTexture = new BABYLON.Texture("images/lava2.png");
        piqueG.material = new BABYLON.StandardMaterial("pique", this.scene);
        piqueG.material.diffuseTexture = new BABYLON.Texture("images/lava2.png");
        piqueD.material = new BABYLON.StandardMaterial("pique", this.scene);
        piqueD.material.diffuseTexture = new BABYLON.Texture("images/lava2.png");

        manche.addChild(piqueG);
        manche.addChild(piqueD);
        var rotation = 0;
        manche.move = () => {
            if (manche.droite) {
                if (rotation < 1.57) {
                    manche.rotate(BABYLON.Axis.X, 0.02);
                    rotation += 0.02;
                } else {
                    manche.droite = false;
                }
            } else {
                if (rotation > -1.57) {
                    manche.rotate(BABYLON.Axis.X, -0.02);
                    rotation -= 0.02;
                } else {
                    manche.droite = true;
                }
            }
        }
        this.main.allObstacles[this.main.ind++] = manche;
        return manche;

    }

    inverseGravity(x, y, z) {
        let step1 = this.createStep(7, 40, x + 50, y - 5, z, true);
        let step2 = this.createStep(7, 40, x + 125, y - 5, z, true);
        let plafond = this.createStep(50, 50, x + 90, y + 90, z, true);

        step1.rotate(BABYLON.Axis.Y, 1.57);
        step2.rotate(BABYLON.Axis.Y, 1.57);
        plafond.rotate(BABYLON.Axis.Y, 1.57);


        this.groundPlafond = this.main.createGround(this.main.scene, x + 90, y + 120, z, "2")
        var physicsEngine = this.scene.getPhysicsEngine();
        plafond.move = () => {
            if (this.main.boule.position.x >= x + 105 && (this.main.boule.position.z < z + 5 && this.main.boule.position.z > z - 5)) {
                physicsEngine.setGravity(new BABYLON.Vector3(physicsEngine.gravity.x, -80, physicsEngine.gravity.z));
                this.monte = false;
            } else if (this.main.boule.position.x >= x + 62 && (this.main.boule.position.z < z + 5 && this.main.boule.position.z > z - 5)) {
                physicsEngine.setGravity(new BABYLON.Vector3(physicsEngine.gravity.x, 80, physicsEngine.gravity.z));
                this.monte = true;
            }
            if (this.monte && this.main.camera.beta !== 6.14 / 3) {
                this.main.camera.beta += 0.02;
            } else if (this.main.camera.beta > 3.14 / 3) {
                this.main.camera.beta -= 0.02;
            }
            let retourneCamera = this.main.events(this.groundPlafond)

            if (retourneCamera === false) {
                this.monte = false
                physicsEngine.setGravity(new BABYLON.Vector3(physicsEngine.gravity.x, -80, physicsEngine.gravity.z));
                this.main.camera.beta = 3.14 / 3;
                if (this.main.isDead===false)this.main.generatorLevel.generatorMenu.menuMain((this.main.level % this.main.nbrLevel));

            } else if (retourneCamera === true) {
                this.monte = false;
                physicsEngine.setGravity(new BABYLON.Vector3(physicsEngine.gravity.x, -80, physicsEngine.gravity.z));
                this.main.camera.beta = 3.14 / 3;
                this.main.generatorLevel.createNewLevel = retourneCamera;
                this.main.generatorLevel.deleteLevel();
                this.groundPlafond.dispose();
                this.main.generatorLevel.generatorMenu.menuMain((this.main.level % this.main.nbrLevel));
            }

        }
        this.main.allObstacles[this.main.ind++] = this.generatorParticles.createParticlesCircle(x + 67, y - 5, z, false);
        this.main.allObstacles[this.main.ind++] = this.generatorParticles.createParticlesCircle(x + 110, y + 85, z, true);

        return plafond;

    }

    ascenseur(x, y, z) {
        let ascenseur = this.createStep(20, 20, x, y, z, true, "images/lift.jpeg");
        let life = this.generatorToken.createLife(x, y + 5, z);
        ascenseur.addChild(life);
        if (!ascenseur.actionManager) ascenseur.actionManager = new BABYLON.ActionManager(this.scene);
        ascenseur.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: this.main.boule
            },
            () => {
                ascenseur.monte = true;
            }));
        ascenseur.move = () => {
            if (ascenseur.monte && ascenseur.position.y < 70) {
                ascenseur.position.y += 0.4;
            } else {
                ascenseur.monte = false;
            }
        }

        return ascenseur;
    }

    stepIncline(x, y, z) {
        let allStep = [];
        for (let i = 0; i < 4; i++) {
            let acc = i * 20;
            let rotation = 0;
            allStep[i] = this.createStep(20, 10, x + acc, y - acc, i % 2 === 0 ? z - 20 : z + 20, true, "images/fleche2.jpg");
            allStep[i].rotate(BABYLON.Axis.X, rotation = i % 2 === 0 ? 0.5 : -0.5);
            allStep[i].rotate(BABYLON.Axis.Y, rotation = i % 2 === 0 ? -0.6 : 0.6);
            allStep[i].rotate(BABYLON.Axis.Z, 0.1);
            this.generatorToken.createJeton(this.nbrJeton, x + acc, y - acc + 3, i % 2 === 0 ? z - 20 : z + 20);
            this.nbrJeton -= 1;
        }
    }

    duelFinal() {
        this.createStep(100, 100, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, true);
        this.boss = new Boss(this.main);
        this.bossBoule = this.boss.createBoss(this.main.boule);
    }


}