var makeMove = function(algo, skill=3) {
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
  if (algo === 1) {
    var move = randomMove();
  } else if (algo === 2) {
    var move = calcBestMoveOne(game.turn());
  } else if (algo === 3) {
    var move = calcBestMoveNoAB(skill, game, game.turn())[1];
  } else {
    var move = calcBestMove(skill, game, game.turn())[1];
  }
  game.move(move);
  board.position(game.fen());
}

var playGame = function(algo=4, skillW=2, skillB=2) {
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
  var skill = game.turn() === 'w' ? skillW : skillB;
  makeMove(algo, skill);
  window.setTimeout(function() {
    playGame(algo, skillW, skillB);
  }, 250);
};

var onDrop = function(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' 
  });

  if (move === null) return 'snapback';

  console.log(move)

  window.setTimeout(function() {
    makeMove(4, 3);
  }, 250);
};
