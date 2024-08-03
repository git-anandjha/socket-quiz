/* eslint-disable no-plusplus */
import WebSocket, { Server, Data } from "ws";
import { v4 as uuidv4 } from "uuid";
import { GameSession } from "@database/model/game-session.model";
import { SOCKET_PORT } from "@config/secret";
import logger from "@util/logger";
import createError from "http-errors";

const wss: Server = new WebSocket.Server({ port: Number(SOCKET_PORT) });

interface Player {
  id: string;
  socket: WebSocket;
}

interface Game {
  id: string;
  players: Player[];
  questions: any;
  currentQuestionIndex: number;
  scores: { [key: string]: number };
}

interface IncomingMessage {
  type: string;
  gameId?: string;
  playerId?: string;
  answer?: string;
}

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    question: "What is the capital of Germany?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Berlin",
  },
  {
    question: "What is the capital of Spain?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Madrid",
  },
  {
    question: "What is the capital of England?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "London",
  },
  {
    question: "What is the capital of Italy?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Rome",
  },
  {
    question: "What is the capital of India?",
    options: ["Paris", "London", "Berlin", "New Delhi"],
    correctAnswer: "New Delhi",
  },
];

let currentQuestion: {
  question: string;
  options: string[];
  correctAnswer: string;
  index: number;
};

const games: { [key: string]: Game } = {};

async function startGame(ws: WebSocket, data: IncomingMessage): Promise<void> {
  let gameId: string;
  let game: Game;

  if (data?.gameId && games[data.gameId]) {
    gameId = data.gameId;
    game = games[gameId];
    if (game.players.length === 1) {
      game.players.push({ id: data.playerId ?? "", socket: ws });
      ws.send(JSON.stringify({ type: "game:init", gameId }));
    }
  } else {
    gameId = uuidv4();
    game = {
      id: gameId,
      players: [{ id: data.playerId ?? "", socket: ws }],
      questions,
      currentQuestionIndex: 0,
      scores: {},
    };
    games[gameId] = game;
  }
  logger.info(`Game started with id: ${games}`);
  ws.send(JSON.stringify({ type: "game:init", gameId }));
}

function endGame(gameId: string): void {
  const game: Game = games[gameId];
  const results = Object.keys(game.scores).map((playerId) => ({
    playerId,
    score: game.scores[playerId],
    winner: `${
      game.scores[playerId] === Math.max(...Object.values(game.scores))
    } is the winner`,
  }));
  game.players.forEach((player) => {
    player.socket.send(JSON.stringify({ type: "game:end", results }));
  });
  const gameSession = new GameSession({
    gameId: game.id,
    results,
  });
  gameSession.save();
}

// function to queue the questions for the game send the questions every 10 seconds
export async function sendFirstQuestion(gameId: string): Promise<void> {
  const game: Game = games[gameId];
  if (!game) {
    throw new createError.BadRequest("Game not found");
  }
  [currentQuestion] = game.questions;
  currentQuestion.index = 0;
  game.players.forEach((player) => {
    player.socket.send(
      JSON.stringify({
        type: "question:send",
        question: currentQuestion.question,
        options: currentQuestion.options,
      })
    );
  });
}

function sendNextQuestion(gameId: string): void {
  const game: Game = games[gameId];
  currentQuestion.index += 1;
  currentQuestion = {
    ...questions[currentQuestion.index],
    index: currentQuestion.index,
  };
  logger.info(`Sending question ${currentQuestion.index + 1}`);
  game.players.forEach((player) => {
    player.socket.send(
      JSON.stringify({
        type: "question:send",
        question: currentQuestion.question,
        options: currentQuestion.options,
      })
    );
  });
  if (currentQuestion.index === questions.length) {
    endGame(gameId);
  }
}

function submitAnswer(gameId: string, playerId: string, answer: string): void {
  const game: Game = games[gameId];
  if (currentQuestion.correctAnswer === answer) {
    game.scores[playerId] = (game.scores[playerId] || 0) + 1;
  }
  logger.info(JSON.stringify(game));
  sendNextQuestion(gameId);
}

wss.on("connection", (ws: WebSocket) => {
  logger.info("New Player connected");
  ws.on("message", async (message: Data) => {
    // validate every request and send the response
    const data: IncomingMessage = JSON.parse(message.toString());
    switch (data.type) {
      case "game:start":
        await startGame(ws, data);
        break;
      case "answer:submit":
        if (data.gameId && data.playerId && data.answer) {
          logger.info(`Answer submitted by ${data.playerId}`);
          submitAnswer(data.gameId, data.playerId, data.answer);
        }
        break;
      default:
        break;
    }
  });
});
