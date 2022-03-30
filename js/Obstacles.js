export default class Obstacles {
    scene;
    main;

    constructor(main) {
        this.main = main;
        this.nbrJeton = main.nbrJeton;
        this.scene = main.scene;


    }


    stepByStep(x, z) {
        this.main.createStep(20, 20, x, 7, z, true);
        this.main.createStep(10, 10, x + 23, 14, z, true);
        this.main.createStep(5, 5, x + 38, 21, z, true);
        this.main.createStep(10, 10, x + 53, 14, z, true);
        this.main.createStep(20, 20, x + 73, 7, z, true);
        this.main.createJeton(this.nbrJeton, x + 38, 24, z);
        this.nbrJeton -= 1;


    }

    poutre(x, z) {

        this.main.createStep(20, 20, x, 7, z, true);
        this.main.createStep(10, 10, x + 23, 14, z, true);
        this.main.createStep(10, 10, x + 83, 14, z, true);
        this.main.createStep(20, 20, x + 103, 7, z, true);

        const poutre = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 50, diameterTop: 1, diameterBottom: 1});
        poutre.physicsImpostor = new BABYLON.PhysicsImpostor(poutre, BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0
        }, this.scene);

        poutre.position = new BABYLON.Vector3(x + 53, 14, z);
        poutre.rotate(BABYLON.Axis.Z, 1.57);
        poutre.checkCollisions = true;

        this.main.createJeton(this.nbrJeton, poutre.position.x, poutre.position.y + 5, poutre.position.z);
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
        this.main.createStep(12, 12, x, y, z, true);
        let socle = this.main.createStep(12, 12, x + 40, y + 6, z + 20, true);
        this.main.createStep(12, 12, x + 100, y, z, true);
        cercle.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 5, socle.position.z);
        trait2.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 4.5, socle.position.z - 5.7);
        trait1.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 4.5, socle.position.z - 5);
        barre.position = new BABYLON.Vector3(socle.position.x, socle.position.y + 5, socle.position.z - 4);

        cercle.particles = new BABYLON.ParticleHelper.CreateDefault(new BABYLON.Vector3(x + 40, y + 14, z + 20));
        cercle.particles.minSize = 0.25;
        cercle.particles.maxSize = 0.55

        cercle.particles.minLifeTime = 20;
        cercle.particles.maxLifeTime = 30;

        cercle.particles.start();


        cercle.addChild(barre);
        barre.addChild(trait1);
        barre.addChild(trait2);

        this.scene.jetons[this.main.nbrJeton] = cercle;
        this.nbrJeton -= 1;
        this.main.key = cercle;
        cercle.physicsImpostor = new BABYLON.PhysicsImpostor(cercle, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: 0,
            restitution: 0
        }, this.scene);
        return cercle;

    }

    coffreFort(x, y, z) {
        //TODO faire un beau coffre
        let cote1 = this.main.createStep(20, 20, x + 10, y + 10, z + 10, false);
        this.main.faille = this.main.createStep(20, 20, x - 10, y + 10, z + 10, false);
        let cote2 = this.main.createStep(22, 20, x, y + 10, z, false);
        let cote3 = this.main.createStep(22, 20, x, y + 10, z + 20, false);
        let toit = this.main.createStep(22, 22, x, y + 20, z + 10, false);

        cote1.rotate(BABYLON.Axis.Z, 1.57);
        this.main.faille.rotate(BABYLON.Axis.Z, 1.57);
        //faille.material.diffuseTexture = new BABYLON.Texture("images/coffre.jpg");

        cote3.rotate(BABYLON.Axis.Z, 1.57);
        cote3.rotate(BABYLON.Axis.X, 1.57);

        cote2.rotate(BABYLON.Axis.Z, 1.57);
        cote2.rotate(BABYLON.Axis.X, 1.57);

        cote1.material.emissiveColor = new BABYLON.Color3.Gray();
        cote2.material.emissiveColor = new BABYLON.Color3.Gray();
        cote3.material.emissiveColor = new BABYLON.Color3.Gray();
        toit.material.emissiveColor = new BABYLON.Color3.Gray();

        this.main.createJeton(this.nbrJeton, x, y + 7, z + 10);
        this.nbrJeton -= 1;


        // panneau
        this.main.createPanneau(toit, 0, 10, 0, "Find \nthe key", "You have to find the key for open the bunker")
        return this.main.faille;

    }


    createInvisibleHouse(x, y, z) {
        let cote1 = this.main.createStep(20, 20, x + 10, y + 10, z, false);
        let coteB = this.main.createStep(10, 20, x - 10, y + 5, z, false);
        let cote2 = this.main.createStep(22, 20, x, y + 10, z - 10, false);
        let cote3 = this.main.createStep(22, 20, x, y + 10, z + 10, false);
        let toit = this.main.createStep(22, 22, x, y + 20, z, false);

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
        let jeton = this.main.createJeton(this.nbrJeton, x, y + 2, z);
        this.nbrJeton -= 1;
        this.main.boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: jeton
            },
            () => {
                if(jeton.physicsImpostor){
                    jeton.physicsImpostor.dispose();
                    jeton.dispose();
                    this.nbrJetonToGenerate -= 1;
                    var music = new BABYLON.Sound("Violons", "sounds/coin.wav", this.scene, null, {
                        loop: false,
                        autoplay: true
                    });
                }

            }
        ));


        this.main.createPanneau(toit, 0, 10, 0, "Invisible\n House", "there is a breach in the house where you can pass and get the token")
    }

}