//get ip
$.getJSON("https://api.ipify.org?format=jsonp&callback=?", function(json) {
    ip = json.ip;
});

//get browser
if ((!!window.opr && !!opr.addons) || !!window.opera ||
    navigator.userAgent.indexOf(' OPR/') >= 0) { browser = "Opera"; }
else if (typeof InstallTrigger !== "undefined") { browser = "Firefox"; }
else if (Object.prototype.toString.call(window.HTMLElement).indexOf(
    "Constructor") > 0) { browser = "Safari"; }
else if (false || !!document.documentMode) { browser = "IE"; }
else if (!!window.StyleMedia) { browser = "Edge"; }
else if (!!window.chrome && !!window.chrome.webstore) { browser="Chrome"; }
else { browser = "Blink"; }

//hide forms


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




     

        runGame();
 

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
