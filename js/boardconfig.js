var board,
    game = new Chess();
var onMoveEnd = function(oldPos, newPos) {
  if (game.game_over() === true) {
    alert('Game Over');
    console.log('Game Over');
  }
  console.log(game.fen());
};
var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true || piece.search(/^b/) !== -1) {
    return false;
  }
};
var onSnapEnd = function() {
  board.position(game.fen());
};
var cfg = {
  draggable: true,
  position: 'start',
  onMoveEnd: onMoveEnd,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = ChessBoard('board', cfg);
