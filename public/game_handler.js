



function runGame() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, "game",
        { preload: preload, create: create, update: update , update: update });

    function preload() {
        game.load.image("background", "images/maplg.png");
        game.load.spritesheet("player", "images/character.png", 64, 64,
            32);
        game.load.spritesheet("fireball", "images/fireball.png", 64, 64,
            64);
        game.load.spritesheet("gravestone", "images/gravestone.png", 111, 90,
        4);
        game.load.image('healthBar', 'images/health.png');
        game.load.audio("backGroundMusic", "music/bgmusic.mp3");
        game.load.image("tree", "images/tree.png");
        game.load.image("blocks", "images/blocks.png");
        game.load.image("stump", "images/stump.png");


    }
}


function countChop() {

        if(lastCollidedTree) {
            treeChopCounter++;
            if(treeChopCounter == 3) {
                var xOffset = player.x;
                var yOffset = player.y;
                stumpX = xOffset
                stumpY = yOffset
               if (lastMovedDir === "left") { stumpX = xOffset -= 70; yOffset += 20; stumpY += 50; }
                else if (lastMovedDir === "right") { stumpX +=40;  xOffset += 80;  yOffset += 10; stumpY += 50; }
                else if (lastMovedDir === "up") {  stumpX =  xOffset -= 20;  yOffset -= 90; stumpY -= 30; }
                else { stumpX =  xOffset -= 20;  yOffset += 70; stumpY += 100; }
                var block = blocks.create(xOffset, yOffset , "blocks")
               block.body.immovable = true;

               var stump = stumps.create(stumpX, stumpY , "stump")
               stump.body.immovable = true;
               player.bringToTop()
                lastCollidedTree.kill()
            }

        }
}
function create() {
    var bgm = game.add.audio("backGroundMusic");
    bgm.loop = true;
    bgm.play();
    background = game.add.tileSprite(0, 0, 3200, 2400, "background");
    game.world.setBounds(0, 0, 3200, 2400);
    game.physics.startSystem(Phaser.Physics.ARCADE);

   // player = game.add.sprite(
   //     Math.floor((Math.random() * 3200) + 1),
    //    Math.floor((Math.random() * 2400) + 1), "player", 130);

    player = game.add.sprite(
       Math.floor(1),
       Math.floor( 1), "player", 130);

      

            
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    blocks = game.add.physicsGroup();
    stumps = game.add.physicsGroup();


    fireballs = game.add.physicsGroup();
   // swings = game.add.physicsGroup();

    player.body.setSize(32, 48, 16, 14);

    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    kKey = game.input.keyboard.addKey(Phaser.Keyboard.K);

    shiftKey.onDown.add(countChop, this);

    loadAnimationFrames(player);
    

  

    // add nametag
    // todo: center this properly
    player.addChild(game.make.text(10, -30, username, {fontSize: 16}));
    player.addChild(game.make.sprite(10, -10, "healthBar"));


    game.camera.follow(player);

    bounds = game.add.physicsGroup();


    var counter = 6100;

    for (var i = 300; i < 6100; i += 400)
    {
        if (!(i >= 1400 &&  i <= 1600))
        {
            bounds.create(i, i, "tree");
            bounds.create (counter, i, "tree");
            bounds.create (i, 1800, "tree");
            bounds.create (1400, i, "tree");
        }

        counter -= 400;
    }

    bounds.forEach(function(tree) {

        tree.body.immovable = true;
        tree.body.setSize(100, 140, 5, 15);

    });


    

    console.log(
        'join enit'
    );
    
    socket.emit("joinGame", { id: id, usn: username,
        position: player.position });
    game.stage.disableVisibilityChange = true;
}




    function update() {

        sendEvent = false;
    if (game.physics.arcade.collide(player, fireballs,
        function(player, fireball) {
            player.children[1].crop(new Phaser.Rectangle(0, 0,
                player.children[1].width - 3, 11));
            socket.emit("takeDamage", { id: id });
            fireball.kill();
        },
        function(player, fireball) {
            return true;
        }, this)) {
        //empty
    }

    if (game.physics.arcade.collide(player, blocks,
        function(player, block) {

            block.kill();
        },
        function(player, block) {
            return true;
        }, this)) {
        //empty
    }


  
    if(player) {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
    }




    if (game.physics.arcade.collide(player, bounds,
        function(player, tree) {
            lastCollidedTree =  tree

        },
        function(player, tree) {

            return true;
        }, this)) {

    }

    if (leftKey.isDown) {
        player.body.velocity.x = -250;
        player.animations.play("left");
        lastMovedDir =  dir = "left";
        isMoving = true;
        attack = false;
        sendEvent = true;
        lastCollidedTree = null;
        treeChopCounter = 0;


    } else if (rightKey.isDown) {
        player.body.velocity.x = 250;
        player.animations.play("right");
        lastMovedDir = dir = "right";
        isMoving = true;
        sendEvent = true;
        attack = false;
        lastCollidedTree = null;
        treeChopCounter = 0;

    } else if (upKey.isDown) {
        player.body.velocity.y = -250;
        player.animations.play("up");
        lastMovedDir = dir = "up";
        isMoving = true;
        sendEvent = true;
        attack = false;
        lastCollidedTree = null;
        treeChopCounter = 0;

    } else if (downKey.isDown) {
        player.body.velocity.y = 250;
        player.animations.play("down");
        lastMovedDir = dir = "down";
        isMoving = true;
        sendEvent = true;
        attack = false;
        lastCollidedTree = null;
        treeChopCounter = 0;

    }
     else if (shiftKey.isDown) {


        player.animations.play("thrust_" + dir);
        isMoving = false;
        attack = "thrust_";
        sendEvent = true;
        lastAttack = attack;
        var xOffset = player.x;
        var yOffset = player.y;
        if (dir === "left") { xOffset -= 32; }
        else if (dir === "right") { xOffset += 32; }
        else if (dir === "up") { yOffset -= 32; }
        else { yOffset += 32; }






    }
    else if (kKey.isDown) {
        sendEvent = true;
        var now = new Date().getTime();
        if (now - lastShot > FIREBALL_COOLDOWN) {
            lastShot = now;
            var index;

            if (dir === "left") { index = 0; }
            else if (dir === "right") { index = 32; }
            else if (dir === "up") { index = 16; }
            else { index = 48; }
            //var fireball = game.add.sprite(player.x, player.y, "fireball",
            //    index);
            var fireball = fireballs.create(player.x, player.y, "fireball",
                index);
            if (dir === "left") { fireball.body.velocity.x = -1200; }
            else if (dir === "right") { fireball.body.velocity.x = 1200; }
            else if (dir === "up") { fireball.body.velocity.y = -1200; }
            else { fireball.body.velocity.y = 1200; }
            isMoving = false;
            attack = "shoot_";
        } else {
            attack = "none_";
        }
    } else {
        if(player) {
            player.animations.stop();
            isMoving = false;
            attack = false;
            if (dir === "left") { player.frame = 16; }
            else if (dir === "right") { player.frame  = 8; }
            else if (dir === "up") { player.frame  = 0; }
            else { player.frame  = 24; }
        }
    }

 
    
    
    

    
    if(player) {
        if(sendEvent) {
            playerStopCalledOnce = false
            socket.emit("playerMovement", { id: id, position: player.position,
                direction: dir, moving: isMoving, attack: attack });
        }else {
            if(!playerStopCalledOnce) {
                console.log(dir);
                
                socket.emit("playerMovement", { id: id, position: player.position,
                    direction: dir, moving: false, attack: attack });
                    playerStopCalledOnce = true
            }
            
        }
        

            
        for (var p in playerStorage) { // this is the only way to do it
            game.physics.arcade.collide(player, playerStorage[p]);
            if (game.physics.arcade.collide(playerStorage[p],
                fireballs,
                function(player, fireball) {
                    fireball.kill();
                    playerStorage[p].children[1].crop(new Phaser.Rectangle(0, 0,
                    playerStorage[p].children[1].width - 3, 11));
                },
                function() {
                    return true;
                }, this)) {
                //empty
            }
        }
    }
}
