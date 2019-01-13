$(function () {

    

    socket.on("spawnPlayer", function(data) {
        if (id > 0) {
                
            if (!(playerMapStorage[data.id])) {
                
                var p = gameMap.add.sprite(data.position.x / 10  , data.position.y / 10, "player");
                playerMapStorage[data.id] = p;
              //  var p = gameMap.add.sprite( 10  ,  10, "player");

            }
       
        }
            
    })


        
    socket.on("updatePlayerPosition", function(data) {

        if (id > 0) {
                   
            playerMapStorage[data.id].position.x = data.position.x / 10;
            playerMapStorage[data.id].position.y = data.position.y / 10;
        }
           
        
    });


    socket.on("killPlayer", function(data) {
          
        playerMapStorage[data.id].kill();
        playerMapStorage[data.id].destroy();    
          //  delete playerStorage[data.id];
           // TODO socket.emit("gravestoneplaced")
            return;
    });
})

