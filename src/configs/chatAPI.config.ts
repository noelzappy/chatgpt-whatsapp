const process = require("process");
import { ChatGPTAPI } from "chatgpt";

// Environment variables
require("dotenv").config();

// ChatGPT Client
export const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
});
