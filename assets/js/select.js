const user = {
  color: EMPTY,
  focus: {
    coord: [7, 7],
    set() {
      //user.focus.set
      let board = game.getCanvas(),
          ctx = board.ctx,
          x = board.padding + board.blockWidth * user.focus.coord[0],
          y = board.padding + board.blockWidth * user.focus.coord[1],
          r = board.width / 35;

      game.stone.update();
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#fa6060';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.moveTo(x - board.blockWidth/1.5, y);
      ctx.lineTo(x + board.blockWidth/1.5, y);
      ctx.moveTo(x, y - board.blockWidth/1.5);
      ctx.lineTo(x, y + board.blockWidth/1.5);
      ctx.stroke();
    }
  },

  set() {
    //user.set
    const AI_COLOR = (user.color == BLACK)? WHITE : BLACK;

    if (!user.color || game.stone.isStone(...user.focus.coord)) return;

    game.stone.set(user.color, ...user.focus.coord);
    game.stone.set(AI_COLOR, ...AI(AI_COLOR, game.stone.list));
    user.focus.set();

    let winner = game.checkWin();
    if (winner) {
      setTimeout(() => {
        alert("당신의 " + ((winner == user.color)? "승리":"패배") + "입니다.");
      }, 100);
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  user.focus.set();

  $('#set-btn').addEventListener('click', user.set, false);

  function initGame(userColor) {
    user.color = userColor;
    $('#game-explain').style.display = 'block';
    $('#stone-color-select').style.display = 'none';
    $('#control-keys').style.display = 'grid';
  }

  $('#select-white').addEventListener('click', () => {
    initGame(WHITE);
    game.stone.set(BLACK, ...AI(BLACK, game.stone.list));
    user.focus.set();
  }, false);

  $('#select-black').addEventListener('click', () => {
    initGame(BLACK);
  }, false);

  function checkFocus() {
    if (user.focus.coord[1] < 0) user.focus.coord[1] = 0;
    if (user.focus.coord[0] < 0) user.focus.coord[0] = 0;
    if (user.focus.coord[1] > 14) user.focus.coord[1] = 14;
    if (user.focus.coord[0] > 14) user.focus.coord[0] = 14;
    user.focus.set();
  }

  $('#move-up-btn').addEventListener('click', () => {
    user.focus.coord[1]--;
    checkFocus();
  }, false);

  $('#move-down-btn').addEventListener('click', () => {
    user.focus.coord[1]++;
    checkFocus();
  }, false);

  $('#move-left-btn').addEventListener('click', () => {
    user.focus.coord[0]--;
    checkFocus();
  }, false);

  $('#move-right-btn').addEventListener('click', () => {
    user.focus.coord[0]++;
    checkFocus();
  }, false);

  window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowDown':
        user.focus.coord[1]++;
        break;
      case 'ArrowUp':
        user.focus.coord[1]--;
        break;
      case 'ArrowLeft':
        user.focus.coord[0]--;
        break;
      case 'ArrowRight':
        user.focus.coord[0]++;
        break;
      case ' ':
      case 'Enter':
        user.set();
        break;
      default:
        return;
    }
    checkFocus();
  }, false);
}, false);
