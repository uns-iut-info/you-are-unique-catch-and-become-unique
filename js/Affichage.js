export default class Affichage{
    constructor(main) {
        this.main=main
    }

    printNumberOfJeton() {
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = `${this.main.allJeton - this.main.nbrJetonToGenerate}/${this.main.allJeton} token`;
        text1.color = "white";
        text1.fontSize = 24;
        text1.top = "-280px";
        text1.left = "500px";
        this.main.affichage = text1;
        this.main.scene.advancedTexture.addControl(text1);
    }

    printLife() {
        var acc=0;
        for (let i = 1; i < 4; i++) {
            var image = new BABYLON.GUI.Image("but", "images/ball.jpg");
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