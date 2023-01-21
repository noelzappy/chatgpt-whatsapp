import Prefix from "../models/prefix.model";
import { prefixes, removablePrefixes } from "../configs/constants.config";

export const getPrefix = (message: string): Prefix => {
  const containsPrefix = prefixes.some((prefix) => message.includes(prefix));

  if (!containsPrefix) return { isPrefix: false, message, prefix: "" };

  const prefix = prefixes.find((prefix) => message.includes(prefix));

  const isRemovable = removablePrefixes.includes(prefix);

  const messageWithoutPrefix = isRemovable
    ? message.replace(prefix, "").trim()
    : message;

  return { isPrefix: true, message: messageWithoutPrefix, prefix };
};
