import { TPrefix } from '../@types/model';
import { PREFIXES, REMOVABLE_PREFIXES } from '../configs/constant';

export const countWords = (sentence: string): number => {
  const arr = sentence.split(' ');

  return arr.filter((word) => word !== '').length;
};

export const getPrefix = (message: string): TPrefix => {
  const prefix = PREFIXES.find((prefix) => message.includes(prefix));

  const isRemovable = REMOVABLE_PREFIXES.includes(prefix);

  const messageWithoutPrefix = isRemovable
    ? message.replace(prefix, '').trim()
    : message;

  const initIndex: number = messageWithoutPrefix.indexOf('[');
  const endIndex: number = messageWithoutPrefix.indexOf(']');

  const systemMessage = messageWithoutPrefix.slice(initIndex, endIndex + 1);

  const pref: TPrefix = {
    isPrefix: !!prefix,
    message: messageWithoutPrefix.replace(systemMessage, '').trim(),
    prefix,
    systemMessage: systemMessage.replace('[', '').replace(']', ''),
  };

  return pref;
};
