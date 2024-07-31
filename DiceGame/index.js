function diceHTMLString(value) {
  var diceFaces = [
    '<div class="dice first-face"><span class="pip"></span></div>',
    '<div class="dice second-face"><span class="pip"></span><span class="pip"></span></div>',
    '<div class="dice third-face"><span class="pip"></span><span class="pip"></span><span class="pip"></span></div>',
    '<div class="dice fourth-face"><div class="column"><span class="pip"></span><span class="pip"></span></div><div class="column"><span class="pip"></span><span class="pip"></span></div></div>',
    '<div class="dice fifth-face"><div class="column"><span class="pip"></span><span class="pip"></span></div><div class="column"><span class="pip"></span></div><div class="column"><span class="pip"></span><span class="pip"></span></div></div>',
    '<div class="dice sixth-face"><div class="column"><span class="pip"></span><span class="pip"></span><span class="pip"></span></div><div class="column"><span class="pip"></span><span class="pip"></span><span class="pip"></span></div></div>',
  ];
  return diceFaces[value];
}

function showDice(id, value) {
  var diceElement = document.querySelector("#" + id);
  diceElement.innerHTML = diceHTMLString(value);
}

var player1Draw = Math.floor(Math.random() * 6);
var player2Draw = Math.floor(Math.random() * 6);

showDice("dice1", player1Draw);
showDice("dice2", player2Draw);

var winnerElement = document.querySelector("#result");

var result = "";
if (player1Draw === player2Draw) {
  result = "It's a tie!";
  document.querySelector("#player1").classList.remove("blink-me-faster");
  document.querySelector("#player2").classList.remove("blink-me-faster");
} else if (player1Draw > player2Draw) {
  result = "Player 1 wins!";
  document.querySelector("#player1").classList.add("blink-me-faster");
} else {
  document.querySelector("#player2").classList.add("blink-me-faster");
  result = "Player 2 wins!";
}
winnerElement.innerHTML = result;
