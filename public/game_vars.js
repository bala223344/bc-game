var playerStorage = {};
var FIREBALL_COOLDOWN = 3000;

var bounds;
var game;
var blocks;


var dir = "";
var isMoving = false;
var attack = null;
//  this will be useful to have counters..so we can bring the post attack benefits
var lastAttack = null;
var isCollingWithTree = false;
var lastCollidedTree = null
var treeChopCounter = 0;
var lastMovedDir = null;
var lastShot = new Date().getTime();
