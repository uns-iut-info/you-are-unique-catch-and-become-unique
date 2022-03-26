import Main from "./Main.js";

export default class Obstacles extends Main {
    faille;
    constructor(scene, nbrJeton) {
        super(scene);
        this.nbrJeton=nbrJeton



    }


    stepByStep(x, z) {
        this.createStep(20, 20, x, 7, z);
        this.createStep(10, 10, x + 23, 14, z);
        this.createStep(5, 5, x + 38, 21, z);
        this.createStep(10, 10, x + 53, 14, z);
        this.createStep(20, 20, x + 73, 7, z);
        this.scene.jetons[this.nbrJeton] = this.createJeton(this.nbrJeton, x + 38, 24, z);
        this.nbrJeton -= 1;
        return this.nbrJeton;

    }
    poutre(x, z) {

        this.createStep(20, 20, x, 7, z);
        this.createStep(10, 10, x + 23, 14, z);
        this.createStep(10, 10, x + 83, 14, z);
        this.createStep(20, 20, x + 103, 7, z);

        const poutre = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 50, diameterTop: 1, diameterBottom: 1});
        poutre.physicsImpostor = new BABYLON.PhysicsImpostor(poutre, BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0,
            restitution: 0
        }, this.scene);

        poutre.position = new BABYLON.Vector3(x + 53, 14, z);
        poutre.rotate(BABYLON.Axis.Z, 1.57);
        poutre.checkCollisions = true;

        this.scene.jetons[this.nbrJeton] = this.createJeton(this.nbrJeton, poutre.position.x, poutre.position.y + 5, poutre.position.z);
        this.nbrJeton -= 1;
        return this.nbrJeton;

    }














}