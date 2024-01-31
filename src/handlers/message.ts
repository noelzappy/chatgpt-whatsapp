import Logger from '../utils/logger.util';
import { countWords, getPrefix } from '../utils/misc';
import { Chat, Message } from 'whatsapp-web.js';
import { ChatMessage, TPrefix } from '../@types/model';
import { sendMessage } from '../configs/openai';

const handler = async (message: Message): Promise<void> => {
  try {
    const start = Date.now();

    const chat: Chat = await message.getChat();



   const quotedMessage = await message.getQuotedMessage()




    const prefix: TPrefix = getPrefix(message.body);

    const prompt: ChatMessage = {
      message: prefix.message.trim(),
      systemMessage: prefix.systemMessage,
      quotedMessage: quotedMessage.body
    };

    if (!prefix.isPrefix && chat.isGroup) return;

    chat.sendStateTyping();

    Logger.info(`Received prompt from ${message.from}: ${prompt.message}`);

    const promptLength = countWords(prompt.message);
    if (promptLength > 70) {
       message.reply(
        'MAXIMUM OF 70 WORDS PER MESSAGE ONLY.\nFor longer messages please visit \nhttps://chat.openai.com/ \nOr contact Wordnox.com for a custom solution.',
       );
      return;
    }

    const response = await sendMessage(prompt);

    Logger.info(`Answer to ${message.from}: ${response.message}`);

    message.reply(response.message);

    const end = Date.now() - start;

    Logger.info(`ChatGPT took ` + end + 'ms');
  } catch (error) {
    Logger.error(`Failed to send message to ChatGPT API: ` + error);

    message.reply(
      "I'm sorry, I'm not available at the moment to reply. Please try again after sometime.",
    );
  }
};

export default handler;
