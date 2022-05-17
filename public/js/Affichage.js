export default class Affichage {
    constructor(main) {
        this.main = main
    }

    printNumberOfJeton() {
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = `${this.main.allJeton - this.main.nbrJetonToGenerate}/${this.main.allJeton} token`;
        text1.color = "white";
        text1.fontSize = 26;
        text1.top = "-45%";
        text1.left = "45%";
        this.main.affichage = text1;
        this.main.scene.advancedTexture.addControl(text1);
    }

    printLife() {
        var acc = 0;
        if (this.main.life.length > 0) {
            this.advancedTexture.dispose();
            for (let i = 1; i < this.main.nbrLife; i++) {
                this.main.life[i].dispose();
            }
        }

        for (let i = 1; i < this.main.nbrLife + 1; i++) {
            var image = new BABYLON.GUI.Image("but_" + i, "images/ball_earth.jpg");
            image.height = "50px";
            image.width = "50px";
            image.top = "9%";
            image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            image.left = `${acc + 3} px`;
            this.main.life[i] = image;
            acc = 50 * i;
        }


        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");


        var rect1 = new BABYLON.GUI.Rectangle();
        rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        rect1.height = "55px";
        rect1.width = `${acc + 10}px`;
        rect1.left = "0.3%";
        rect1.cornerRadius = 20;
        rect1.top = "-45%";
        rect1.color = "blue";
        rect1.thickness = 1;
        rect1.background = "grey";
        for (let i = 0; i < this.main.life.length; i++) {
            rect1.addControl(this.main.life[i])
        }
        advancedTexture.addControl(rect1);
        this.advancedTexture = advancedTexture;


    }

    printFight(){
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
        let fight = new BABYLON.GUI.Image("name", "images/fight.png")
        fight.width = "45%";
        fight.height = "50%";
        fight.alpha = 0.9;
        advancedTexture.addControl(fight);
        setTimeout(()=>{
            advancedTexture.dispose();
        },800);
    }

}