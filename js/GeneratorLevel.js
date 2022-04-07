export default class GeneratorLevel{
    main;
    obstacle;
    createNewLevel=true;
    constructor(obstacle,main) {
        this.main=main;
        this.obstacle = obstacle;
        this.scene = main.scene;
        this.nbrJeton = main.nbrJeton;
    }

    generateLevel() {
        if (this.main.nbrJetonToGenerate === 0) {
            this.deleteLevel();
            this.main.level += 1;
            this.createNewLevel = true;
        }
        switch (this.main.level % 5) {
            case 0: {
                if (this.createNewLevel) {
                    this.createLevel1();
                    this.main.collision();
                    this.createNewLevel = false;
                }
                break;
            }
            case 1: {
                if (this.createNewLevel) {
                    this.createLevel2();
                    this.main.collision();
                    this.createNewLevel = false;
                }
                break;
            }
            case 2: {
                if (this.createNewLevel) {
                    this.createLevel3();
                    this.main.collision();
                    this.createNewLevel = false;
                }
                this.main.key.rotate(BABYLON.Axis.Z, 0.02);
                break;
            }
            case 3: {
                if (this.createNewLevel) {
                    this.createLevel4();
                    this.main.collision();
                    this.createNewLevel = false;
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
                }
                break;
            }
        }
    }


    createLevel1(){
        this.main.createStep(100, 100, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z,true);
        this.main.generateJetons( (this.main.respawn.x+99), (this.main.respawn.x+49),(this.main.respawn.z+99),(this.main.respawn.z+49));
    }

    createLevel2(){
        this.main.createStep(20, 20, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false)
        this.main.createStep(17, 17, this.main.respawn.x+30, this.main.respawn.y - 5, this.main.respawn.z, true)
        this.main.createStep(15, 15, this.main.respawn.x+60, this.main.respawn.y - 5, this.main.respawn.z, true)
        this.main.createStep(12, 12, this.main.respawn.x+90, this.main.respawn.y - 5, this.main.respawn.z, true)
        this.main.createStep(100, 5, this.main.respawn.x+165, this.main.respawn.y-5, this.main.respawn.z,true);
        this.main.createStep(10, 10, this.main.respawn.x+240, this.main.respawn.y - 5, this.main.respawn.z, true)

        this.main.createJeton(this.nbrJeton,this.main.respawn.x+30,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+60,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+90,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+165,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+240,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;


    }

    createLevel3() {
        this.main.nbrJetonToGenerate = 4;
        this.main.createStep(10, 10, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false)
        this.obstacle.stepByStep(30, 0);
        this.obstacle.poutre(140, 0);
        this.main.createStep(100, 5, 320, 10, -10);
        this.main.createStep(100, 100, 435, 10, 0);
        this.obstacle.coffreFort(469, 12, 20);
        this.obstacle.createKey(277, 8, 10);

    }
    createLevel4() {
        this.main.createStep(10, 10, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false);

        this.main.createStep(100, 5, this.main.respawn.x+75, this.main.respawn.y-5, this.main.respawn.z,true);

        let stepD=this.main.createStep(23, 7, this.main.respawn.x+125, this.main.respawn.y-5, this.main.respawn.z-9,true);
        stepD.rotate(BABYLON.Axis.Y, 1.57);

        this.main.createJeton(this.nbrJeton,this.main.respawn.x+125,this.main.respawn.y-2,this.main.respawn.z);
        this.nbrJeton-=1;

        this.main.createStep(100, 5, this.main.respawn.x+175, this.main.respawn.y-5, this.main.respawn.z-18,true);
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+225,this.main.respawn.y-2,this.main.respawn.z-17);
        this.nbrJeton-=1;

        let stepG = this.main.createStep(200, 5, this.main.respawn.x+228, this.main.respawn.y-5, this.main.respawn.z-10,true);
        stepG.rotate(BABYLON.Axis.Y, 1.57);
        this.main.createStep(100, 5, this.main.respawn.x+235, this.main.respawn.y-5.1, this.main.respawn.z-50,true);
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+284,this.main.respawn.y-2,this.main.respawn.z-50);
        this.nbrJeton-=1;
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+186,this.main.respawn.y-2,this.main.respawn.z-50);
        this.nbrJeton-=1;
        this.main.createStep(100, 5, this.main.respawn.x+280, this.main.respawn.y-5.1, this.main.respawn.z+87.5,true);
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+330,this.main.respawn.y-2,this.main.respawn.z+87.5);
        this.nbrJeton-=1;


    }

    createLevel5(){
        this.main.nbrJetonToGenerate = 1;
        this.main.createStep(10, 10, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false);
        this.main.createStep(100, 100, 195, 30, 0, true);
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
        this.main.boule.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, 0, 0));
        this.main.boule.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        this.main.nbrJeton = 5;
        this.main.nbrJetonToGenerate = 5;
        this.nbrJeton = 5;
        this.main.allObstacles=[];
        this.main.boule.position = new BABYLON.Vector3(this.main.respawn.x, this.main.respawn.y, this.main.respawn.z)

    }

}