import { APP_NAME } from "../configs/constants.config";
import { api } from "../configs/chatAPI.config";
import {
  getMessagesOfSender,
  saveConversation,
  updateSingleMessageFromSender,
} from "../services/data.service";
import { ChatResponse, SendMessageOptions } from "chatgpt";
import DataModel from "../models/data.model";
import { Message } from "whatsapp-web.js";
import { personalMessageHandler } from "src/services/message.service";
import { prefix } from "../configs/constants.config";
import Logger from "../utils/logger.util";

export const handler = async (message: Message, p: any) => {
  try {
    const start = Date.now();

    const messagePrefix = message.body.split(" ")[0];

    const isPrefix = prefix.includes(messagePrefix);

    const prompt = message.body.replace(messagePrefix, "");

    if (!isPrefix) return;

    Logger.info(`Received prompt from ${message.from}: ${prompt}`);

    // Check if the message is a personal message or not and handles it
    const isHandled = await personalMessageHandler(message, prompt);
    if (isHandled) return;

    // Get previous conversations
    const prevConversation: any = await getMessagesOfSender(message.from);

    let chatOptions: SendMessageOptions = null;
    let hasPreviousConversation: boolean = false;

    if (prevConversation && prevConversation.length > 0) {
      hasPreviousConversation = true;
      chatOptions = {
        conversationId: prevConversation[0].conversation_id,
        parentMessageId: prevConversation[0].parent_message_id,
        action: "next",
      };
    }

    let response: ChatResponse;

    if (hasPreviousConversation || chatOptions) {
      response = await api.sendMessage(prompt, chatOptions);
    }

    if (!hasPreviousConversation || !chatOptions) {
      response = await api.sendMessage(prompt);
    }

    if (!hasPreviousConversation) {
      // Save the conversation
      const conversation: DataModel = {
        last_message: prompt,
        message_id: response.messageId,
        conversation_id: response.conversationId,
        sender_id: message.from,
        last_response: response.response,
        last_message_timestamp: new Date().toISOString(),
        parent_message_id: response.messageId,
      };
      await saveConversation(conversation);
    } else {
      // Update the conversation
      await updateSingleMessageFromSender(
        message.from,
        prompt,
        response.response,
        response.messageId,
        new Date().toISOString()
      );
    }

    Logger.info(`Answer to ${message.from}: ${response.response}`);

    message.reply(response.response);

    const end = Date.now() - start;

    Logger.info(`ChatGPT took ` + end + "ms");
  } catch (error: any) {
    Logger.error(`Failed to send message to ChatGPT API: ` + error);
    // message.reply("I'm sorry, I'm not available at the moment to reply. I will as soon as possible.")
  }
};
