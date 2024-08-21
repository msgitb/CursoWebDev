var gameStarted = false;
var sequence = [];
var currentLevel = 1;

$(document).click(handleClick);
$("button").click(handleButtonClick);

function handleClick(event){
    !gameStarted && startGame();
}

function getRandColor(){
    return Math.floor(Math.random()*4);
}

function changeInfoMessage(text){
    $("#infoMessage").text(text);
}

function startGame(){
    gameStarted = true;
    for (i=0; i < 10; i++){
        sequence[i] = getRandColor();
    }
    console.log(sequence);
    showLevel();
}

function showLevel(){
    changeInfoMessage("Level " + currentLevel);
    showSequence(currentLevel);
}

function showAt(i){
    setTimeout(()=>{$("#"+sequence[i]).click()},1000*i);
}

function showSequence(level){
    for(i=0; i < level; i++){
       showAt(i);
    }
}

function playSound(id){
    var colorNames = ['red', 'blue', 'green', 'yellow','wrong'];
    var audio = new Audio("./sounds/"+ colorNames[id] +".mp3");
    audio.play();
}


function handleButtonClick(ev){

    var id =ev.target.id;
    $("#"+id).addClass("pressed");
    setTimeout(()=>{$("#"+id).removeClass("pressed")},300);
    playSound(id);

    if (ev.originalEvent !== undefined){
        verifyCorrectPress(id);
    } 
}

function verifyCorrectPress(id){
    console.log("Verifying...");
    if(sequence[currentLevel-1] == id){
        console.log("Correct!");
        currentLevel++;
        showLevel();
    }
}