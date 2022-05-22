import Menu from "./Menu.js";

export default class Genie {

    constructor(main) {
        this.main = main;
        this.scene = main.scene;
    }

    createGenie(x, y, z) {
        let boule = new BABYLON.MeshBuilder.CreateSphere("life", {diameter: 4}, this.scene);

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(boule);

        boule.position = new BABYLON.Vector3(x, y, z);
        boule.material = new BABYLON.StandardMaterial("genie-material", this.scene);
        boule.material.emissiveColor = new BABYLON.Color3.White();
        boule.material.specularColor = new BABYLON.Color3(0.5, 0, 0.5);
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "");
        var obj = this;
        var main = this.main
        button1.onPointerUpObservable.add(function () {
            if (main.canMove === true) {
                obj.createPanneauForGenie();
            }
        });
        advancedTexture.addControl(button1);
        let torus = BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.25, diameter: 3});
        torus.position = new BABYLON.Vector3(x, y + 2, z);
        torus.material = new BABYLON.StandardMaterial("genie-material", this.scene);
        torus.material.emissiveColor = new BABYLON.Color3.Blue();
        torus.material.specularColor = new BABYLON.Color3(0.5, 0, 0.5);

        this.main.allObstacles[this.main.ind++] = boule;
        this.main.allObstacles[this.main.ind++] = torus;
        this.boule = boule;
        this.main.boss = boule;
    }

    createPanneauForGenie() {
        this.main.canMove=false;
        this.panneau = true;
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.main.nbrJetonToGenerate = 5;
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Life");
        button1.fontSize = "5%";
        button1.width = "10%";
        button1.height = "10%";
        button1.color = "white";
        button1.left = 200;
        button1.cornerRadius = 20;
        button1.background = "rgba(0, 0, 0, 0.5)";

        var button2 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Punch");
        button2.fontSize = "5%";
        button2.width = "10%";
        button2.height = "10%";
        button2.color = "white";
        button2.left = -200;
        button2.cornerRadius = 20;
        button2.background = "rgba(0, 0, 0, 0.5)";
        var obj = this.main
        let menu = this.main.generatorMenu;


        button1.onPointerUpObservable.add(function () {
            this.main.canMove=true;
            obj.nbrJetonToGenerate = 0;
            obj.nbrLife += 1;
            obj.printer.printLife();

            advancedTexture.dispose();

        });
        button2.onPointerUpObservable.add(function () {
            obj.canPush =true;
            menu.genPushBonus()
            advancedTexture.dispose();

        });
        advancedTexture.addControl(button1);
        advancedTexture.addControl(button2);

    }
}



