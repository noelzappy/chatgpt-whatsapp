const stringSimilarity = require("string-similarity");
import { Message } from "whatsapp-web.js";
import data from "../../data.json";
import Logger from "../utils/logger.util";

export const personalMessageHandler = async (
  message: Message,
  prompt: string
) => {
  const wordMatch = {
    index: -1,
    value: 0,
  };

  data.forEach((res: any, index: number) => {
    const { question } = res;
    const similarity = stringSimilarity.compareTwoStrings(question, prompt);

    if (similarity > wordMatch.value) {
      wordMatch.index = index;
      wordMatch.value = similarity;
    }
  });

  if (wordMatch.value > 0.7) {
    const dataMessage = data[wordMatch.index];

    const { answers } = dataMessage;
    const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

    Logger.info(`Answer to ${message.from}: ${randomAnswer}`);

    message.reply(randomAnswer);
    return true;
  }

  return false;
};
