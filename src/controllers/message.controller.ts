import { api } from "../configs/chatAPI.config";
import {
  getMessagesOfSender,
  saveConversation,
  updateSingleMessageFromSender,
} from "../services/data.service";
import { SendMessageOptions } from "chatgpt";
import DataModel from "../models/data.model";
import { Message } from "whatsapp-web.js";
import { personalMessageHandler } from "src/services/message.service";
import Logger from "../utils/logger.util";
import { getPrefix } from "../utils/prefix.util";
import Prefix from "../models/prefix.model";

export const handler = async (message: Message, p: any) => {
  try {
    const start = Date.now();

    const prefix: Prefix = getPrefix(message.body);

    const prompt = prefix.message;

    if (!prefix.isPrefix) return;

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
      };
    }

    let response: any;

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
        message_id: response.id,
        conversation_id: response.conversationId,
        sender_id: message.from,
        last_response: response.text,
        last_message_timestamp: new Date().toISOString(),
        parent_message_id: response.parentMessageId,
      };
      await saveConversation(conversation);
    } else {
      // Update the conversation
      await updateSingleMessageFromSender(
        message.from,
        prompt,
        response.text,
        response.id,
        new Date().toISOString()
      );
    }

    Logger.info(`Answer to ${message.from}: ${response.text}`);

    message.reply(response.text);

    const end = Date.now() - start;

    Logger.info(`ChatGPT took ` + end + "ms");
  } catch (error: any) {
    Logger.error(`Failed to send message to ChatGPT API: ` + error);

    const sendErrorResponse = JSON.stringify(error).includes(
      "429" || "SQLITE" || "ECONNRESET"
    );
    if (sendErrorResponse) {
      message.reply(
        "I'm sorry, I'm not available at the moment to reply. Please try again after an hour."
      );
    }
  }
};
