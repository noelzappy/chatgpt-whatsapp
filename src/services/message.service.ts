const stringSimilarity = require("string-similarity");
import { ChatResponse } from "chatgpt";
import { api } from "../configs/chatAPI.config";
import { Message } from "whatsapp-web.js";
import Logger from "../utils/logger.util";
import { wClient as client } from "../configs/wClient.config";
import { timer } from "../utils/timer.util";

import responses from "../data/responses.json";
import recipients from "../data/recipients.json";

export const personalMessageHandler = async (
  message: Message,
  prompt: string
) => {
  const wordMatch = {
    index: -1,
    value: 0,
  };

  responses.forEach((res: any, index: number) => {
    const { question } = res;
    const similarity = stringSimilarity.compareTwoStrings(question, prompt);

    if (similarity > wordMatch.value) {
      wordMatch.index = index;
      wordMatch.value = similarity;
    }
  });

  if (wordMatch.value > 0.5) {
    const dataMessage = responses[wordMatch.index];

    const { answers } = dataMessage;
    const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

    Logger.info(`Answer to ${message.from}: ${randomAnswer}`);

    message.reply(randomAnswer);
    return true;
  }

  return false;
};

export const sendMorningGreetings = async () => {
  try {
    for (const recipient of recipients) {
      const phone = recipient.phone + "@c.us";

      // Ask ChatGPT for a greeting based on the recipient's relationship
      const prompt = `Give a sweet good morning text to send my ${recipient.relationship}. It should be 10 words or less.`;
      const response: ChatResponse = await api.sendMessage(prompt);

      // replace all quotation marks with nothing
      const message = response.response.replace(/"/g, "");

      // Send the greeting to the recipient
      client.sendMessage(phone, message);

      await timer(10000);
    }
  } catch (error: any) {
    Logger.error(`Error sending morning greetings: ` + error);
  }
};
