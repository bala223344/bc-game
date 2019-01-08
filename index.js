//Server setup
var express = require("express");
var app = express();
var path = require("path");

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
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }));

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
    

    console.log('wat');
    

    open_connections++;
    io.sockets.emit("adjustPopulation", { population: open_connections,
        players_online: players_online });

  
    
    //Refactor this hacky method; problem: can have only one emit call
    //Login handler
    socket.on("login", function(data) {
        
        var handleLogin = function(callback) {
            pg.connect(conString, function(err, client, done) {
                if (err != null) { console.log(err); }
                var query = client.query({
                    text: "SELECT id, salt, password, banned, admin, " +
                        "logged_in FROM accounts WHERE username=$1",
                    values: [data.usn]
                }, function(err) { if (err != null) { console.log(err); } });
                query.on("row", function(row, result) { result.addRow(row); });
                query.on("end", function(result) {
                    var status = "good";
                    try {
                        if (sha512(data.pwd, result.rows[0].salt).hash ===
                            result.rows[0].password) {
                            client.query({
                                text: "UPDATE accounts SET last_login=" +
                                    "CURRENT_TIMESTAMP, logged_in=TRUE WHERE" +
                                    " username=$1",
                                values: [data.usn]
                            }, function(err) {
                                if (err != null) { console.log(err); }
                            });
                            if (result.rows[0].banned) {
                                status = "You have been banned";
                            } else if (result.rows[0].logged_in) {
                                status = "You are already logged in";
                            } else {
                                status = "Authenticated successfully";
                                players_online++;
                                socket.broadcast.emit("userLogin",{
                                    username: data.usn
                                });
                                client.query({
                                    text: "UPDATE accounts SET last_known_ip" +
                                        "=$1 WHERE username=$2",
                                    values: [data.ip, data.usn]
                                }, function(err) {
                                    if (err != null) { console.log(err); }
                                });
                              
                            }
                        } else {
                            status = "Wrong password";
                          
                        }
                        socket.emit("loginResponse", {
                            status: status,
                            id: result.rows[0].id,
                            banned: result.rows[0].banned,
                            admin: result.rows[0].admin,
                            username: data.usn
                        });
                    } catch (ex) {
                        status = "Username does not exist";
                        console.log(ex);
                        socket.emit("loginResponse", { status: status });
                    }
                    done();
                    callback && callback();
                });
            });
        }

        var emitLast = function() {
            io.sockets.emit("adjustPopulation", { population: open_connections,
                players_online: players_online });
        };

        handleLogin(function() { emitLast(); });
    });

 

  

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
        clients[data.id].hp -= 10;
        if (clients[data.id].hp <= 0) {
            io.sockets.emit("killPlayer", { id: data.id });
        }
    });

    //Player movement handler
    socket.on("playerMovement", function(data) {
        if (data.id > 0 && data.id != undefined)  {
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
                players_online--;
                pg.connect(conString, function(err, client, done) {
                    if (err != null) { console.log(err); }
                    client.query({
                        text: "UPDATE accounts SET logged_in=FALSE WHERE " +
                            "id=$1",
                         values: [data.id]   
                    }, function(err) {
                        if (err != null) { console.log(err); }
                    });
                    done();
                });
                console.log("Player " + data.id + " disconnected");
                delete clients[data.id];
                
            }
            callback && callback();
        };

        var removeAfter = function(callback) {
            io.sockets.emit("removePlayer", { id: data.id });
            callback && callback();
        };

        var emitLast = function() {
            io.sockets.emit("adjustPopulation", { population: open_connections,
                players_online: players_online });
        };

        socket.broadcast.emit("userLeft", { username: data.username });

        handleClose(function() {
            removeAfter(function() {
                emitLast();
            });
        });
    });


    socket.on('disconnect', function () {
       
       
        console.log("(*(*(*(*(*())))))");
       
       // open_connections--;

        //clearInterval(tweets);
      });
});

