import Affichage from "./Affichage.js";
import GeneratorToken from "./GeneratorToken.js";

export default class GeneratorLevel{
    main;
    obstacle;
    createNewLevel=true;
    access=false;
    poutres=[];
    constructor(obstacle,main) {
        this.main=main;
        this.obstacle = obstacle;
        this.scene = main.scene;
        this.nbrJeton = main.nbrJeton;
        this.printer = new Affichage(main);
        this.generatorToken = new GeneratorToken(main);
    }


    generateLevel() {
        this.main.allJeton=5;
        if (this.main.nbrJetonToGenerate === 0) {
            this.deleteLevel();
            this.main.level += 1;
            this.createNewLevel = true;
        }
        switch (this.main.level % 6) {
            case 0: {
                if (this.createNewLevel) {
                    this.createLevel1();
                    this.main.collision();
                    this.createNewLevel = false;
                    if(this.access)this.main.affichage.dispose();
                    this.printer.printNumberOfJeton();
                }
                break;
            }
            case 1: {
                if (this.createNewLevel) {
                    this.createLevel2();
                    this.main.collision();
                    this.createNewLevel = false;
                    this.main.affichage.dispose();
                    this.printer.printNumberOfJeton();
                }
                break;
            }
            case 2: {
                if (this.createNewLevel) {
                    this.createLevel3();
                    this.main.collision();
                    this.createNewLevel = false;
                    this.main.affichage.dispose();
                    this.printer.printNumberOfJeton();
                }
                this.main.key.rotate(BABYLON.Axis.Z, 0.02);
                break;
            }
            case 3: {
                if (this.createNewLevel) {
                    this.createLevel4();
                    this.main.collision();
                    this.createNewLevel = false;
                    this.main.affichage.dispose();
                    this.printer.printNumberOfJeton();
                }
                break;
            }
            case 4: {
                if (this.createNewLevel) {
                    this.createLevel5();
                    this.main.collision();
                    this.obstacle.floorIsLava(this.main.respawn.x+10, 0, 0);
                    this.obstacle.createInvisibleHouse(210, 32, 0);
                    this.createNewLevel = false;
                    this.main.affichage.dispose();
                    this.printer.printNumberOfJeton();
                }
                break;
            }
            case 5: {
                if (this.createNewLevel) {
                    this.main.floor=false;
                    this.createLevel6();
                    this.main.collision();
                    this.createNewLevel = false;
                    this.main.affichage.dispose();
                    this.printer.printNumberOfJeton();
                    this.access=true;
                }
                for (let i = 0; i < this.poutres.length; i++) {
                    this.poutres[i].rotate(BABYLON.Axis.Y, 0.02);
                }
                break;
            }
        }
    }


    createLevel1(){
        this.obstacle.createStep(100, 100, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z,true);
        this.generatorToken.generateJetons( (this.main.respawn.x+99), (this.main.respawn.x+49),(this.main.respawn.z+99),(this.main.respawn.z+49));
    }

    createLevel2(){
        this.obstacle.createStep(20, 20, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false)
        this.obstacle.createStep(17, 17, this.main.respawn.x+30, this.main.respawn.y - 5, this.main.respawn.z, true)
        this.obstacle.createStep(15, 15, this.main.respawn.x+60, this.main.respawn.y - 5, this.main.respawn.z, true)
        this.obstacle.createStep(12, 12, this.main.respawn.x+90, this.main.respawn.y - 5, this.main.respawn.z, true)
        this.obstacle.createStep(100, 5, this.main.respawn.x+165, this.main.respawn.y-5, this.main.respawn.z,true);
        this.obstacle.createStep(10, 10, this.main.respawn.x+240, this.main.respawn.y - 5, this.main.respawn.z, true)

        this.generatorToken.createJeton(this.nbrJeton,this.main.respawn.x+30,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.generatorToken.createJeton(this.nbrJeton,this.main.respawn.x+60,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.generatorToken.createJeton(this.nbrJeton,this.main.respawn.x+90,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.generatorToken.createJeton(this.nbrJeton,this.main.respawn.x+165,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.generatorToken.createJeton(this.nbrJeton,this.main.respawn.x+240,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;


    }

    createLevel3() {
        this.main.allJeton=4;
        this.main.nbrJetonToGenerate = 4;
        this.obstacle.createStep(10, 10, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false)
        this.obstacle.stepByStep(30, 0);
        this.obstacle.poutre(140, 0);
        this.obstacle.createStep(100, 5, 320, 10, -10,true);
        this.obstacle.createStep(100, 100, 435, 10, 0);
        this.obstacle.coffreFort(469, 12, 20);
        this.obstacle.createKey(277, 8, 10);

    }
    createLevel4() {

        this.obstacle.createStep(10, 10, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false);

        this.obstacle.createStep(100, 5, this.main.respawn.x+75, this.main.respawn.y-5, this.main.respawn.z,true);

        let stepD=this.obstacle.createStep(23, 7, this.main.respawn.x+125, this.main.respawn.y-5, this.main.respawn.z-9,true);
        stepD.rotate(BABYLON.Axis.Y, 1.57);

        this.generatorToken.createJeton(this.nbrJeton,this.main.respawn.x+125,this.main.respawn.y-2,this.main.respawn.z);
        this.nbrJeton-=1;

        this.obstacle.createStep(100, 5, this.main.respawn.x+175, this.main.respawn.y-5, this.main.respawn.z-18,true);
        this.generatorToken.createJeton(this.nbrJeton,this.main.respawn.x+225,this.main.respawn.y-2,this.main.respawn.z-17);
        this.nbrJeton-=1;

        let stepG = this.obstacle.createStep(200, 5, this.main.respawn.x+228, this.main.respawn.y-5, this.main.respawn.z-10,true);
        stepG.rotate(BABYLON.Axis.Y, 1.57);
        this.obstacle.createStep(100, 5, this.main.respawn.x+235, this.main.respawn.y-5.1, this.main.respawn.z-50,true);
        this.generatorToken.createJeton(this.nbrJeton,this.main.respawn.x+284,this.main.respawn.y-2,this.main.respawn.z-50);
        this.nbrJeton-=1;
        this.generatorToken.createJeton(this.nbrJeton,this.main.respawn.x+186,this.main.respawn.y-2,this.main.respawn.z-50);
        this.nbrJeton-=1;
        this.obstacle.createStep(100, 5, this.main.respawn.x+280, this.main.respawn.y-5.1, this.main.respawn.z+87.5,true);
        this.generatorToken.createJeton(this.nbrJeton,this.main.respawn.x+330,this.main.respawn.y-2,this.main.respawn.z+87.5);
        this.nbrJeton-=1;


    }

    createLevel5(){
        this.main.allJeton=1;
        this.main.nbrJetonToGenerate = 1;
        this.obstacle.createStep(10, 10, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false);
        this.obstacle.createStep(100, 100, 195, 30, 0, true);
    }

    createLevel6(){
        this.obstacle.createStep(10, 10, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false);
        this.poutres[0] = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 80, diameterTop: 50, diameterBottom: 50});
        this.poutres[0].physicsImpostor = new BABYLON.PhysicsImpostor(this.poutres[0], BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0,
            friction : 1,
        }, this.scene);
        this.poutres[0].position=new BABYLON.Vector3(60,-20,0);
        this.poutres[0].rotate(BABYLON.Axis.Z, 1.57);
        this.poutres[0].material = new BABYLON.StandardMaterial("poutre1", this.scene);
        this.poutres[0].material.diffuseTexture = new BABYLON.Texture("images/fleches.png");


        this.poutres[1] = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 80, diameterTop: 50, diameterBottom: 50});
        this.poutres[1].physicsImpostor = new BABYLON.PhysicsImpostor(this.poutres[1], BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0,
            friction : 1,
        }, this.scene);
        this.poutres[1].position=new BABYLON.Vector3(140,-20,0);
        this.poutres[1].rotate(BABYLON.Axis.Z, 1.57);
        this.poutres[1].rotate(BABYLON.Axis.X, 3.14);
        this.poutres[1].material = new BABYLON.StandardMaterial("poutre2", this.scene);
        this.poutres[1].material.diffuseTexture = new BABYLON.Texture("images/fleches.png");

        this.poutres[2] = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 80, diameterTop: 50, diameterBottom: 50});
        this.poutres[2].physicsImpostor = new BABYLON.PhysicsImpostor(this.poutres[2], BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0,
            friction : 1,
        }, this.scene);
        this.poutres[2].position=new BABYLON.Vector3(220,-20,0);
        this.poutres[2].rotate(BABYLON.Axis.Z, 1.57);
        this.poutres[2].material = new BABYLON.StandardMaterial("poutre3", this.scene);
        this.poutres[2].material.diffuseTexture = new BABYLON.Texture("images/fleches.png");
        var acc=0;
        for (let i = 1; i < 5; i++) {
            acc+=50;
            this.generatorToken.createJeton(this.nbrJeton,this.main.respawn.x+acc,this.main.respawn.y,this.main.respawn.z);
            this.nbrJeton-=1;

        }
        this.obstacle.createStep(10, 10, 290, this.main.respawn.y-5, this.main.respawn.z, false);
        this.generatorToken.createJeton(this.nbrJeton,300,this.main.respawn.y-3,this.main.respawn.z);
        this.nbrJeton-=1;

        for (let i = 0; i < this.poutres.length; i++) {
            this.main.allObstacles[this.main.ind++] = this.poutres[i];
        }



    }



    deleteLevel() {
        this.main.allObstacles.forEach(obstacle => {
            if (obstacle.physicsImpostor) {
                obstacle.physicsImpostor.dispose();
            }
            obstacle.dispose();
        });
        for (let i = 0; i < this.scene.jetons.length; i++) {
            delete this.scene.jetons[i];
        }
        for (let i = 0; i < this.main.ind; i++) {
            delete this.main.allObstacles[i];
        }
        this.main.boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, 0, 0));
        this.main.boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        this.main.nbrJeton = 5;
        this.main.nbrJetonToGenerate = 5;
        this.nbrJeton = 5;
        this.obstacle.nbrJeton=5;
        this.main.boule.key=false;
        this.main.boule.position = new BABYLON.Vector3(this.main.respawn.x, this.main.respawn.y, this.main.respawn.z)

    }

}