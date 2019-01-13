



function runMap() {
    gameMap = new Phaser.Game(320, 240, Phaser.AUTO, "map",
        { preload: preloadMap, create: createMap, update: updateMap });

    function preloadMap() {
        gameMap.load.image("background", "images/maplg.png");
        gameMap.load.spritesheet("player", "images/mapplayer.png");


    }
}

function createMap() {
   
    gameMap.world.setBounds(0, 0, 320, 240);

    backgroundMap = gameMap.add.tileSprite(0, 0, 320, 240, "background");

    gameMap.stage.disableVisibilityChange = true;
}




    function updateMap() {




            
   
}
