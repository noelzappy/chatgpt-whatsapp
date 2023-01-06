const stringSimilarity = require("string-similarity");
import { APP_NAME } from "..";
import { api } from "../configs/chatAPI.config";
import data from "../../data.json";
import {
  getMessagesOfSender,
  saveConversation,
  updateSingleMessageFromSender,
} from "../services/messages.service";
import { ChatResponse } from "chatgpt";

const personalMessageHandler = async (message: any, prompt: any) => {
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

    console.log(`[${APP_NAME}] Answer to ${message.from}: ${randomAnswer}`);

    message.reply(randomAnswer);
    return true;
  }

  return false;
};

export const handler = async (message: any, prompt: any) => {
  try {
    const start = Date.now();

    console.log(
      `[${APP_NAME}] Received prompt from ` + message.from + ": " + prompt
    );

    const isHandled = await personalMessageHandler(message, prompt);

    if (isHandled) return;

    const prevConversation: any = await getMessagesOfSender(message.from); // Get the previous conversation of the sender

    let chatOptions = {};
    let hasPreviousConversation = false;
    if (prevConversation && prevConversation.length > 0) {
      hasPreviousConversation = true;
      chatOptions = {
        conversationId: prevConversation[0].conversation_id,
        parentMessageId: prevConversation[0].message_id,
      };
    }

    let response: ChatResponse;

    if (hasPreviousConversation) {
      response = await api.sendMessage(prompt, chatOptions);
    } else {
      response = await api.sendMessage(prompt);
    }

    // const response: ChatResponse = await api.sendMessage(prompt, chatOptions);
    // const response = {
    //   response: "Hello! How can I help you today?",
    //   conversationId: "78fc8514-a465-4f25-a410-f41f5245c235" + Math.random(),
    //   messageId: "deefbd36-71df-46a4-a0b7-1d496ef206bf" + Math.random(),
    // };

    if (!hasPreviousConversation) {
      // Save the conversation
      const conversation = {
        last_message: prompt,
        message_id: response.messageId,
        conversation_id: response.conversationId,
        sender_id: message.from,
        last_response: response.response,
        last_message_timestamp: new Date().toISOString(),
      };
      await saveConversation(conversation);
    } else {
      // Update the conversation
      await updateSingleMessageFromSender(
        message.from,
        prompt,
        response.response,
        new Date().toISOString()
      );
    }

    console.log(
      `[${APP_NAME}] Answer to ${message.from}: ${response.response}`
    );

    const end = Date.now() - start;

    console.log(`[${APP_NAME}] ChatGPT took ` + end + "ms");

    message.reply(response.response);
  } catch (error: any) {
    console.error(
      `[${APP_NAME}] Failed to send message to ChatGPT API: ` + error
    );
    // message.reply("I'm sorry, I'm not available at the moment to reply. I will as soon as possible.")
  }
};
