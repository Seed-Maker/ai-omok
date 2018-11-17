/*
  사용자가 바둑판에서 자신이 원하는 위치에 착수하도록 하는 스크립트.
  PC의 경우 hover, Mobile의 경우 Touch 이벤트를 사용한다.
*/

function setDisplayHowTo(property) {
  $('#how-to-play').style.display = property;
}

var user = {};

//사용자가 착수를 원하는 지점을 정하도록 도울 것들의 객체.
user.focus = {};

//사용자가 착수를 원하는 지점의 좌표.
user.focus.coord = [7, 7];

//사용자가 착수를 원하는 지점을 화면에 표시해줄 함수.
user.focus.set = function () {
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

//사용자가 플레이중인 색.
user.color = EMPTY;

//사용자가 착수를 원한 지점에 착수하는 함수.
user.set = function () {
  let AIcolor = (user.color == BLACK)? WHITE : BLACK,
      winner;

  if (!user.color || game.stone.isStone(...user.focus.coord)) return;

  game.stone.set(user.color, ...user.focus.coord);
  game.stone.set(AIcolor, ...AI(AIcolor, game.stone.list));
  user.focus.set();

  winner = game.checkWin();
  if (winner) {
    //alert함수가 종료되기 전까지 바둑판이 업데이트 되지 않는 문제가 있어서 0.1초후에
    //승리 판정 메시지를 띄운다.
    setTimeout(function () {
      alert("당신의 " + ((winner == user.color)? "승리":"패배") + "입니다.");
    }, 100);
  }
}

window.addEventListener('DOMContentLoaded', function () {
  let form = $('#stone-color-select'),
      ternAlert = $('#turn-alert');

  //착수 지점을 7,7로 초기화한다.
  user.focus.set(7,7);

  //착수 버튼에 클릭이벤트로 user.set을 부여한다.
  $('#set-btn').addEventListener('click', user.set, false);

  $('#select-white').addEventListener('click', function () {
    user.color = WHITE;
    form.style.display = 'none';
    ternAlert.style.display = 'block';
    game.stone.set(BLACK, ...AI(BLACK, game.stone.list));
    user.focus.set();
  }, false);

  $('#select-black').addEventListener('click', function () {
    user.color = BLACK;
    form.style.display = 'none';
    ternAlert.style.display = 'block';
  }, false);

  function check() {
    if (user.focus.coord[1] < 0) user.focus.coord[1] = 0;
    if (user.focus.coord[0] < 0) user.focus.coord[0] = 0;
    if (user.focus.coord[1] > 14) user.focus.coord[1] = 14;
    if (user.focus.coord[0] > 14) user.focus.coord[0] = 14;
    user.focus.set();
  }

  $('#move-up-btn').addEventListener('click', function () {
    user.focus.coord[1]--;
    check();
  }, false);

  $('#move-down-btn').addEventListener('click', function () {
    user.focus.coord[1]++;
    check();
  }, false);

  $('#move-left-btn').addEventListener('click', function () {
    user.focus.coord[0]--;
    check();
  }, false);

  $('#move-right-btn').addEventListener('click', function () {
    user.focus.coord[0]++;
    check();
  }, false);
}, false);

window.addEventListener('keydown', function (e) {
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
  if (user.focus.coord[1] < 0) user.focus.coord[1] = 0;
  if (user.focus.coord[0] < 0) user.focus.coord[0] = 0;
  if (user.focus.coord[1] > 14) user.focus.coord[1] = 14;
  if (user.focus.coord[0] > 14) user.focus.coord[0] = 14;
  user.focus.set();
}, false);
