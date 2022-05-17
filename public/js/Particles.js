export default class Particles{
    constructor(scene) {
        this.scene=scene;

    }

    createParticlesForKey(x,y,z){
        let particles = new BABYLON.ParticleHelper.CreateDefault(new BABYLON.Vector3(x, y, z));
        particles.minSize = 0.25;
        particles.maxSize = 0.55

        particles.minLifeTime = 20;
        particles.maxLifeTime = 30;

        particles.start();
        return particles
    }

    createParticlesForJeton(x,y,z){
        let particles = new BABYLON.ParticleHelper.CreateDefault(new BABYLON.Vector3(x, y , z));
        particles.minSize = 0.25;
        particles.maxSize = 0.55

        particles.minLifeTime = 1;
        particles.maxLifeTime = 10;
        particles.updateSpeed = 0.9115;
        particles.start();
        return particles;
    }

    createParticlesCircle(x,y,z,inverseGravity){
        var particleSystem = new BABYLON.ParticleSystem("spawnParticles", 3600, this.scene);    // 3600 particles to have a continue effect when computing circle positions
        particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", this.scene);
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        particleSystem.emitter = new BABYLON.Vector3(x, y, z);
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;
        particleSystem.emitRate = 1000;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;     // to manage alpha
        particleSystem.minEmitPower = inverseGravity ? -5 : 5;
        particleSystem.maxEmitPower = inverseGravity ? -50 : 50;

        var radius = 1.5;

        // Custom function to get the circle effect
        particleSystem.startPositionFunction = function(worldMatrix, positionToUpdate)
        {
            var rndAngle = 2 * Math.random() * Math.PI;
            var randX = radius * Math.sin(rndAngle);
            var randY = this.minEmitBox.y;
            var randZ = radius * Math.cos(rndAngle);

            BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
        }
        particleSystem.start();
        return particleSystem;
    }


}