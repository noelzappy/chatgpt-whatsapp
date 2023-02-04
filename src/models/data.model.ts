type DataModel = {
  last_message: string;
  message_id: string;
  conversation_id: string;
  sender_id: string;
  author_id: string;
  author_name: string;
  last_response: string;
  last_message_timestamp: string;
  parent_message_id: string;
  is_group_chat: string;
};

export type Recipient = {
  phone: string;
  relationship: string;
};

export default DataModel;
