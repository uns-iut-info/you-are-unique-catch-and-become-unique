export default class Affichage{
    constructor(main) {
        this.main=main
    }

    printNumberOfJeton() {
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = `${this.main.allJeton - this.main.nbrJetonToGenerate}/${this.main.allJeton} token`;
        text1.color = "white";
        text1.fontSize = 26;
        text1.top = -320;
        text1.left = 600;
        this.main.affichage = text1;
        this.main.scene.advancedTexture.addControl(text1);
    }

    printLife() {
        var acc=0;
        if(this.main.life.length>0) {
            for (let i = 1; i < this.main.nbrLife; i++) {
                this.main.life[i].dispose();
            }
        }
        for (let i = 1; i < this.main.nbrLife+1; i++) {
            var image = new BABYLON.GUI.Image("but_"+i, "images/ball.jpg");
            image.height = "50px";
            image.width = "50px";
            image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            image.left = `${acc} px`;
            this.main.life[i] = image;
            this.main.scene.advancedTexture.addControl(image);
            acc = 50*i;
        }
    }

}