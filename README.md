# Tic-Tac-Toe for two

A small, responsive, local two-player Tic-Tac-Toe game. Players take turns on the same device. The browser game works without installing anything; scores stay in the page until it is closed.

## Play

Open `index.html` in a browser. Select a square to place your mark. Use **New game** to replay or **Reset score** to clear the match score.

## MCP server

The project also includes a Model Context Protocol server exposing the game as tools, a resource, and a prompt:

- `make_move` places the current mark in a cell numbered 1–9.
- `reset_game` starts a fresh game.
- `tictactoe://game/state` provides the current board and status.
- `play-tic-tac-toe` provides a prompt for an assistant to host a two-player game.

Run `npm install`, then configure your MCP client to launch `node` with the full path to `server.js` as its argument. The MCP server uses standard input/output transport. Its game state is held in memory for that server process. The browser interface is a standalone local game and does not connect to the MCP server.
