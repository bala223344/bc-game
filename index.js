//Server setup
var express = require("express");
var app = express();
var path = require("path");
require('dotenv').config()

var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
const passport = require('passport');

const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

const session = require('express-session');
// const cors = require('cors');
const errorHandler = require('errorhandler');

//var config = require("./config.json");

//DB
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



//app.use(express.static(__dirname + "/public"));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 1000 * 3600 * 60 }, resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());



require('./config/passport');




const isProduction = process.env.NODE_ENV === 'production';

//Configure our app
app.use(express.static(path.join(__dirname, 'public')));


if(!isProduction) {
  app.use(errorHandler());
}
app.use(express.json());

app.use(express.urlencoded({extended: true}));

require('./config/routes.js')(app, passport); 

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

//Open port
server.listen(8000);

console.log("Listening on port 8000");

exports = module.exports = app;




//Global variables
var open_connections = 0;
var players_online = 0;
var clients = {};



//Session opened
io.on("connection", function(socket) { // event handler on connection
    

    

    players_online++;
    open_connections++;
    io.sockets.emit("adjustPopulation", { population: open_connections,
        players_online: players_online });

  
    

  

    // CHAT
    // receive message
    socket.on('sendMessage', function (data) {
        // we tell the client to execute 'new message'
        io.sockets.emit('new message', {
            usn: data.usn,
            message: data.message
        });
    });

    //Join game handler
    socket.on("joinGame", function(data) {
        console.log("Player " + data.id + " joined the game");

        clients[data.id] = { id: data.id, username: data.usn,
            position: data.position, hp: 100 };

        for (var c in clients) {
            io.sockets.emit("spawnPlayer", { id: clients[c].id,
                position: clients[c].position,
                name: clients[c].username,
                hp: clients[c].hp });
        }

    });

    socket.on("takeDamage", function(data) {
        //not dead 
        if(typeof clients[data.id] !== 'undefined') {
            clients[data.id].hp -= 10;
            if (clients[data.id].hp <= 0) {
                io.sockets.emit("killPlayer", { id: data.id });

              //  players_online--;
            
                console.log("Player " + data.id + " disconnected");
                io.sockets.emit("removePlayer", { id: data.id });
              //  io.sockets.emit("adjustPopulation", { population: open_connections,
                //    players_online: players_online });
                socket.broadcast.emit("userLeft", { username: data.username });
                delete clients[data.id];
                
            }
        }
    });

    //Player movement handler
    socket.on("playerMovement", function(data) {
        
 
        
        if (data.id > 0 && data.id != undefined && clients[data.id])  {
            clients[data.id].position = data.position;
            io.sockets.emit("updatePlayerPosition", { id: data.id, position:
                data.position, direction: data.direction,
                moving: data.moving, attack: data.attack });
        }
    });

    //Session closed
    // something is wrong with this; doesn't work with one person online
    socket.on("closeWindow", function(data) {
        var handleClose = function(callback) {
            open_connections--;
            if (data.id > 0) {
               // players_online--;
            
                console.log("Player " + data.id + " closed");
                delete clients[data.id];
                
            }
            callback && callback();
        };

        var removeAfter = function(callback) {
            io.sockets.emit("removePlayer", { id: data.id });
            callback && callback();
        };

        var emitLast = function() {
            //already done on socket disconnect
          //  io.sockets.emit("adjustPopulation", { population: open_connections,
           //     players_online: players_online });
        };

        socket.broadcast.emit("userLeft", { username: data.username });

        handleClose(function() {
            removeAfter(function() {
                emitLast();
            });
        });
    });


    socket.on('disconnect', function () {
       
     players_online--;
    open_connections--;
    io.sockets.emit("adjustPopulation", { population: open_connections,
        players_online: players_online });

        console.log("diconnected");
       
       // open_connections--;

        //clearInterval(tweets);
      });
});

