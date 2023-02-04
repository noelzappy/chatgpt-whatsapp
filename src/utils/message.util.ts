import {Message} from "whatsapp-web.js";

export const isGroupChat = (msg: Message) => {
    return !!msg.author;
}

export const getAuthorId = (msg: Message) => {
    return isGroupChat(msg) ? msg.author : msg.from;
}

export const getSenderId = (msg: Message) => {
    return msg.from;
}

export const getAuthorName = (msg: Message) => {
    // @ts-ignore
    return isGroupChat(msg) ? msg.rawData.notifyName : null;
}
