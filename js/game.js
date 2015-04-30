var websocket;

$(document).ready(init);

function init() {
  $('#server').val("ws://" + window.location.host + "/websocket");

  if(!("WebSocket" in window)) {
    console.log("websockets are not supported");
  } else {
      console.log("websockets are supported");
      connect();
  };
};

function connect() {
  wsHost = "ws://127.0.0.1:8080/ws"
  websocket = new WebSocket(wsHost);
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
};

function disconnect() {
  websocket.close();
};

function toggle_connection() {
  if(websocket.readyState == websocket.OPEN) {
      disconnect();
  } else {
      connect();
  };
};

function sendCommand(command) {
  if(websocket.readyState == websocket.OPEN) {
      websocket.send(command);
  } else {
      console.log("closed")
  };
};

function onOpen(evt) {
  console.log("onopen")
  sendCommand("start");
};

function onClose(evt) {
  console.log("onclose")
};

function onMessage(evt) {
  command = JSON.parse(event.data);
  if (command.player) {
    var position = JSON.parse(event.data).player.position;
    movePlayer(position);
  }

  if (command.monster) {
  	var position = JSON.parse(event.data).monster.position;
    moveMonster(position);
  }

  if (command.firebolt) {
    var position = JSON.parse(event.data).firebolt.position;
    moveFirebolt(position);
  }
};

function movePlayer(position) {
  hero.x = position.x * 16;
  hero.y = position.y * 16;
  if (position.direction == "n") {
    heroImage.src = "images/hero_front.png";
  }

  if (position.direction == "s") {
    heroImage.src = "images/hero_back.png";
  }

  if (position.direction == "e") {
    heroImage.src = "images/hero_right.png";
  }

  if (position.direction == "w") {
    heroImage.src = "images/hero_left.png";
  }
};

function moveMonster(position) {
  monster.x = position.x * 16;
  monster.y = position.y * 16;
  if (position.direction == "n") {
    monsterImage.src = "images/monster_front.png";
  } else {
    monsterImage.src = "images/monster_back.png";
  }
};

function moveFirebolt(position) {
  firebolt.x = position.x * 16;
  firebolt.y = position.y * 16;
  firebolts.push(firebolt);
  firebolt.ready = true;
};

function onError(evt) {
 console.log("onopen")
};

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();

bgImage.onload = function () {
	bgReady = true;
};

bgImage.src = "images/background2.png";

// Hero
var hero = {};
var heroReady = false;
var heroImage = new Image();

heroImage.onload = function() {
	heroReady = true;
};

heroImage.src = "images/hero_front.png";


// Monster
var monster = {};
var monsterReady = false;
var monsterImage = new Image();

monsterImage.onload = function () {
	monsterReady = true;
};

monsterImage.src = "images/monster_front.png";

// Firebolt
var firebolts = []
var firebolt = {};
var fireboltReady = false;
var fireboltImage = new Image();

fireboltImage.src = "images/crystal.png";

// Handle keyboard controls
addEventListener("keypress", function (e) { update(e.keyCode); });

// Update game objects
var update = function (keyCode) {
	if (keyCode == 119) {
		var msg = {move: "down"};
		sendCommand(JSON.stringify(msg));
	}

	if (keyCode == 115) {
		var msg = {move: "up"};
		sendCommand(JSON.stringify(msg));
	}

	if (keyCode == 97) {
		var msg = {move: "left"};
		sendCommand(JSON.stringify(msg));
	}

	if (keyCode == 100) {
		var msg = {move: "right"};
		sendCommand(JSON.stringify(msg));
	}

  if (keyCode == 106) {
    var msg = {attack: "fire"};
    sendCommand(JSON.stringify(msg));
  }
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

  if (firebolt.ready) {
    firebolts.forEach(drawFirebolt);
    firebolts = []
  }
};

function drawFirebolt(firebolt, index, array) {
  ctx.drawImage(fireboltImage, firebolt.x, firebolt.y);
}

// Let's play this game!
setInterval(render, 50); // Execute as fast as possible
