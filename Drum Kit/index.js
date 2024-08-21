for(x of document.querySelectorAll(".drum")){
    x.addEventListener("click", handleClick);
    
    
}

document.addEventListener("keypress", handleKeyPress);

function playCrash(){
    var audio = new Audio('./sounds/crash.mp3');
    audio.play();
}

function playKick(){
    var audio = new Audio('./sounds/kick-bass.mp3');
    audio.play();
}

function playSnare(){
    var audio = new Audio('./sounds/snare.mp3');
    audio.play();
}

function playTom(id){
    var audio = new Audio("./sounds/tom-"+id+".mp3");
    audio.play();
}

function addPressed(){

}

function handleKeyPress(ev) {
    var key = ev.key;
    button = document.querySelector("."+key);
    switch(key){
        case "w":
            playTom(1);
            break;
        case "a":
            playTom(2);
            break;
        case "s":
            playTom(3);
            break;
        case "d":
            playTom(4);
            break;
        case "j":
            playKick();
            break;
        case "k":
            playSnare();
            break;
        case "l":
            playCrash();
            break;
        default:
            break;
    }
    button && button.classList.add("pressed");
    button && setTimeout(()=> button.classList.remove("pressed"), 100);
}


function handleClick(event){
    handleKeyPress({key: event.target.classList[0]});
}