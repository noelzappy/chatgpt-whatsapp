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
import {getGroupChatId, getSenderId, getSenderName, isGroupChat} from "../utils/message.util"

export const handler = async (message: Message, p: any) => {
  try {
    const start = Date.now();

    Logger.info(JSON.stringify(message, null, 2));

    const prefix: Prefix = getPrefix(message.body);

    const prompt = prefix.message;

    if (!prefix.isPrefix) return;

    if(isGroupChat(message)){
      // @ts-ignore
      Logger.info(`Received prompt from Group Chat ${getGroupChatId(message)} author ${getSenderId(message)}(${getSenderName(message)}): ${prompt}`);
    }else {
      Logger.info(`Received prompt from ${message.from}: ${prompt}`);
    }


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
        sender_id: getSenderId(message),
        last_response: response.text,
        last_message_timestamp: new Date().toISOString(),
        parent_message_id: response.parentMessageId,
        notifyName: getSenderName(message),
        group_chat_id: getGroupChatId(message)
      };
      await saveConversation(conversation);
    } else {
      // Update the conversation
      await updateSingleMessageFromSender(
        getSenderId(message),
        prompt,
        response.text,
        response.id,
        new Date().toISOString()
      );
    }

    if(isGroupChat(message)){
      Logger.info(`Answer to Group Chat ${getGroupChatId(message)} author ${getSenderId(message)}(${getSenderName(message)}): ${response.text}`);
    }else {
      Logger.info(`Answer to Private Chat ${getSenderId(message)}: ${response.text}`);
    }


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
