export default class GeneratorToken{
    constructor(main) {
        this.main=main;
        this.scene=main.scene;
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
        this.main.nbrJeton = i - 1;
        this.main.allObstacles[this.main.ind++] = jeton;
        return jeton;

    }


    generateJetons(xMax, xMin, zMax, zMin) { //genere des jetons a des endroits aleatoire

        for (let i = 0; i < this.main.nbrJetonToGenerate; i++) {
            let xrand = Math.floor(Math.random() * xMax - xMin);
            let zrand = Math.floor(Math.random() * zMax - zMin);
            this.createJeton(i, xrand, 7, zrand);
        }
        return this.main.key;

    }
}