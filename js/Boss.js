export default class Boss{
    constructor(main) {
        this.main=main;
        this.scene=main.scene;
    }

    createBoss(){
        let boule = new BABYLON.MeshBuilder.CreateSphere("heroboule", {diameter: 10}, this.scene);
        boule.applyGravity = true;
        boule.position = new BABYLON.Vector3(this.main.respawn.x, this.main.respawn.y, this.main.respawn.z);
        boule.checkCollisions = true;
        boule.speed=2;
        boule.applyGravity = true;
        boule.material = new BABYLON.StandardMaterial("s-mat", this.scene);
        boule.material.diffuseTexture = new BABYLON.Texture("images/lightning.jpg", this.scene);
        boule.material.emissiveColor = new BABYLON.Color3.Red;
        boule.material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boule.material.diffuseTexture.uScale *= 4;
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, this.main.light);
        shadowGenerator.addShadowCaster(boule);
        shadowGenerator.useExponentialShadowMap = true;
        var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, this.main.light);
        shadowGenerator2.addShadowCaster(boule);
        shadowGenerator2.usePoissonSampling = true;
        shadowGenerator.getShadowMap().renderList.push(boule);

        boule.physicsImpostor = new BABYLON.PhysicsImpostor(boule, BABYLON.PhysicsImpostor.SphereImpostor, {
            mass: 3,
            restitution: 0,
            friction: 0.0
        }, this.scene);
        boule.physicsImpostor.physicsBody.linearDamping = .8;
        boule.physicsImpostor.physicsBody.angularDamping = .8;
        this.boule=boule;
        this.boule.position = new BABYLON.Vector3(this.main.respawn.x+47, this.main.respawn.y, this.main.respawn.z);
        this.main.allObstacles[this.main.ind++] = boule;
        return this.boule;

    }

    detectWin(){
        if (!this.boule.actionManager)this.boule.actionManager = new BABYLON.ActionManager(this.scene);
        this.boule.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: this.main.ground
            },
            () => {

                this.main.nbrJetonToGenerate = 0;
                this.boule.physicsImpostor.dispose();
                this.boule.dispose();
            }));


    }
    attaqueZ(b1,b2){
        let velocityLin = b2.physicsImpostor.getLinearVelocity();
        let angularVel = b2.physicsImpostor.getAngularVelocity();
        if (b2.position.z >= b1.position.z && b2.position.z>=-40) {
            b2.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(angularVel.x-b2.speed+b2.speed/1.5, 0, 0, 0));
            b2.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x, velocityLin.y, velocityLin.z - b2.speed));
        }
        if (b2.position.z < b1.position.z && b2.position.z<=40) {
            b2.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(angularVel.x+b2.speed-b2.speed/1.5, 0, 0, 0));
            b2.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x, velocityLin.y, velocityLin.z + b2.speed));
        }
    }

    attaqueX(b1,b2){
        let velocityLin = b2.physicsImpostor.getLinearVelocity();
        let angularVel = b2.physicsImpostor.getAngularVelocity();
        if (b2.position.x >= b1.position.x && b2.position.x>=-43) {
            b2.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0,angularVel.z+b2.speed-b2.speed/1.5, 0));
            b2.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x - b2.speed, velocityLin.y, velocityLin.z));
        }
        if (b2.position.x < b1.position.x && b2.position.x<=43) {
            b2.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0, 0, angularVel.z-b2.speed+b2.speed/1.5, 0));
            b2.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(velocityLin.x + b2.speed, velocityLin.y, velocityLin.z));
        }
    }

    attaque(b1,b2) {
        if (this.main.canMove) {
            this.attaqueX(b1, b2);
            this.attaqueZ(b1, b2);
        }
    }
}