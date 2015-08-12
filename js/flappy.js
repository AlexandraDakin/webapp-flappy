// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 300;
var jumpPower = -100;
var score = 0;
var labelScore;
var player;
var count = 0;
var gapStart = game.rnd.integerInRange(1, 5);
var pipes = [];
var gapMargin = 45;
var gapSize = 150;
var blockHeight = 50;
var pipeEndExtraWidth = 5;
var pipeEnd2Height = 50;
var pipeEnd2ExtraWidth = 5;
var heavy = [];
var light = [];


jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    //alert(greeting_message);
  //  event_details.preventDefault();
});


function preload() {game.load.image("playerImg", "../assets/hulk.png");
    game.load.image("backgroundImg", "../assets/city-buildings-cartoon.jpg");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe","../assets/building.png");
    game.load.image("pipeEnd","../assets/building2.png");
    game.load.image("pipeEnd2","../assets/building3.png");
    game.load.image("heavy","../assets/helicopter.png");
    game.load.image("light","../assets/bomb.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create()
    {game.stage.setBackgroundColor("#A5C5D9");
        var background = game.add.image(0, 0, "backgroundImg");
        background.width = 800;
        background.height = 400;
        game.physics.startSystem(Phaser.Physics.ARCADE);
    player = game.add.sprite(30, 270, "playerImg");
    game.physics.arcade.enable(player);

    player.anchor.setTo(0.5, 0.5);

    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler)
    //alert(score);

        game.input.keyboard
            .addKey(Phaser.Keyboard.SPACEBAR)
            .onDown.add(playerJump);

    labelScore = game.add.text(100, 20, "0");



    player.body.gravity.y = gameGravity;

    pipeInterval = 1.75;
        game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generate);

        generatePipe();


}

function generate(){
    var diceRoll = game.rnd.integerInRange(1,10);
    if(diceRoll==1) {
        generateLight();
    } else if (diceRoll==2) {
        generateHeavy();
    } else {
        generatePipe();
    }
}

function generateLight(){
    var bonus = game.add.sprite(width, height, "light");
    light.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -gameSpeed
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
}

function generateHeavy(){
    var bonus = game.add.sprite(width, height, "heavy");
    heavy.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -gameSpeed
    bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
}

    // set the background colour of the scene}

function spaceHandler() {
    game.sound.play("score");
}
function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}





function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -gameSpeed;
}

function addPipeEnd(x, y) {
    var block = game.add.sprite(x, y, "pipeEnd");
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -gameSpeed
}

function addPipeEnd2(x, y) {
    var block = game.add.sprite(x,y, "pipeEnd2");
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -gameSpeed
}

function generatePipe() {

    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    addPipeEnd(width-(pipeEndExtraWidth/2)+2, gapStart+gapSize - 35);
    for(var y = gapStart + gapSize; y < height; y += blockHeight) {
        // y is the coordinate of the bottom of the block, subtract blockHeight
        // to get the top
        addPipeBlock(width, y);
    }

    addPipeEnd2(width- (pipeEnd2ExtraWidth/2)+2, gapStart-pipeEnd2Height + 50);
    for(var y = gapStart; y > 0 ; y -= blockHeight) {
        addPipeBlock(width, y - blockHeight);
    }

    changeScore();
}


function playerJump() {
    player.body.velocity.y = jumpPower;
}

function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;

}


/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    for(var index=0; index<pipes.length; index++) {
        game.physics.arcade
            .overlap(player, pipes[index], gameOver);
    }
    if(player.body.y < 0 || player.body.y > 400){
        gameOver();
    }
    player.rotation = Math.atan(player.body.velocity.y /gameSpeed);

   // for(var i=.length - 1; i >= 0; i--){
     //   game.physics.arcade.overlap(player,)
    //}

}

function gameOver(){
    $("#score").val(score.toString());
    $("#greeting").show();
    game.paused = true;
    game.state.restart()
}
gameGravity = 300;
$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < 3; i++) {
        $("#scoreBoard").append(
        "<li>" +
        scores[i].name + ": " + scores[i].score +
        "</li>");
    }
});