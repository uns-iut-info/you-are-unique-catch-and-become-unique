import StoryFactory from "./StoryFactory.js"

export default class Menu {


    constructor(main) {
        this.main = main;
        this.main.canMove = true;
        this.hud = []
    }

    clearHud() {
        this.hud.forEach(element => element.dispose());
        this.hud = [];
        if (this.advancedTexture) this.advancedTexture = undefined;
    }

    createText(text) {
        let textblock = new BABYLON.GUI.TextBlock();
        textblock.text = text;
        textblock.fontSize = "3%";
        textblock.outlineColor = "black";
        textblock.outlineWidth = 4;
        textblock.color = "white";
        textblock.fontWeight = "bold";
        textblock.cornerRadius = 20;
        this.hud.push(textblock);
        return textblock
    }


    genButtonStart(advancedTexture) {
        this.advancedTexture = advancedTexture;
        let text = this.winOrLoose === true ? "RESTART" : "START GAME";
        let button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", text);
        button1.fontSize = "4%";
        button1.top = "-6%";
        button1.width = "20%";
        button1.left = "-10%"
        button1.height = "10%";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "rgba(0, 0, 0, 0.5)";
        let menu = this;
        this.hud.push(button1);
        button1.onPointerUpObservable.add(function () {
            menu.pressStartButton(advancedTexture);
        });
        return button1;
    }

    pressStartButton(advancedTexture) {
        this.soundClic();
        this.main.nbrJetonToGenerate = (this.welcome || this.winOrLoose) ? 0 : this.main.nbrJetonToGenerate;
        if (this.welcome && this.winOrLoose === false) this.main.initialisation();
        this.hud.push(this.rectangle);
        if (this.main.hasNeverTurn && !this.helper && this.winOrLoose === false) this.main.skip = this.main.generatorLevel.generatorMenu.genTextSkip();
        this.clearHud();
        advancedTexture.dispose();
        if (this.main.hasNeverTurn === false && (this.main.level % this.main.nbrLevel) === 11) {
            var fight = new BABYLON.Sound("fight", "sounds/fight.wav", this.main.scene, null, {
                loop: false,
                autoplay: true
            });
            this.main.printer.printFight();
        }
        this.main.canMove = !this.main.hasNeverTurn || this.helper;
        this.main.turn = this.main.hasNeverTurn && !this.helper;
    }

    genButtonHelp(btnStart, advancedTexture, myText) {
        let button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "HELP");
        button1.fontSize = "4%";
        button1.top = "-6%";
        button1.left = "10%"
        button1.width = "20%";
        button1.height = "10%";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "rgba(0, 0, 0, 0.5)";
        let main = this;
        this.hud.push(button1);
        button1.onPointerUpObservable.add(function () {
            main.soundClic();
            myText.dispose();
            main.clearHud();
            main.genTextHelp(advancedTexture, myText);
        });
        return button1;
    }

    genButtonStory(advancedTexture, myText) {
        let button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "STORY");
        button1.fontSize = "4%";
        button1.top = "5%";
        button1.left = "-10%"
        button1.width = "20%";
        button1.height = "10%";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "rgba(0, 0, 0, 0.5)";
        let main = this;
        this.hud.push(button1);
        button1.onPointerUpObservable.add(function () {
            main.soundClic();
            myText.dispose();
            main.clearHud();
            main.genTextStory(advancedTexture, myText);
        });
        return button1;
    }

    genButtonChooseLevel(advancedTexture, myText) {
        let button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "CHOOSE LEVEL");
        button1.fontSize = "4%";
        button1.top = "5%";
        button1.left = "10%"
        button1.width = "20%";
        button1.height = "10%";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "rgba(0, 0, 0, 0.5)";
        let main = this;
        this.hud.push(button1);
        button1.onPointerUpObservable.add(function () {
            main.soundClic()
            myText.dispose();
            main.clearHud();
            main.genAllLevel();
            main.buttonReturn(myText, 10)
        });

        return button1;
    }

    genTextStory(advancedTexture, text) {
        let myText = new BABYLON.GUI.TextBlock();
        myText.text = StoryFactory(this.level = this.level === undefined ? 0 : this.level)
        myText.outlineColor = "black";
        myText.outlineWidth = 4;
        myText.fontSize = "3%";
        myText.top = "-5%";
        myText.color = "white";
        myText.fontWeight = "bold";
        this.hud.push(myText);
        this.buttonReturn(text)
        advancedTexture.addControl(myText);

    }

    genTextHelp(advancedTexture, text) {
        let myText = new BABYLON.GUI.TextBlock();
        myText.text = "Overcome all obstacles to find your double\n and beat him to become unique";
        myText.outlineColor = "black";
        myText.outlineWidth = 4;
        myText.fontSize = "3%";
        myText.top = "-18%";
        myText.color = "white";
        myText.fontWeight = "bold";
        let or = this.createText("or");
        or.top = "-5%";
        or.left = "-2%";

        let toMove = this.createText("to Move");
        toMove.top = "-5%";
        toMove.left = "15%";

        let toJump = this.createText("to Jump");
        toJump.top = "3%";
        toJump.left = "-1%";

        let p_buttonText = this.createText("to see all the level");
        p_buttonText.top = "10%";
        p_buttonText.left = "2.5%";


        let zqsdKey = new BABYLON.GUI.Image("zqsd", "images/zqsd.png");
        zqsdKey.width = "10%";
        zqsdKey.height = "10%";
        zqsdKey.top = "-8%";
        zqsdKey.left = "-9%";

        let fleche = new BABYLON.GUI.Image("fleche", "images/fleche.png");
        fleche.width = "10%";
        fleche.height = "10%";
        fleche.top = "-8%";
        fleche.left = "5%";

        let spacebarKey = new BABYLON.GUI.Image("space", "images/spacebar.png");
        spacebarKey.width = "7%";
        spacebarKey.height = "5%";
        spacebarKey.left = "-9%";
        spacebarKey.top = "3%";

        let p_button = new BABYLON.GUI.Image("p-button", "images/p-button.png");
        p_button.width = "5%";
        p_button.height = "6%";
        p_button.left = "-9%";
        p_button.top = "10%";

        this.hud.push(myText, p_button, spacebarKey, fleche, zqsdKey, p_buttonText, toJump, toMove, or);
        this.buttonReturn(text)
        advancedTexture.addControl(myText);
        advancedTexture.addControl(or);
        advancedTexture.addControl(toMove);
        advancedTexture.addControl(toJump);
        advancedTexture.addControl(spacebarKey);
        advancedTexture.addControl(zqsdKey);
        advancedTexture.addControl(fleche);
        advancedTexture.addControl(p_buttonText);
        advancedTexture.addControl(p_button)

    }

    menuMain(i, img, helper = false, title = "Catch and Become Unique", winOrLoose = false) {
        this.winOrLoose = winOrLoose
        this.helper = helper
        this.main.canMove = false;
        if (this.winOrLoose === true) this.level = title === "You Win" ? 100 : -100;
        else this.level = i;
        if (this.main.turn) this.main.turn = false;
        this.welcome = (this.level === undefined) && (title === "Catch and Become Unique");
        // GUI
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
        let myText = new BABYLON.GUI.TextBlock();
        let button1 = this.genButtonStart(advancedTexture);
        let buttonHlp = this.genButtonHelp(button1, advancedTexture, myText, helper);
        let buttonStory = this.genButtonStory(advancedTexture, myText);
        let buttonChooseLevel = this.genButtonChooseLevel(advancedTexture, myText)


        let rectangle = img ? new BABYLON.GUI.Image("name", img) : new BABYLON.GUI.Image("name", "images/welcome.jpg");
        rectangle.width = "45%";
        rectangle.height = "50%";
        rectangle.alpha = 0.8;
        this.rectangle = rectangle;
        myText.text = i ? "Level " + i : title;
        myText.outlineColor = "black";
        myText.outlineWidth = 4;
        myText.fontSize = "5%";
        myText.top = "-20%";
        myText.color = "white";
        myText.fontWeight = "bold";
        this.hud.push(myText);

        if (i !== undefined) this.generateButtonHelper(i, img);
        advancedTexture.addControl(rectangle);
        advancedTexture.addControl(myText);
        advancedTexture.addControl(buttonChooseLevel)
        advancedTexture.addControl(buttonStory);
        advancedTexture.addControl(buttonHlp);
        advancedTexture.addControl(button1);

    }

    generateButtonHelper(i, img) {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let button1 = BABYLON.GUI.Button.CreateSimpleButton("helper", "?");
        button1.fontSize = "3%";
        button1.top = "45%";
        button1.left = "45%";
        button1.width = "3%";
        button1.height = "3%";
        button1.color = "white";
        button1.cornerRadius = 100;
        button1.background = "rgba(0, 0, 0, 0.5)";

        let obj = this;
        let main = this.main;
        button1.onPointerUpObservable.add(function () {
            if (main.canMove) {
                obj.soundClic();
                if (main.cameraToMove) main.resetCamera();
                obj.menuMain(obj.level, img, true)
            }
        });
        advancedTexture.addControl(button1);
    }

    genTextSkip() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let myText = new BABYLON.GUI.TextBlock();
        myText.text = "Press Enter to skip";
        myText.outlineColor = "black";
        myText.outlineWidth = 4;
        myText.fontSize = "3%";
        myText.top = "-45%";
        myText.color = "white";
        myText.fontWeight = "bold";
        advancedTexture.addControl(myText);
        return myText;
    }

    buttonReturn(myText, leftPosition = 0) {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "RETURN");
        button1.fontSize = "2%";
        button1.top = "19%";
        button1.left = `${leftPosition}%`
        button1.width = "10%";
        button1.height = "5%";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "rgba(0, 0, 0, 0.5)";

        this.hud.push(myText, button1);
        let main = this;
        button1.onPointerUpObservable.add(function () {
            main.soundClic();
            main.clearHud();
            advancedTexture.addControl(myText);
            let buttonStart = main.genButtonStart(advancedTexture);
            advancedTexture.addControl(buttonStart);
            advancedTexture.addControl(main.genButtonHelp(buttonStart, advancedTexture, myText));
            advancedTexture.addControl(main.genButtonStory(advancedTexture, myText));
            advancedTexture.addControl(main.genButtonChooseLevel(advancedTexture, myText));
        });
        advancedTexture.addControl(button1);
    }

    genAllLevel() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.levels = []
        let acc = -20;
        for (let i = 1; i < this.main.nbrLevel; i++) {
            this.levels[i] = BABYLON.GUI.Button.CreateSimpleButton("but1", "Level " + i);
            this.levels[i].fontSize = "3%";
            this.levels[i].top = `${acc}%`;
            this.levels[i].width = "15%";
            this.levels[i].left = i < (this.main.nbrLevel / 2) + 1 ? "-10%" : "10%"
            this.levels[i].height = "5%";
            this.levels[i].color = "white";
            this.levels[i].cornerRadius = 20;
            this.levels[i].background = "rgba(0, 0, 0, 0.5)";
            acc = i === Math.round(this.main.nbrLevel / 2) ? -20 : acc + 8;
            let obj = this.main;
            let menu = this;
            this.hud.push(this.levels[i]);
            this.levels[i].onPointerUpObservable.add(function () {
                menu.soundClic();
                menu.hud.push(menu.rectangle);
                menu.clearHud();
                menu.rectangle.dispose();
                if (menu.welcome) obj.initialisation();
                else {
                    obj.generatorLevel.deleteLevel();
                    obj.resetCamera();
                }
                obj.hasNeverTurn = true;
                obj.setLevel(i);
            });
            advancedTexture.addControl(this.levels[i]);
        }
    }

    genPushBonus() {
        this.pushBonus=true
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let rectangle = new BABYLON.GUI.Image("name", "images/welcome.jpg");
        rectangle.width = "45%";
        rectangle.height = "50%";
        rectangle.alpha = 0.8;
        let myText = new BABYLON.GUI.TextBlock();
        myText.text = "Congratulations you just unlocked the bonus Punch !\n " +
            "With this level you'll push the boss in the last level more easily\n" +
            "To use the bonus follow the following tutorial : \n" +
            "\r  - You must press at the same time :\n ";
        myText.outlineColor = "black";
        myText.outlineWidth = 4;
        myText.fontSize = "2.9%";
        myText.top = "-15%";
        myText.color = "white";
        myText.fontWeight = "bold";

        let pressEnter = new BABYLON.GUI.TextBlock();
        pressEnter.text = "Press enter to close"
        pressEnter.outlineColor = "black";
        pressEnter.outlineWidth = 4;
        pressEnter.fontSize = "2%";
        pressEnter.top = "19%";
        pressEnter.color = "white";
        pressEnter.fontWeight = "bold";


        let or = this.createText("or");
        or.top = "-1%";

        let plus = this.createText("+");
        plus.top = "5%";


        let zqsdKey = new BABYLON.GUI.Image("zqsd", "images/zqsd.png");
        zqsdKey.width = "10%";
        zqsdKey.height = "10%";
        zqsdKey.top = "-2%";
        zqsdKey.left = "-7%";

        let fleche = new BABYLON.GUI.Image("fleche", "images/fleche.png");
        fleche.width = "10%";
        fleche.height = "10%";
        fleche.top = "-2%";
        fleche.left = "7%";

        let letter_b = new BABYLON.GUI.Image("space", "images/swift.png");
        letter_b.width = "8%";
        letter_b.height = "7%";
        //letter_b.left = "0.5%";
        letter_b.top = "12%";


        this.hud.push(pressEnter,myText,rectangle, letter_b, fleche, zqsdKey, or);
        //this.buttonReturn(myText)
        advancedTexture.addControl(rectangle);
        advancedTexture.addControl(myText);
        advancedTexture.addControl(pressEnter);
        advancedTexture.addControl(or);
        advancedTexture.addControl(letter_b);
        advancedTexture.addControl(zqsdKey);
        advancedTexture.addControl(fleche);
        advancedTexture.addControl(plus);

        this.pushMenu = () => {
            this.pushBonus=false;
            this.main.nbrJetonToGenerate = 0;
            this.main.canMove=true;
            this.clearHud();
        }


    }

    progressBarPush(){
        var UI;
        UI = {};
        UI.adv = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI();

        UI.progressBar = new BABYLON.GUI.Rectangle();
        UI.progressBar.width = "9%";
        UI.progressBar.height = "3%";
        UI.progressBar.verticalAlignment = 1;
        UI.progressBar.top = "-4.2%";
        UI.progressBar.left = "-40%";
        UI.progressBar.isVisible = false;
        UI.progressBar.background = "black";
        UI.adv.addControl( UI.progressBar );

        UI.progressBarInner = new BABYLON.GUI.Rectangle();
        UI.progressBarInner.width = 0;
        UI.progressBarInner.height = "100%"; // progressBar.height - (progressBar.thickness *2 )
        UI.progressBarInner.thickness = 0;
        UI.progressBarInner.horizontalAlignment = 0;
        UI.progressBarInner.isVisible = true;
        UI.progressBarInner.background = "green";
        UI.progressBar.addControl( UI.progressBarInner );
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let push = new BABYLON.GUI.TextBlock();
        push.text = "Punch";
        push.outlineColor = "black";
        push.outlineWidth = 4;
        push.fontSize = "3%";
        push.top = "44%";
        push.left = "-47%";
        push.color = "white";
        push.fontWeight = "bold";

        advancedTexture.addControl(push)
        this.hud.push(push,UI.progressBar)
        UI.setProgress = function(progress = 0) {
            UI.progressBarInner.width = progress/120;
        };

        UI.showProgressBar = function(progress) {
            if(progress) { UI.setProgress(progress) }
            UI.progressBar.isVisible = true;
        };

        UI.hideProgressBar = function() {
            UI.progressBar.isVisible = false;
        };
        var beta = 0;
        this.main.scene.registerBeforeRender(() => {
            if(!UI.progressBar.isVisible){
                UI.showProgressBar(beta);
            }
            else {
                UI.setProgress(beta)
            }
            if(beta===120)this.main.canPush=true

            beta++
        })
    }

    soundClic() {
        var clic = new BABYLON.Sound("clic", "sounds/clic.wav", this.main.scene, null, {loop: false, autoplay: true});

    }
}