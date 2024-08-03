/* eslint-disable import/no-import-module-exports */
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
});
export const User = mongoose.model("User", UserSchema);
