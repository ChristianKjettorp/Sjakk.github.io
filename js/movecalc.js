/**
 * Finds a random move to make
 * @return {string} move to make
 */
var randomMove = function() {
  var possibleMoves = game.moves();
  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};

/**
 * Evaluates current chess board relative to player
 * @param {string} color - Players color, either 'b' or 'w'
 * @return {Number} board value relative to player
 */
var evaluateBoard = function(board, color) {
  var pieceValue = {
    'p': 100,
    'n': 350,
    'b': 350,
    'r': 525,
    'q': 1000,
    'k': 10000
  };

  var value = 0;
  board.forEach(function(row) {
    row.forEach(function(piece) {
      if (piece) {
        // Subtract piece value if it is opponent's piece
        value += pieceValue[piece['type']]
                 * (piece['color'] === color ? 1 : -1);
      }
    });
  });

  return value;
};

/**
 * Calculates the best move looking one move ahead
 * @param {string} playerColor - Players color, either 'b' or 'w'
 * @return {string} the best move
 */
var calcBestMoveOne = function(playerColor) {
  var possibleMoves = game.moves();
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});

  if (game.game_over() === true || possibleMoves.length === 0) return;

  var bestMoveSoFar = null;
  var bestMoveValue = Number.NEGATIVE_INFINITY;
  possibleMoves.forEach(function(move) {
    game.move(move);
    var moveValue = evaluateBoard(game.board(), playerColor);
    if (moveValue > bestMoveValue) {
      bestMoveSoFar = move;
      bestMoveValue = moveValue;
    }
    game.undo();
  });

  return bestMoveSoFar;
}

/**
 * Calculates the best move using Minimax without Alpha Beta Pruning.
 * @param {Number} depth - How many moves ahead to evaluate
 * @param {Object} game - The game to evaluate
 * @param {string} playerColor - Players color, either 'b' or 'w'
 * @param {Boolean} isMaximizingPlayer - If current turn is maximizing or minimizing player
 * @return {Array} The best move value, and the best move
 */
var calcBestMoveNoAB = function(depth, game, playerColor,
                                isMaximizingPlayer=true) {
  if (depth === 0) {
    value = evaluateBoard(game.board(), playerColor);
    return [value, null]
  }

  var bestMove = null; // best move not set yet
  var possibleMoves = game.moves();
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
                                         : Number.POSITIVE_INFINITY;
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    game.move(move);
    value = calcBestMoveNoAB(depth-1, game, playerColor, !isMaximizingPlayer)[0];
    console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
                bestMove, bestMoveValue);

    if (isMaximizingPlayer) {
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
    } else {
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
    }
    game.undo();
  }
  console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue);
  return [bestMoveValue, bestMove || possibleMoves[0]];
}

/**
 * Calculates the best move using Minimax with Alpha Beta Pruning.
 * @param {Number} depth - How many moves ahead to evaluate
 * @param {Object} game - The game to evaluate
 * @param {string} playerColor - Players color, either 'b' or 'w'
 * @param {Number} alpha
 * @param {Number} beta
 * @param {Boolean} isMaximizingPlayer - If current turn is maximizing or minimizing player
 * @return {Array} The best move value, and the best move
 */
var calcBestMove = function(depth, game, playerColor,
                            alpha=Number.NEGATIVE_INFINITY,
                            beta=Number.POSITIVE_INFINITY,
                            isMaximizingPlayer=true) {
  if (depth === 0) {
    value = evaluateBoard(game.board(), playerColor);
    return [value, null]
  }

  var bestMove = null; // best move not set yet
  var possibleMoves = game.moves();
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
                                         : Number.POSITIVE_INFINITY;
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    game.move(move);
    value = calcBestMove(depth-1, game, playerColor, alpha, beta, !isMaximizingPlayer)[0];
    console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
                bestMove, bestMoveValue);

    if (isMaximizingPlayer) {
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
    } else {
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      beta = Math.min(beta, value);
    }
    game.undo();
    if (beta <= alpha) {
      console.log('Prune', alpha, beta);
      break;
    }
  }
  console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
  return [bestMoveValue, bestMove || possibleMoves[0]];
}
