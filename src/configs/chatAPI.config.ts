const process = require("process");
import { ChatGPTAPIBrowser } from "chatgpt";

// Environment variables
require("dotenv").config();

// ChatGPT Client
export const api = new ChatGPTAPIBrowser({
  email: process.env.OPENAI_EMAIL,
  password: process.env.OPENAI_PASSWORD,
  isGoogleLogin: true,
  minimize: true,
  debug: false,
  executablePath: process.env.CHROMIUM_PATH,
});
