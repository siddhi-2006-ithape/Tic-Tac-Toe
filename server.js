import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "two-player-tic-tac-toe", version: "1.0.0" });
let board = Array(9).fill(null);
let currentPlayer = "X";
let winner = null;
let draw = false;

function outcome(cells) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const winningLine = lines.find(([a,b,c]) => cells[a] && cells[a] === cells[b] && cells[a] === cells[c]);
  return { winner: winningLine ? cells[winningLine[0]] : null, winningLine: winningLine ?? null };
}

function state() {
  return { board: [...board], currentPlayer, winner, draw, status: winner ? `${winner} wins` : draw ? "Draw" : `${currentPlayer}'s turn` };
}

server.registerTool("make_move", {
  title: "Make a move",
  description: "Place the current player's mark in an empty Tic-Tac-Toe cell (numbered 1–9, left to right, top to bottom).",
  inputSchema: { cell: z.number().int().min(1).max(9).describe("Cell number from 1 to 9") }
}, async ({ cell }) => {
  const index = cell - 1;
  if (winner || draw) return { content: [{ type: "text", text: "The game is over. Start a new game to play again." }], isError: true };
  if (board[index]) return { content: [{ type: "text", text: `Cell ${cell} is already occupied.` }], isError: true };
  board[index] = currentPlayer;
  const result = outcome(board);
  winner = result.winner;
  draw = !winner && board.every(Boolean);
  if (!winner && !draw) currentPlayer = currentPlayer === "X" ? "O" : "X";
  const next = state();
  return { content: [{ type: "text", text: JSON.stringify({ ...next, winningLine: result.winningLine }, null, 2) }] };
});

server.registerTool("reset_game", {
  title: "Reset game",
  description: "Clear the board and start a new two-player game with X first.",
  inputSchema: {}
}, async () => {
  board = Array(9).fill(null); currentPlayer = "X"; winner = null; draw = false;
  return { content: [{ type: "text", text: JSON.stringify(state(), null, 2) }] };
});

server.registerResource("game-state", "tictactoe://game/state", {
  title: "Current Tic-Tac-Toe game state",
  description: "The current board, player to move, and game result.",
  mimeType: "application/json"
}, async uri => ({ contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(state(), null, 2) }] }));

server.registerPrompt("play-tic-tac-toe", {
  title: "Play Tic-Tac-Toe",
  description: "Guide two people through a Tic-Tac-Toe game using the game tools.",
  argsSchema: {}
}, async () => ({ messages: [{ role: "user", content: { type: "text", text: "Play a two-player Tic-Tac-Toe game. Show the board after each move, use make_move for moves, and announce the winner or draw. Ask which player wants X to start." } }] }));

await server.connect(new StdioServerTransport());
