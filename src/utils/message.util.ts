import {Message} from "whatsapp-web.js";

export const isGroupChat = (msg: Message) => {
    return !!msg.author;
}

export const getSenderId = (msg: Message) => {
    return isGroupChat(msg) ? msg.author : msg.from;
}

export const getGroupChatId = (msg: Message) => {
    return isGroupChat(msg) ? msg.from : null;
}

export const getSenderName = (msg: Message) => {
    // @ts-ignore
    return isGroupChat(msg) ? msg.rawData.notifyName : null;
}
