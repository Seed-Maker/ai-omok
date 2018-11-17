/*
  게임의 내부적인 작동을 위한 스크립트.
*/
var game = {};

//편의를 위해 빈칸은 0, 흰색은 1, 검은색은 2로 취급한다.
const EMPTY = 0,
      WHITE = 1,
      BLACK = 2;

//캔버스 요소를 사용하기 편한 형태로 리턴하는 함수.
game.getCanvas = function () {
  let board = document.getElementById('board');
  if (!board) return {elem:null};
  return {
    elem: board,
    ctx: board.getContext('2d'),
    width: board.width,
    height: board.height,
    padding: board.width/25,
    blockWidth: (board.width - board.width*2/25)/14
  };
}

//바둑돌 객체.
game.stone = {};

//바둑돌의 위치를 담을 2차원 배열.
game.stone.list = [];

//바둑돌들의 위치를 모두 초기화할 함수.
game.stone.reset = function () {
  for (let i = 0; i < 15; i++) {
    game.stone.list[i] = [];
    for (let j = 0; j < 15; j++)
      game.stone.list[i][j] = EMPTY;
  }
}

//바둑돌들의 위치를 모두 초기화한다.
game.stone.reset();

//x, y좌표에 착수하는 함수.
game.stone.set = function (color, x, y) {
  if (game.checkWin() || !game.getCanvas().elem) return;

  game.stone.list[x][y] = color;
  game.stone.update();
}

//저장된 바둑돌에 위치에 따라 캔버스를 다시 그려내는 함수.
game.stone.update = function () {
  let board = game.getCanvas(),
      ctx = board.ctx,
      r = board.width / 35,
      color,
      x, y;

  game.drawBoard();/*drawBoard함수는 drawBoard.js에서 정의된다.*/
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (!game.stone.list[i][j]) continue;

      color = game.stone.list[i][j];

      x = board.padding + board.blockWidth * i;
      y = board.padding + board.blockWidth * j;

      ctx.fillStyle = (color == WHITE)? "white" : "black";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();

      ctx.lineWidth = 5;
      ctx.strokeStyle = '#808080';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}

//x,y 좌표에 돌이 존재하는지 불리언값으로 리턴하는 함수.
game.stone.isStone = function (x, y) {
  return !!game.stone.list[x][y];
}

//해당 시점에 승리한 돌의 색을 리턴. 없으면 EMPTY리턴하는 함수.
game.checkWin = function () {
  /*
    모든 돌 (stone.list[x][y])의 색이 x 축 또는 y 축 또는 대각선으로
    같은 색 5개가 동일하게 놓여있다면 승리다.
  */
  let color, x, y, k, l;
  for (x = 0; x < 15; x++) {
    for (y = 0; y < 15; y++) {
      if (!game.stone.list[x][y]) continue;
      for (l = -1; l < 2; l++) {
        color = game.stone.list[x][y];
        for (k = 0; k < 5; k++) {
          if (!game.stone.list[x+k] || color != game.stone.list[x+k][y+k*l]) {
            color = EMPTY;
            break;
          }
        }
        if (color) return color;
      }
      color = game.stone.list[x][y];
      for (k = 0; k < 5; k++) {
        if (color != game.stone.list[x][y+k]) {
          color = EMPTY;
          break;
        }
      }
      if (color) return color;
    }
  }

  return EMPTY;
}

//AI의 테스트를 위해, AI vs AI 대결을 시키는 함수.
game.AIvsAI = async function () {
  game.stone.reset();
  let i = 0;
  while (!game.checkWin()) {
    await new Promise(resolve =>  {
      setTimeout(resolve, 50);
    });
    game.stone.set(i + 1, ...AI(i + 1, game.stone.list));
    i = 1 - i;
  }
}
