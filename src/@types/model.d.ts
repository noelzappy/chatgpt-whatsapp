export type TPrefix = {
  isPrefix: boolean;
  message: string;
  prefix: string;
  systemMessage?: string;
};

export type DataModel = {
  last_message: string;
  message_id: string;
  conversation_id: string;
  sender_id: string;
  last_response: string;
  last_message_timestamp: string;
  parent_message_id: string;
};

export type Recipient = {
  phone: string;
  relationship: string;
};

export type ChatMessageResponse = {
  chatId: string;
  message: string;
};

export type ChatMessage = {
  message: string;
  systemMessage?: string;
};
