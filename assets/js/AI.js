/*
  오목 알고리즘 0.1

  = 여러 절차에 의해 각 칸마다 고유한 "우선도"를 지니게 된다.
  = 그 우선도가 가장 높은 칸에 착수하도록 하는 방식이다.
  = 만약 최고 우선도인 칸이 여러개일 경우, 무작위로 하나가 선택된다.
*/

//오목판의 오목돌들이 정의된 2차원 배열을 인자로 필요로 한다.
function AI(color, blocks) {
  //편의를 위해 빈칸은 0, 흰색은 1, 검은색은 2로 취급한다.
  const EMPTY = 0,
        WHITE = 1,
        BLACK = 2;

  let blockAmount = 0,
      priority = [],
      max = -Infinity,
      maxCoords = [],
      i, j;

  //15*15인 2차원 배열을 생성한다.
  for (i = 0; i < 15; i++) {
    priority[i] = [];
    for (j = 0; j < 15; j++)
      priority[i][j] = 0;
  }

  //이미 돌이 놓인 곳의 우선도를 3000만큼 낮춘다.
  for (j = 0; j < 15; j++)
    for (i = 0; i < 15; i++)
      if (blocks[i][j]) {
        blockAmount++;
        priority[i][j] -= 3000;
      }

  if (blockAmount >= 15 * 15) {
    alert("오목판이 모두 차서 AI가 선택할 수 없습니다.");
    throw new Error("Block exceeded");
  }

  //놓인 돌이 없거나 1개이면 바둑판 중앙의 우선도를 1000만큼 높힌다.
  if (blockAmount < 2)
    priority[7][7] += 1000;

  //모든 돌의 8방향에 우선도를 1만큼 높힌다.
  for (i = 0; i < 15; i++) {
    for (j = 0; j < 15; j++) {
      if (blocks[i][j]) {
        if (i) priority[i - 1][j]++;
        if (i != 14) priority[i + 1][j]++;
        if (j) priority[i][j - 1]++;
        if (j != 14) priority[i][j + 1]++;
        if (i * j) priority[i - 1][j - 1]++;
        if (i != 14 && j) priority[i + 1][j - 1]++;
        if (i && j != 14) priority[i - 1][j + 1]++;
        if (i != 14 && j != 14) priority[i + 1][j + 1]++;
      }
    }
  }

  //우선도가 가장 높은 것들을 찾고, 그중 하나를 무작위로 선택, 반환한다.
  for (j = 0; j < 15; j++) {
    for (i = 0; i < 15; i++) {
      if (max < priority[i][j]) {
        max = priority[i][j];
        maxCoords.length = 0;
      }
      if (max <= priority[i][j]) {
        maxCoords.push([i,j]);
      }
    }
  }

  const key = Math.floor(maxCoords.length * Math.random());

  return maxCoords[key];
}
