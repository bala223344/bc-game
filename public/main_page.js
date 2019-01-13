
function flashMessage(msg) {
    var $d = $("<h1 id='fadingMsg'>" + msg + "</h1>");
    $("#logo").append($d);
    setTimeout(function() {
        $("#fadingMsg").remove();
    }, 5000);
}






//Adjust population
socket.on("adjustPopulation", function(data) {

    if (admin) {
        document.getElementById("connectionCount").innerHTML =
            "Connections open: " + data.population;
    }
    document.getElementById("playerCount").innerHTML =
        "Players online: " + data.players_online;
});

$(function () {
    runGame();
    runMap();
})


 

//Close window handler
$(window).on("beforeunload", function() {
    if (id > 0) { player.destroy(); }
    socket.emit("closeWindow", {
        username: username,
        id: id
    });
});

//Exhaustive handlers for when server disconnects while clients are still
//connected
socket.on("connect_error", function(err) {
    window.location.reload(true);
});

socket.on("connection_timeout", function(err) {
    window.location.reload(true);
});

socket.on("reconnect_attempt", function(err) {
    window.location.reload(true);
});

socket.on("reconnect_error", function(err) {
    window.location.reload(true);
});

socket.on("reconnect_failed", function(err) {
    window.location.reload(true);
});
