import process from 'process';
import dotenv from 'dotenv';
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
} from 'openai';
import { ChatMessage, ChatMessageResponse } from '../@types/model';
import { OPENAI_MODEL, DEFAULT_SYSTEM_MESSAGE } from './constant';

dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

// ChatGPT Client
const openai = new OpenAIApi(configuration);

export default openai;

export const sendMessage = async (
  messagePrompt: ChatMessage,
): Promise<ChatMessageResponse> => {
  const prompt: ChatCompletionRequestMessage[] = [
    {
      role: 'user',
      content: messagePrompt.message,
    },
    {
      role: 'system',
      content: messagePrompt.systemMessage || DEFAULT_SYSTEM_MESSAGE,
    },
  ];

  const { data } = await openai.createChatCompletion({
    model: OPENAI_MODEL,
    messages: prompt,
  });

  console.log(prompt);

  const message: ChatCompletionResponseMessage = data.choices[0].message;

  return {
    chatId: data.id,
    message: message.content,
  };
};
