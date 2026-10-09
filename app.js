const boardEl = document.querySelector('#board');
const statusEl = document.querySelector('#status-text');
const turnDot = document.querySelector('#turn-dot');
const cells = Array(9).fill(null);
const wins = { X: 0, O: 0 };
let player = 'X';
let finished = false;
const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const names = { X: 'Player 1', O: 'Player 2' };

function render() {
  boardEl.replaceChildren();
  cells.forEach((mark, index) => {
    const button = document.createElement('button');
    button.className = `cell${mark ? ` mark-${mark.toLowerCase()}` : ''}`;
    button.type = 'button';
    button.setAttribute('role', 'gridcell');
    button.setAttribute('aria-label', `Cell ${index + 1}${mark ? `, ${mark}` : ', empty'}`);
    button.textContent = mark === 'X' ? '×' : mark === 'O' ? '○' : '';
    button.disabled = Boolean(mark) || finished;
    button.addEventListener('click', () => move(index));
    boardEl.append(button);
  });
  document.querySelector('#score-x').classList.toggle('active', !finished && player === 'X');
  document.querySelector('#score-o').classList.toggle('active', !finished && player === 'O');
  turnDot.style.background = player === 'X' ? '#5873d5' : '#ed786c';
}

function move(index) {
  if (finished || cells[index]) return;
  cells[index] = player;
  const line = lines.find(([a,b,c]) => cells[a] && cells[a] === cells[b] && cells[a] === cells[c]);
  if (line) {
    finished = true;
    wins[player]++;
    document.querySelector(`#wins-${player.toLowerCase()}`).textContent = wins[player];
    statusEl.textContent = `${names[player]} wins!`;
    render();
    line.forEach(i => boardEl.children[i].classList.add('win'));
    return;
  }
  if (cells.every(Boolean)) {
    finished = true;
    statusEl.textContent = "It's a draw!";
    render();
    return;
  }
  player = player === 'X' ? 'O' : 'X';
  statusEl.textContent = `${names[player]}'s turn`;
  render();
}

function newGame() {
  cells.fill(null);
  player = 'X';
  finished = false;
  statusEl.textContent = `${names[player]}'s turn`;
  render();
}

document.querySelector('#new-game').addEventListener('click', newGame);
document.querySelector('#reset-score').addEventListener('click', () => {
  wins.X = 0; wins.O = 0;
  document.querySelector('#wins-x').textContent = '0';
  document.querySelector('#wins-o').textContent = '0';
  newGame();
});
render();
