import mongoose, { Document, Schema } from "mongoose";

export interface GameSession extends Document {
  gameId: string;
  results: { playerId: string; score: number }[];
}

const GameSessionSchema: Schema = new Schema({
  gameId: { type: String, required: true },
  results: [
    {
      playerId: { type: String, required: true },
      score: { type: Number, required: true },
    },
  ],
});

export const GameSession = mongoose.model<GameSession>(
  "GameSession",
  GameSessionSchema
);
