$(function () {

    

    socket.on("spawnPlayer", function(data) {

            if (!(playerMapStorage[data.id])) {
                
                var p = gameMap.add.sprite(data.position.x / 10  , data.position.y / 10, "player");
                playerMapStorage[data.id] = p;
              //  var p = gameMap.add.sprite( 10  ,  10, "player");

            }
       
            
    })


        
    socket.on("updatePlayerPosition", function(data) {

                   
            playerMapStorage[data.id].position.x = data.position.x / 10;
            playerMapStorage[data.id].position.y = data.position.y / 10;
           
        
    });


    socket.on("killPlayer", function(data) {
          
        playerMapStorage[data.id].kill();
        playerMapStorage[data.id].destroy(); 
        delete playerMapStorage[data.id]; 
          //  delete playerStorage[data.id];
           // TODO socket.emit("gravestoneplaced")
            return;
    });
})

