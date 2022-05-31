# Catch-and-become-unique
[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)


**Game Play**
---
> Dans ce jeu vous incarnez la planète Terre. Face au rechauffement climatique qui est de plus en plus préoccupant la terre decide de changer de galaxie. En recuperant les jetons vous pourrez progresser de niveau et en parcourant les differents niveaux vous aiderez la terre à trouver un environnement qui lui sera plus adapté. Vous l'avez donc comprit le destin de la terre est entre vos mains !

**Comment jouer**
---
Vous pouvez directement accéder au jeu en cliquant sur <a href="https://catch-and-become-unique.herokuapp.com/">https://catch-and-become-unique.herokuapp.com/</a>
- 'z' ou fleche du haut = deplacer vers l'avant. 
- 's' ou fleche du bas = deplacer vers l'arriere. 
- 'q' ou fleche de gauche = deplacer vers la gauche. 
- 'd' ou fleche de droite = deplacer vers la droite. 
- ' ' = sauter. 
- 'p' = pour avoir une vue d'ensemble du niveau

#### le nombre de vies restantes
---
<img width="173" alt="Capture d’écran 2022-05-27 à 09 00 30" src="https://user-images.githubusercontent.com/79304440/170649502-296173f4-f7d0-43b7-a8d4-4b803ce92900.png">

#### le nombre de jetons restants a prendre pour finir le niveau
---
<img width="137" alt="Capture d’écran 2022-05-27 à 09 00 41" src="https://user-images.githubusercontent.com/79304440/170649829-67eba81b-2b91-4fef-83e1-e5628c08cecc.png">


#### Bouton pour mettre en pause le jeu
---
<img width="66" alt="Capture d’écran 2022-05-27 à 09 01 03" src="https://user-images.githubusercontent.com/79304440/170649848-749f2e5a-b62b-4e5d-96cd-b9cc882cacf1.png">


#### Les jetons à recuperer 
---
<img width="66" alt="Capture d’écran 2022-05-27 à 09 02 03" src="https://user-images.githubusercontent.com/79304440/170649882-2f1f9d8f-eb0d-4ca2-b5a8-7b2e1ca5a499.png">


#### Les vies à récupérer
---
<img width="71" alt="Capture d’écran 2022-05-27 à 09 02 46" src="https://user-images.githubusercontent.com/79304440/170649958-1d15b8e5-91c9-4d87-978b-db3958f3556f.png">

#### Le boss de fin
---
<img width="115" alt="Capture d’écran 2022-05-27 à 09 04 27" src="https://user-images.githubusercontent.com/79304440/170649906-6f53b722-8295-497a-b92e-1594c4f3d3ae.png">


**Aides**
---
* Au debut de chaque niveau il y a un bouton "help" pour vous rappeler les touches utiles.
* De plus, vous pouvez mettre le jeu en pause et accèder à nimporte quel bouton en cliquant sur "?" situé en bas a droite de votre écran.
* Pour ne pas lacher le clavier vous pouvez directement appuyer sur la touche entrer à chaque menu cela sera equivalent à appuyer sur "Start Game"

**Story**
---
Au fur et à mesure des niveaux suivez l'hitoire du voyage de la terre en cliquant sur ``Story``avant chaque debut de niveau.
> Pensez aussi à cliquer sur le bouton ``Story`` apres avoir gagné où perdu pour voir les repercutions de votre reussite/defaite.

**Améliorations futures**
---
> Pour la suite du jeu nous avons imaginé plusieures améliorations, par exemples : 
- Plus d'effets sonores.
- Plus de reliefs dans les niveaux.
- Pour le niveau final nous avons l'idée de creer un pacman en 3D qui sera la derniere étape afin que la boule puisse rejoindre la nouvelle galaxie. Et les adversaires seront differentes planetes qui empecheront la boule dans sa progression.
- **Ameliorer les performances de notre jeu, c'est à dire moins de lag et moins de temps de chargement entre les niveaux.**

**Difficultés rencontrées**
---
- Le debut de la conception du jeu fut fastidieuse. En effet, dés le debut nous avons cherché à "simplement" créer une boule qui se deplace sur une terrain plat et une followCamera. La followCamera avait un comportement que nous ne comprenions pas. Lorsque nous nous deplacions sur les cotés cela changeait l'axe de la camera et la faisait tourner dans tout les sens. Pour resoudre ce probleme nous avons choisi l'ArcRotateCamera.
-  Le plus gros soucis que nous avons rencontré est le saut de la boule. Le soucis n'etait pas le saut en lui meme mais de lui rendre un aspect réaliste. Au debut notre boule planait dans les airs. Nous avons (presque) tout essayé, masse démesurée, impulsion de la boule en direction du sol lorsque la boule a atteint une certaine hauteur. Finalement après beaucoup de recherches nous avons trouvés notre problème qui était tout bête... nous n'appliquions pas de physique à la scene donc grace à la fonction enablePhysics nous avons exercé une gravité sur l'axe des y sur la scene.
-  Un point faible dans notre jeu est le fait que par moment le chargement du prochain niveau met quelques secondes à arriver. Par exemple vous prenez le dernier jeton d'un niveau il se peut que cela mette quelques secondes avant de charger le menu suivant ainsi que le prochain niveau or cela se produit rarement et depend de l'ordinateur sur lequel vous testez le jeu.
-  **Une fois ces 2 problemes resolus nous avons pu avancer dans la création du jeu et prendre beaucoup de plaisir à voir evoluer le jeu.**

**Video de présentation**
---
Voici le lien d'une courte video pour vous presenter les principales fonctionnnalités de notre jeu : 

[![Watch the video](https://user-images.githubusercontent.com/79304440/171142420-04269344-48a2-47f7-803c-cb1a2bb80a1a.png)](https://youtu.be/f2Y4p5jHhW4)

**Video explicative pour le bonus "punch"**
---
Voici le lien d'une derniere courte video pour vous expliquer le fonctionnnement du bonus punch que vous pouvez récupérer au niveau 10 : 

[![Watch the video](https://user-images.githubusercontent.com/79304440/171153204-43dff6f7-85ba-4c75-ab0e-74391de07ee9.png)](https://youtu.be/CFs4h-C-GCc)

**Annecdote**
---
Le son du saut a été conçu par un ami à nous qui est musicien. En tout, il y a 4 sons differents qui sont joués un par un, à chaque saut.


Nous espérons que notre jeu vous plaiera. :)

Marynowicz Michael   
FORNER Yann
