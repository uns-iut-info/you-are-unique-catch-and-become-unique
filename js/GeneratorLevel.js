export default class GeneratorLevel{
    main;
    obstacle;
    constructor(obstacle,main) {
        this.main=main;
        this.obstacle = obstacle;
        this.scene = main.scene;
        this.nbrJeton = main.nbrJeton;
    }


    createLevel1(){
        this.main.createStep(100, 100, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z,true);
        this.main.generateJetons( (this.main.respawn.x+99), (this.main.respawn.x+49),(this.main.respawn.z+99),(this.main.respawn.z+49));
    }

    createLevel2(){
        this.main.createStep(20, 20, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false)
        this.main.createStep(17, 17, this.main.respawn.x+40, this.main.respawn.y - 5, this.main.respawn.z, true)
        this.main.createStep(15, 15, this.main.respawn.x+80, this.main.respawn.y - 5, this.main.respawn.z, true)
        this.main.createStep(12, 12, this.main.respawn.x+120, this.main.respawn.y - 5, this.main.respawn.z, true)
        this.main.createStep(100, 5, this.main.respawn.x+200, this.main.respawn.y-5, this.main.respawn.z,true);
        this.main.createStep(10, 10, this.main.respawn.x+290, this.main.respawn.y - 5, this.main.respawn.z, true)

        this.main.createJeton(this.nbrJeton,this.main.respawn.x+40,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+80,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+120,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+200,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+290,this.main.respawn.y - 2,this.main.respawn.z);
        this.nbrJeton-=1;


    }

    createLevel3() {
        this.main.nbrJetonToGenerate = 4;
        this.main.createStep(10, 10, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false)
        this.obstacle.stepByStep(40, 0);
        this.obstacle.poutre(150, 0);
        this.main.createStep(100, 5, 320, 10, -10);
        this.main.createStep(100, 100, 470, 10, 0);
        this.obstacle.coffreFort(505, 12, 20);
        this.obstacle.createKey(290, 8, 10);

    }
    createLevel4() {
        this.main.createStep(10, 10, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z, false);

        this.main.createStep(100, 5, this.main.respawn.x+80, this.main.respawn.y-5, this.main.respawn.z,true);

        let stepD=this.main.createStep(23, 7, this.main.respawn.x+130, this.main.respawn.y-5, this.main.respawn.z-9,true);
        stepD.rotate(BABYLON.Axis.Y, 1.57);

        this.main.createJeton(this.nbrJeton,this.main.respawn.x+130,this.main.respawn.y-2,this.main.respawn.z);
        this.nbrJeton-=1;

        this.main.createStep(100, 5, this.main.respawn.x+180, this.main.respawn.y-5, this.main.respawn.z-18,true);
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+230,this.main.respawn.y-2,this.main.respawn.z-17);
        this.nbrJeton-=1;

        let stepG = this.main.createStep(200, 5, this.main.respawn.x+233, this.main.respawn.y-5, this.main.respawn.z-10,true);
        stepG.rotate(BABYLON.Axis.Y, 1.57);
        this.main.createStep(100, 5, this.main.respawn.x+240, this.main.respawn.y-5.1, this.main.respawn.z-50,true);
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+289,this.main.respawn.y-2,this.main.respawn.z-50);
        this.nbrJeton-=1;
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+191,this.main.respawn.y-2,this.main.respawn.z-50);
        this.nbrJeton-=1;
        this.main.createStep(100, 5, this.main.respawn.x+285, this.main.respawn.y-5.1, this.main.respawn.z+87.5,true);
        this.main.createJeton(this.nbrJeton,this.main.respawn.x+335,this.main.respawn.y-2,this.main.respawn.z+87.5);
        this.nbrJeton-=1;


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