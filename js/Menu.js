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
        let menu = this;

        button1.onPointerUpObservable.add(function() {
            obj.nbrJetonToGenerate = menu.welcome ? 0 : obj.nbrJetonToGenerate;
            advancedTexture.dispose();
            obj.canMove = menu.welcome;
            obj.turn = true;
        });
        return button1;
    }

    genButtonHelp(btnStart,advancedTexture,myText){
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
            myText.dispose();
            main.genTextHelp(advancedTexture,myText);
        });
        return button1;
    }
    genTextHelp(advancedTexture,text){
        let myText =  new BABYLON.GUI.TextBlock();
        myText.text = "Overcome all obstacles to find your double\n and beat him to become unique";

        myText.fontSize = "3%";
        myText.top = "-18%";
        myText.color = "black";
        myText.fontWeight = "bold";
        let textblock = new BABYLON.GUI.TextBlock();
        textblock.text = "to move\n\n\n" +
            "to jump\n\n\n" +
            "Grab all the blue tokens of a level to go to the next one";
        textblock.fontSize = "3%";

        textblock.color = "black";
        textblock.fontWeight = "bold";
        textblock.cornerRadius = 20;

        let zqsdKey = new BABYLON.GUI.Image("name", "images/keyzqsd.png");
        zqsdKey.width = "10%";
        zqsdKey.height = "10%";
        zqsdKey.top = "-10%";
        zqsdKey.left = "-9%";

        let spacebarKey = new BABYLON.GUI.Image("name", "images/spacebar.png");
        spacebarKey.width = "7%";
        spacebarKey.height = "5%";
        spacebarKey.left = "-9%";



        let button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "RETURN");
        button1.fontSize = "2%";
        button1.top = "17%";
        button1.width = "10%";
        button1.height = "5%";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "rgba(0, 0, 0, 0.5)";
        let main = this;
        button1.onPointerUpObservable.add(function() {
            button1.dispose();
            textblock.dispose();
            spacebarKey.dispose();
            zqsdKey.dispose();
            myText.dispose();
            advancedTexture.addControl(text);
            let buttonStart = main.genButtonStart(advancedTexture);
            advancedTexture.addControl(buttonStart);
            advancedTexture.addControl(main.genButtonHelp(buttonStart,advancedTexture,text));
        });
        advancedTexture.addControl(myText);
        advancedTexture.addControl(textblock);
        advancedTexture.addControl(spacebarKey);
        advancedTexture.addControl(zqsdKey);
        advancedTexture.addControl(button1)
    }
    menuMain(i,img){
        this.main.canMove = false;
        this.main.turn=false;
        this.welcome = i === undefined;
        // GUI
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let myText =  new BABYLON.GUI.TextBlock();
        let button1 = this.genButtonStart(advancedTexture);
        let buttonHlp = this.genButtonHelp(button1,advancedTexture,myText);



        let rectangle = img ? new BABYLON.GUI.Image("name",img) : new BABYLON.GUI.Image("name", "images/background.jpg");
        rectangle.width = "45%";
        rectangle.height = "50%";
        rectangle.cornerRadius = 20;


        myText.text = i ? "Level "+i : "Catch and Become Unique";

        myText.fontSize = "5%";
        myText.top = "-20%";
        myText.color = "black";
        myText.fontWeight = "bold";

        advancedTexture.addControl(rectangle);
        advancedTexture.addControl(myText);

        advancedTexture.addControl(buttonHlp);
        advancedTexture.addControl(button1);

    }
}