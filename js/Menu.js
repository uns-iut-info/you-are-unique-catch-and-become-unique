export default class Menu{
    constructor(main,obstacle) {
        this.main = main;
        this.obstacle=obstacle;
        this.main.canMove=true;
    }


    genButtonStart(advancedTexture){
        let button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "START GAME");
        button1.fontSize = "5%";
        button1.top = "-8%";
        button1.width = "30%";
        button1.height = "10%";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "rgba(0, 0, 0, 0.5)";
        let obj = this.main;
        button1.onPointerUpObservable.add(function() {
            obj.nbrJetonToGenerate = 0;
            advancedTexture.dispose();
            obj.canMove = true;
        });
        return button1;
    }

    genButtonHelp(btnStart,advancedTexture){
        let button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "HELP");
        button1.fontSize = "5%";
        button1.top = "8%";
        button1.width = "30%";
        button1.height = "10%";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "rgba(0, 0, 0, 0.5)";
        let main = this;
        button1.onPointerUpObservable.add(function() {
            button1.dispose();
            btnStart.dispose();
            main.genTextHelp(advancedTexture);
        });
        return button1;
    }
    genTextHelp(advancedTexture){
        let textblock = new BABYLON.GUI.TextBlock();
        textblock.text = "ZQSD to move\n" +
            "SPACEBAR to jump\n" +
            "Grab all the blue tokens of a level to go to the next one";
        textblock.fontSize = "3%";
        textblock.top = "0";
        textblock.color = "white";
        textblock.cornerRadius = 20;

        let button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "RETURN");
        button1.fontSize = "2%";
        button1.top = "10%";
        button1.left = "-10%";
        button1.width = "10%";
        button1.height = "5%";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "rgba(0, 0, 0, 0.5)";
        let main = this;
        button1.onPointerUpObservable.add(function() {
            button1.dispose();
            textblock.dispose();
            let buttonStart = main.genButtonStart(advancedTexture);
            advancedTexture.addControl(buttonStart);
            advancedTexture.addControl(main.genButtonHelp(buttonStart,advancedTexture));
        });

        advancedTexture.addControl(textblock);
        advancedTexture.addControl(button1)
    }
    menuLevel(){
        this.obstacle.createStep(100, 100, this.main.respawn.x, this.main.respawn.y - 5, this.main.respawn.z,true);
        // GUI
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.main.nbrJetonToGenerate = 5;
        let button1 = this.genButtonStart(advancedTexture);
        let buttonHlp = this.genButtonHelp(button1,advancedTexture);



        var rectangle = new BABYLON.GUI.Rectangle("rect");
        rectangle.background = "black";
        rectangle.color = "yellow";
        rectangle.width = "40%";
        rectangle.height = "40%";
        rectangle.cornerRadius = 20;

        advancedTexture.addControl(rectangle);
        advancedTexture.addControl(buttonHlp);
        advancedTexture.addControl(button1);

    }
}