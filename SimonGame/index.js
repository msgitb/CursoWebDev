var gameStarted = false;
var sequence = [];
var currentLevel = 1;
var currentGuess = 0;

$(document).click(handleClick);
$("button").click(handleButtonClick);

function handleClick(event){
    debugger
    if (event.originalEvent !== undefined){
        !gameStarted && startGame();
    } 
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
    setTimeout(()=> showLevel(), 400);
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
    if(gameStarted) {
        var id =ev.target.id;
        $("#"+id).addClass("pressed");
        setTimeout(()=>{$("#"+id).removeClass("pressed")},300);
        playSound(id);

        if (ev.originalEvent !== undefined){
            verifyCorrectPress(id,ev);
        }
    } 
}

function verifyCorrectPress(id,ev){
    console.log("Verifying...");
    if(sequence[currentGuess] == id){
        console.log("Correct step!");
        currentGuess++;
        if(currentGuess===currentLevel){
            console.log("Correct Guess!!!!!!!!!!!!!!!!!!!!");
            currentLevel++;
            currentGuess = 0;
            setTimeout(()=>showLevel(),500);
        }
    }
    else{
        ev.stopPropagation();
        console.log("Game Over");
        gameStarted = false;
        playSound(5);
        resetGame();
    }
        
}

function resetGame(){
    changeInfoMessage("Game OVER! Press A key to start playing");
    currentGuess = 0;
    currentLevel = 1; 
    gameStarted = false;

}