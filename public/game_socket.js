
socket.on("spawnPlayer", function(data) {
    if (id > 0) {
        if (data.id === id) { return; }

        if (!(playerStorage[data.id])) {
            var p = game.add.sprite(data.position.x, data.position.y, "player");
            loadAnimationFrames(p);
            game.physics.arcade.enable(p);
            p.body.setSize(32, 48, 16, 14);
            p.body.immovable = true;
            p.body.moves = false;
            p.addChild(game.make.text(10, -30, data.name, {fontSize: 16}));
            p.addChild(game.make.sprite(10, -10, "healthBar"));

            playerStorage[data.id] = p;
        }

        player.bringToTop();
    }
});

socket.on("updatePlayerPosition", function(data) {
    if (id > 0) {
        if (data.id === id) { return; }
        playerStorage[data.id].position = data.position;
        if (data.moving) {
            playerStorage[data.id].animations.play(data.direction);
        } else if (data.attack === "thrust_") {
            playerStorage[data.id].animations.play("thrust_" +
                data.direction);
            var xOffset = playerStorage[data.id].x;
            var yOffset = playerStorage[data.id].y;
            if (data.direction === "left") { xOffset -= 32; }
            else if (data.direction === "right") { xOffset += 32; }
            else if (data.direction === "up") { yOffset -= 32; }
            else { yOffset += 32; }
            var strikeHitbox = swings.create(xOffset, yOffset,
                "swing", 7);
            setTimeout(function() {
                strikeHitbox.kill();
            }, 70);
        } else if (data.attack === "shoot_") {
            if (data.direction === "left") { index = 0; }
            else if (data.direction === "right") { index = 32; }
            else if (data.direction === "up") { index = 16; }
            else { index = 48; }
            var fireball = fireballs.create(
                playerStorage[data.id].x,
                playerStorage[data.id].y, "fireball", index);

            if (data.direction === "left") {
                fireball.body.velocity.x = -1200;
            } else if (data.direction === "right") {
                fireball.body.velocity.x = 1200;
            } else if (data.direction === "up") {
                fireball.body.velocity.y = -1200;
            } else { fireball.body.velocity.y = 1200; }
        } else {
            if (data.direction === "left") {
                playerStorage[data.id].frame = 117;
            } else if (data.direction === "right") {
                playerStorage[data.id].frame = 143;
            } else if (data.direction === "up") {
                playerStorage[data.id].frame = 104;
            } else {
                playerStorage[data.id].frame = 130;
            }
            playerStorage[data.id].animations.stop();
        }
    }
});

socket.on("removePlayer", function(data) {
    if (id > 0) {
        playerStorage[data.id].destroy();
        delete playerStorage[data.id];
    }
});

socket.on("killPlayer", function(data) {
    if (data.id != id) {
        playerStorage[data.id].kill();
        delete playerStorage[data.id];
        return;
    } else {
        player.kill();
        player = null;
        player = game.add.sprite(
            Math.floor((Math.random() * 3200) + 1),
            Math.floor((Math.random() * 2400) + 1), "player", 130);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        loadAnimationFrames(player);
        player.addChild(game.make.text(10, -30, username, {fontSize: 16}));
        player.addChild(game.make.sprite(10, -10, "healthBar"));
        game.camera.follow(player);
        socket.emit("joinGame", { id: id, usn: username,
            position: player.position });
    }
});