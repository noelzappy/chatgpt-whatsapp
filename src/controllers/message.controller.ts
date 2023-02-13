import { api } from "../configs/chatAPI.config";
import {
  getMessagesOfSender,
  saveConversation,
  updateSingleMessageFromSender,
} from "../services/data.service";
import { SendMessageOptions } from "chatgpt";
import DataModel from "../models/data.model";
import { Chat, Message } from "whatsapp-web.js";
import { personalMessageHandler } from "src/services/message.service";
import Logger from "../utils/logger.util";
import { getPrefix } from "../utils/prefix.util";
import Prefix from "../models/prefix.model";
import { countWords } from "../utils/misc";

export const handler = async (message: Message, p: any) => {
  try {
    const start = Date.now();

    const chat: Chat = await message.getChat();

    const prefix: Prefix = getPrefix(message.body);

    const prompt = prefix.message.trim();

    if (!prefix.isPrefix && chat.isGroup) return;

    chat.sendStateTyping();

    Logger.info(`Received prompt from ${message.from}: ${prompt}`);

    // Check if the message is a personal message or not and handles it
    const isHandled = await personalMessageHandler(message, prompt);
    if (isHandled) return;

    const promptLength = countWords(prompt);
    if (promptLength > 50) {
      return message.reply(
        "MAXIMUM OF 10 WORDS PER MESSAGE ONLY.\nFor longer messages please visit \nhttps://chat.openai.com/ \nOr contact Zappy for a custom solution."
      );
    }

    // Get previous conversations
    const prevConversation: any = await getMessagesOfSender(message.from);

    let chatOptions: SendMessageOptions = null;
    let hasPreviousConversation: boolean = false;

    if (prevConversation && prevConversation.length > 0) {
      const conversation = prevConversation[0];

      const lastMessageTimestamp = new Date(
        conversation.last_message_timestamp
      );

      const now = new Date();

      const diff = Math.abs(now.getTime() - lastMessageTimestamp.getTime());

      const diffMinutes = Math.ceil(diff / (1000 * 60));

      if (diffMinutes < 1) {
        // 1 minutes
        return message.reply(
          "Due to the high volume of messages, I'm not able to reply to you right now. Please try again after a few minutes."
        );
      }

      hasPreviousConversation = true;
      chatOptions = {
        conversationId: conversation.conversation_id,
        parentMessageId: conversation.parent_message_id,
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

    return message.reply(
      "I'm sorry, I'm not available at the moment to reply. Please try again after sometime."
    );
  }
};
