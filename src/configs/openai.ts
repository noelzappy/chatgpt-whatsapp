import process from 'process';
import dotenv from 'dotenv';

import OpenAI from 'openai';
import { ChatMessage, ChatMessageResponse } from '../@types/model';
import { OPENAI_MODEL, DEFAULT_SYSTEM_MESSAGE } from './constant';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;

export const sendMessage = async (
  messagePrompt: ChatMessage,
): Promise<ChatMessageResponse> => {
  const prompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  if (messagePrompt.quotedMessage) {
    prompt.push({
      role: 'user',
      content: messagePrompt.quotedMessage,
    });
  }
  prompt.push({
    role: 'user',
    content: messagePrompt.message,
  });
  prompt.push({
    role: 'system',
    content: messagePrompt.systemMessage || DEFAULT_SYSTEM_MESSAGE,
  });

  const data = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: prompt,
  });

  const message = data.choices[0].message;

  return {
    chatId: data.id,
    message: message.content,
  };
};
